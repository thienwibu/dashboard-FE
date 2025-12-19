import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Plus, Users, TrendingUp, AlertTriangle, Award } from 'lucide-react';
import StudentTrackingHeader from './components/StudentTrackingHeader';
import StudentFilters from './components/StudentFilters';
import StudentGrid from './components/StudentGrid';
import StudentList from './components/StudentList';
import StudentAnalytics from './components/StudentAnalytics';
import StudentDetailModal from './components/StudentDetailModal';
import { mockStudentTrackingData } from '../../data/mockData';
import localStorageService from '../../services/localStorageService';

const StudentTracking = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list', or 'analytics'
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    course: 'all',
    class: 'all',
    performance: 'all',
    riskLevel: 'all'
  });

  useEffect(() => {
    loadStudentData();
    
    // Lắng nghe sự kiện refresh từ dataService
    const handleRefresh = () => loadStudentData();
    window.addEventListener('dataRefresh', handleRefresh);
    
    // Reload khi quay lại trang (visibility change)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadStudentData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('dataRefresh', handleRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [filters]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Lấy tất cả sinh viên từ localStorage
      const storedStudents = localStorageService.getStudents();
      
      // Nếu có dữ liệu trong localStorage, dùng nó
      // Nếu không, dùng mockData
      const studentsToUse = storedStudents || mockStudentTrackingData.students;
      
      setStudents(studentsToUse);
      console.log('📊 Đã load', studentsToUse.length, 'sinh viên từ', storedStudents ? 'localStorage' : 'mockData');
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleStudentSelect = (student) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  const handleExportData = () => {
    // Export functionality
    console.log('Exporting student data...');
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      student.studentId.toLowerCase().includes(filters.search.toLowerCase());

    const matchesStatus = filters.status === 'all' || student.status === filters.status;
    const matchesCourse = filters.course === 'all' || student.courses.some(c => c.id === filters.course);
    const matchesClass = filters.class === 'all' || student.classes.some(c => c.id === filters.class);
    const matchesPerformance = filters.performance === 'all' ||
      (filters.performance === 'excellent' && student.averageScore >= 8.0) ||
      (filters.performance === 'good' && student.averageScore >= 6.5 && student.averageScore < 8.0) ||
      (filters.performance === 'average' && student.averageScore >= 5.0 && student.averageScore < 6.5) ||
      (filters.performance === 'weak' && student.averageScore >= 4.0 && student.averageScore < 5.0) ||
      (filters.performance === 'poor' && student.averageScore < 4.0);

    const matchesRisk = filters.riskLevel === 'all' || student.riskLevel === filters.riskLevel;

    return matchesSearch && matchesStatus && matchesCourse && matchesClass && matchesPerformance && matchesRisk;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="card p-6">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StudentTrackingHeader
        totalStudents={students.length}
        filteredCount={filteredStudents.length}
        onExport={handleExportData}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <StudentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        students={students}
      />

      {viewMode === 'grid' && (
        <StudentGrid
          students={filteredStudents}
          onStudentSelect={handleStudentSelect}
          onStudentDeleted={loadStudentData}
          loading={loading}
        />
      )}

      {viewMode === 'list' && (
        <StudentList
          students={filteredStudents}
          onStudentSelect={handleStudentSelect}
          onStudentDeleted={loadStudentData}
          loading={loading}
        />
      )}

      {viewMode === 'analytics' && (
        <StudentAnalytics
          students={filteredStudents}
          allStudents={students}
        />
      )}

      {showDetailModal && selectedStudent && (
        <StudentDetailModal
          student={selectedStudent}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStudent(null);
          }}
        />
      )}
    </div>
  );
};

export default StudentTracking;