import React, { useState, useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import StudentKPIs from './components/StudentKPIs';
import AdvancedStudentFilters from './components/AdvancedStudentFilters';
import RiskDistributionChart from './components/RiskDistributionChart';
import ScoreTrendChart from './components/ScoreTrendChart';
import ProgressByCourseChart from './components/ProgressByCourseChart';
import StudentGroupTable from './components/StudentGroupTable';
import WarningActionBox from './components/WarningActionBox';
import StudentGroupDetailModal from './components/StudentGroupDetailModal';
import { mockStudentTrackingData } from '../../data/mockData';

const StudentTracking = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    course: 'all',
    class: 'all',
    semester: 'all',
    riskLevel: 'all',
    academicYear: 'all'
  });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [modalStudents, setModalStudents] = useState([]);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setStudents(mockStudentTrackingData.students || []);
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán stats
  const stats = React.useMemo(() => {
    const total = students.length;
    const active = students.filter(s => s.status === 'active').length;
    const atRisk = students.filter(s => 
      s.riskLevel === 'high' || 
      (s.completionRate < 70) || 
      (s.averageScore < 6.0)
    ).length;
    const completed = students.filter(s => s.completionRate >= 80).length;
    const avgScore = students.length > 0
      ? students.reduce((sum, s) => sum + (s.averageScore || 0), 0) / students.length
      : 0;

    return {
      totalStudents: total,
      activeStudents: active,
      atRiskPercentage: total > 0 ? Math.round((atRisk / total) * 100) : 0,
      completedPercentage: total > 0 ? Math.round((completed / total) * 100) : 0,
      averageScore: avgScore
    };
  }, [students]);

  // Nhóm sinh viên theo năm (mock data)
  const studentGroups = React.useMemo(() => {
    return [
      {
        group: 'Năm 1',
        count: 120,
        averageScore: 7.8,
        averageProgress: 82,
        highRiskRate: 5
      },
      {
        group: 'Năm 2',
        count: 100,
        averageScore: 7.4,
        averageProgress: 79,
        highRiskRate: 10
      },
      {
        group: 'Năm 3',
        count: 80,
        averageScore: 7.2,
        averageProgress: 75,
        highRiskRate: 15
      },
      {
        group: 'Năm 4',
        count: 70,
        averageScore: 7.9,
        averageProgress: 86,
        highRiskRate: 2
      }
    ];
  }, []);

  // Dữ liệu biểu đồ điểm trung bình
  const scoreTrendData = React.useMemo(() => {
    return [
      { period: 'T7/2024', score: 7.5 },
      { period: 'T8/2024', score: 7.6 },
      { period: 'T9/2024', score: 7.7 },
      { period: 'T10/2024', score: 7.8 },
      { period: 'T11/2024', score: 7.9 },
      { period: 'T12/2024', score: 8.0 }
    ];
  }, []);

  // Dữ liệu biểu đồ tiến độ theo khóa
  const progressByCourseData = React.useMemo(() => {
    return [
      { name: 'Nhập môn lập trình', progress: 85 },
      { name: 'Kĩ thuật lập trình', progress: 78 },
      { name: 'Lập trình hướng đối tượng', progress: 82 },
      { name: 'CTDL&GT', progress: 73 }
    ];
  }, []);
    
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    // Filter students based on new filters
    // This would filter the students list in a real app
  };

  const handleViewGroupDetails = (filters) => {
    // Show modal with filtered students
    setModalStudents(students);
    setSelectedGroup({ group: 'Nhóm đã lọc', ...filters });
    setShowGroupModal(true);
  };

  const handleRiskSegmentClick = (riskLevel) => {
    const filtered = students.filter(s => s.riskLevel === riskLevel);
    setModalStudents(filtered);
    setSelectedGroup({ group: `Nhóm rủi ro: ${riskLevel === 'high' ? 'Cao' : riskLevel === 'medium' ? 'Trung bình' : 'Thấp'}` });
    setShowGroupModal(true);
  };

  const handleCourseBarClick = (courseData) => {
    // Filter students by course
    const filtered = students.filter(s => 
      s.courses?.some(c => c.name === courseData.name)
    );
    setModalStudents(filtered);
    setSelectedGroup({ group: `Khóa học: ${courseData.name}` });
    setShowGroupModal(true);
  };

  const handleGroupClick = (groupData) => {
    // Mock: filter students by year
    const filtered = students.slice(0, Math.min(groupData.count, students.length));
    setModalStudents(filtered);
    setSelectedGroup(groupData);
    setShowGroupModal(true);
  };

  const handleSendNotification = (warnings) => {
    alert(`Đã gửi thông báo về ${warnings.length} cảnh báo tới giảng viên phụ trách`);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-4">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <BarChart3 className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Phân tích Sinh viên Ngành</h1>
              <p className="text-gray-600 mt-1">
                Theo dõi xu hướng học tập, mức độ rủi ro và kết quả đào tạo của sinh viên toàn ngành
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Cards */}
        <StudentKPIs stats={stats} />

        {/* Advanced Filters */}
        <AdvancedStudentFilters
        onFilterChange={handleFilterChange}
          onViewGroupDetails={handleViewGroupDetails}
        />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Risk Distribution Chart */}
          <div className="lg:col-span-1">
            <RiskDistributionChart
        students={students}
              onSegmentClick={handleRiskSegmentClick}
            />
          </div>

          {/* Score Trend Chart */}
          <div className="lg:col-span-2">
            <ScoreTrendChart
              data={scoreTrendData}
              onPointClick={() => {}}
            />
          </div>
        </div>

        {/* Progress by Course Chart */}
        <div className="mb-6">
          <ProgressByCourseChart
            data={progressByCourseData}
            onBarClick={handleCourseBarClick}
        />
        </div>

        {/* Student Group Table and Warning Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Group Table */}
          <div className="lg:col-span-2">
            <StudentGroupTable
              groups={studentGroups}
              onGroupClick={handleGroupClick}
            />
          </div>

          {/* Warning Box */}
          <div className="lg:col-span-1">
            <WarningActionBox
              warnings={[]}
              onSendNotification={handleSendNotification}
            />
          </div>
        </div>
      </div>

      {/* Group Detail Modal */}
      <StudentGroupDetailModal
        isOpen={showGroupModal}
          onClose={() => {
          setShowGroupModal(false);
          setSelectedGroup(null);
          setModalStudents([]);
          }}
        groupData={selectedGroup}
        students={modalStudents}
        />
    </div>
  );
};

export default StudentTracking;
