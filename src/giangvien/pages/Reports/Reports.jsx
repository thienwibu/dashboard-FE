import { useState, useEffect } from 'react';
import { BarChart3, Save } from 'lucide-react';
import ReportStats from './components/ReportStats';
import ReportFilters from './components/ReportFilters';
import PerformanceChart from './components/PerformanceChart';
import StudentReport from './components/StudentReport';
import CourseReport from './components/CourseReport';
import ExportReport from './components/ExportReport';
import SaveReportModal from './components/SaveReportModal';
import { mockDashboardData, mockStudentTrackingData } from '../../data/mockData';

const Reports = () => {
  const [stats, setStats] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [allStudents] = useState(mockStudentTrackingData.students);
  const [allCourses] = useState(mockDashboardData.courseMonitoring);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ 
    dateRange: 'week', 
    reportType: 'all',
    course: '',
    class: '',
    riskLevel: ''
  });
  const [isSaveReportModalOpen, setIsSaveReportModalOpen] = useState(false);

  // Filter data based on current filters
  useEffect(() => {
    let filteredStudents = [...allStudents];
    let filteredCourses = [...allCourses];

    // Filter by course
    if (filters.course) {
      filteredStudents = filteredStudents.filter(student =>
        student.courses?.some(c => c.id === filters.course)
      );
      filteredCourses = filteredCourses.filter(course =>
        course.name.toLowerCase().includes(filters.course.toLowerCase())
      );
    }

    // Filter by class
    if (filters.class) {
      filteredStudents = filteredStudents.filter(student =>
        student.courses?.some(c => c.className === filters.class)
      );
    }

    // Filter by risk level
    if (filters.riskLevel) {
      filteredStudents = filteredStudents.filter(student =>
        student.riskLevel === filters.riskLevel
      );
    }

    // Filter by report type
    if (filters.reportType !== 'all') {
      if (filters.reportType === 'students') {
        // Show only student-related data
      } else if (filters.reportType === 'courses') {
        // Show only course-related data
      }
    }

    setStudents(filteredStudents);
    setCourses(filteredCourses);

    // Update stats based on filtered data
    const atRiskCount = filteredStudents.filter(s => s.status === 'at_risk').length;
    const avgScore = filteredStudents.length > 0
      ? filteredStudents.reduce((sum, s) => sum + s.averageScore, 0) / filteredStudents.length
      : 0;
    const avgCompletion = filteredStudents.length > 0
      ? filteredStudents.reduce((sum, s) => sum + s.completionRate, 0) / filteredStudents.length
      : 0;

    setStats({
      totalStudents: filteredStudents.length,
      studentChange: mockDashboardData.kpiMetrics.studentChange,
      activeCourses: filteredCourses.length,
      courseChange: mockDashboardData.kpiMetrics.courseChange,
      averageScore: avgScore,
      scoreChange: mockDashboardData.kpiMetrics.completionChange,
      completionRate: avgCompletion,
      completionChange: mockDashboardData.kpiMetrics.completionChange,
      atRiskStudents: atRiskCount,
      riskChange: mockDashboardData.kpiMetrics.riskChange,
      pendingAssignments: 12,
      pendingChange: -5
    });

    // Load performance data
    setPerformanceData(mockDashboardData.performanceChart);
  }, [filters, allStudents, allCourses]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <BarChart3 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Báo cáo & Phân tích</h1>
                <p className="text-gray-600 mt-1">
                  Tổng quan và phân tích chi tiết về hoạt động học tập
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSaveReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-lg font-medium transition-colors"
              >
                <Save size={18} />
                <span className="hidden sm:inline">Lưu cấu hình</span>
              </button>
              <span className="text-sm text-gray-600">
                Cập nhật: {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <ReportStats stats={stats} />

        {/* Filters */}
        <ReportFilters onFilterChange={handleFilterChange} />

        {/* Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left Column - Charts & Student Report */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Chart */}
            <PerformanceChart data={performanceData} />

            {/* Student Report */}
            <StudentReport students={students} />
          </div>

          {/* Right Column - Course Report & Export */}
          <div className="lg:col-span-1 space-y-6">
            {/* Course Report */}
            <CourseReport courses={courses} />

            {/* Export Report */}
            <ExportReport />
          </div>
        </div>

        {/* Additional Insights */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-white rounded-lg shadow-sm">
              <BarChart3 className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Thông tin chi tiết
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Xu hướng điểm số</p>
                  <p className="font-semibold text-green-600">↗ Tăng 0.3 điểm so với tuần trước</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Tỷ lệ tham gia</p>
                  <p className="font-semibold text-blue-600">87% sinh viên tích cực</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Cảnh báo</p>
                  <p className="font-semibold text-red-600">{stats.atRiskStudents} sinh viên cần can thiệp</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Report Modal */}
        <SaveReportModal 
          isOpen={isSaveReportModalOpen}
          onClose={() => setIsSaveReportModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default Reports;

