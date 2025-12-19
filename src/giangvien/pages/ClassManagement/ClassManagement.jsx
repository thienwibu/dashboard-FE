import { useState, useEffect } from 'react';
import { Grid, List, RefreshCw } from 'lucide-react';
import ClassCard from './components/ClassCard';
import ClassList from './components/ClassList';
import ClassFilters from './components/ClassFilters';
import ClassStats from './components/ClassStats';
import StudentPerformanceDistribution from './components/StudentPerformanceDistribution';
import ExportDropdown from '../../components/ExportDropdown';
import SmartSearchInput from '../../components/SmartSearchInput';
import { mockClassData, mockStudentTrackingData } from '../../data/mockData';
import localStorageService from '../../services/localStorageService';
import dataService from '../../services/dataService';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    course: 'all',
    schedule: 'all',
    performance: 'all'
  });

  useEffect(() => {
    // Khởi tạo localStorage từ mockData lần đầu
    localStorageService.initializeFromMockData({
      classDetails: mockClassData.classDetails,
      classes: mockClassData.classes,
      students: mockStudentTrackingData.students
    });
    
    loadClassData();
    
    // Lắng nghe sự kiện refresh từ dataService
    const handleRefresh = () => loadClassData();
    window.addEventListener('dataRefresh', handleRefresh);
    
    // Reload khi quay lại trang (visibility change)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadClassData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    applyFilters();
  }, [classes, searchTerm, filters]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Lấy dữ liệu từ localStorage
      const storedClasses = localStorageService.getClasses();
      const classDetails = localStorageService.getClassDetails();
      
      let classesToUse = storedClasses || mockClassData.classes;
      
      // Đồng bộ số lượng sinh viên từ classDetails
      if (classDetails) {
        classesToUse = classesToUse.map(classItem => {
          const details = classDetails[classItem.id];
          if (details && details.students) {
            return {
              ...classItem,
              enrolledStudents: details.students.length
            };
          }
          return classItem;
        });
        
        // Lưu lại vào localStorage để đồng bộ
        localStorageService.saveClasses(classesToUse);
      }
      
      setClasses(classesToUse);
      console.log('📊 Đã load dữ liệu lớp học từ localStorage');
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = classes.filter(classItem => {
      const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.course.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || classItem.status === filters.status;
      const matchesCourse = filters.course === 'all' || classItem.courseId === filters.course;

      // Lọc theo tiến độ hoàn thành (%)
      let matchesCompletion = true;
      if (filters.performance !== 'all') {
        const completion = classItem.completionRate;
        switch (filters.performance) {
          case 'excellent':
            matchesCompletion = completion >= 85;
            break;
          case 'good':
            matchesCompletion = completion >= 75 && completion < 85;
            break;
          case 'average':
            matchesCompletion = completion >= 65 && completion < 75;
            break;
          case 'poor':
            matchesCompletion = completion < 65;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesCourse && matchesCompletion;
    });

    setFilteredClasses(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRefresh = () => {
    loadClassData();
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting class data...');
  };

  // Hàm xử lý thêm sinh viên - cập nhật state và localStorage
  const handleAddStudent = (classId, studentData) => {
    // Tìm thông tin lớp học
    const classInfo = classes.find(c => c.id === classId);
    
    // Tạo đối tượng sinh viên mới
    const newStudent = {
      id: Date.now(), // Tạo ID tạm thời
      name: studentData.name,
      studentId: studentData.studentId,
      email: studentData.email || `${studentData.studentId}@student.edu.vn`,
      phone: studentData.phone || '',
      status: 'active',
      completionRate: 0,
      averageScore: 0,
      completedAssignments: 0,
      totalAssignments: 0,
      scoreChange: 0,
      enrollmentDate: new Date().toISOString().split('T')[0],
      courses: classInfo ? [{ id: classInfo.courseId, name: classInfo.course }] : [],
      classes: classInfo ? [{ id: classInfo.id, name: classInfo.name }] : [],
      recentAssignments: [],
      notes: [],
      riskLevel: 'low' // Mặc định là low risk cho sinh viên mới
    };

    // Kiểm tra sinh viên đã có trong lớp chưa (theo MSSV)
    const classDetails = localStorageService.getClassDetails() || {};
    if (classDetails[classId]) {
      const isAlreadyInClass = classDetails[classId].students.some(
        s => s.studentId === studentData.studentId
      );
      if (isAlreadyInClass) {
        alert('⚠️ Sinh viên đã có trong lớp này!');
        return;
      }
    }

    // Lưu sinh viên vào localStorage
    const success = localStorageService.addStudentToClass(classId, newStudent);
    
    if (!success) {
      alert('❌ Không thể thêm sinh viên. Vui lòng thử lại!');
      return;
    }

    // Thêm sinh viên vào danh sách chung
    localStorageService.addStudent(newStudent);

    // Cập nhật số lượng sinh viên trong lớp
    const updatedClasses = classes.map(classItem => {
      if (classItem.id === classId) {
        const newCount = classItem.enrolledStudents + 1;
        // Cập nhật localStorage
        localStorageService.updateClassStudentCount(classId, newCount);
        return {
          ...classItem,
          enrolledStudents: newCount
        };
      }
      return classItem;
    });

    setClasses(updatedClasses);

    // Cập nhật mockData để đồng bộ với các trang khác (trong session hiện tại)
    if (mockClassData.classDetails[classId]) {
      mockClassData.classDetails[classId].students.push(newStudent);
    }
    mockStudentTrackingData.students.push(newStudent);

    console.log('✅ Đã thêm sinh viên:', studentData.name, 'vào lớp ID:', classId);
    console.log('💾 Đã lưu vào localStorage');
    console.log('📊 Số sinh viên hiện tại:', classDetails[classId]?.students.length + 1);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-700">Quản Lý Lớp Học</h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý tất cả các lớp học được phân công
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <SmartSearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tìm kiếm lớp học..."
              className="w-64"
            />
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Làm mới</span>
            </button>

            <ExportDropdown 
              onExport={(format, options) => {
                console.log('Exporting class management report:', format, options);
                handleExport();
              }}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <ClassStats data={mockClassData.stats} />

      {/* Student Performance Distribution */}
      <StudentPerformanceDistribution classDetails={mockClassData.classDetails} />

      {/* Filters */}
      <ClassFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        totalClasses={filteredClasses.length}
      />

      {/* Classes Display */}
      <div className="space-y-6">
        {filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Không tìm thấy lớp học nào
            </h3>
            <p className="text-gray-500">
              Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((classItem) => (
                  <ClassCard 
                    key={classItem.id} 
                    classData={classItem}
                    onAddStudent={handleAddStudent}
                  />
                ))}
              </div>
            ) : (
              <ClassList 
                classes={filteredClasses}
                onAddStudent={handleAddStudent}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;