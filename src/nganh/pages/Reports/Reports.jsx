import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Download } from 'lucide-react';
import ReportStats from './components/ReportStats';
import ReportFilters from './components/ReportFilters';
import ComparisonChart from './components/ComparisonChart';
import DetailedDataTable from './components/DetailedDataTable';
import InsightsPanel from './components/InsightsPanel';
import { mockDashboardData, mockStudentTrackingData, mockClassData } from '../../data/mockData';

const Reports = () => {
  const [stats, setStats] = useState({});
  const [performanceData, setPerformanceData] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filters, setFilters] = useState({ dateRange: 'week', reportType: 'all' });

  useEffect(() => {
    // Load stats
    setStats({
      totalStudents: mockDashboardData.kpiMetrics.totalStudents,
      studentChange: mockDashboardData.kpiMetrics.studentChange,
        totalTeachers: mockDashboardData.kpiMetrics.totalTeachers,
        teacherChange: mockDashboardData.kpiMetrics.teacherChange,
        activeCourses: mockDashboardData.kpiMetrics.activeCourses || 4,
        courseChange: mockDashboardData.kpiMetrics.courseChange || 0,
        activeClasses: 12,
        classChange: 2,
        averageScore: (mockDashboardData.kpiMetrics.averageProgress || 78.5) / 10,
        scoreChange: mockDashboardData.kpiMetrics.progressChange || 3.2,
        completionRate: mockDashboardData.kpiMetrics.averageProgress || 78.5,
        completionChange: mockDashboardData.kpiMetrics.progressChange || 3.2,
        atRiskStudents: mockDashboardData.kpiMetrics.atRiskStudents || 15,
        riskChange: mockDashboardData.kpiMetrics.riskChange || -5,
        atRiskCourses: 1,
        riskCourseChange: 0
    });

    // Load performance data
    setPerformanceData(mockDashboardData.performanceChart);

    // Load students
    setStudents(mockStudentTrackingData.students);

    // Load courses
    setCourses(mockDashboardData.courseMonitoring);
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // In real app, fetch data based on filters
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
                <h1 className="text-3xl font-bold text-gray-900">Phân Tích Ngành</h1>
                <p className="text-gray-600 mt-1">
                  Thống kê và phân tích toàn diện về hiệu suất ngành - giảng viên, khóa học, lớp học và sinh viên
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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

        {/* Comparison Chart */}
        <ComparisonChart currentData={performanceData} />

        {/* Insights Panel */}
        <InsightsPanel stats={stats} courses={courses} />

        {/* Detailed Data Table */}
        <DetailedDataTable 
          courses={courses} 
          classes={mockClassData.classes || []}
          students={students}
        />

        {/* Export Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Xuất Báo Cáo</h3>
              <p className="text-sm text-gray-600">Tải xuống báo cáo chi tiết định dạng PDF hoặc Excel</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => alert('Tính năng xuất PDF sẽ được triển khai')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              >
                <FileText className="h-4 w-4" />
                Xuất PDF
              </button>
              <button
                onClick={() => alert('Tính năng xuất Excel sẽ được triển khai')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Xuất Excel
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Reports;

