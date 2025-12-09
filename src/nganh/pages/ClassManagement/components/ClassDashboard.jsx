import React, { useState, useMemo } from 'react';
import { BookOpen, Clock, Users, GraduationCap, TrendingUp, AlertTriangle, Filter, Search, Calendar, MapPin } from 'lucide-react';
import { mockClassData } from '../../../data/mockData';
import ClassDetailModal from './ClassDetailModal';

const ClassDashboard = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    course: 'all',
    schedule: 'all'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const classes = mockClassData.classes || [];
  const stats = mockClassData.stats || {};

  // Tính toán KPI từ dữ liệu
  const kpiData = useMemo(() => {
    const totalClasses = classes.length;
    const ongoingClasses = classes.filter(c => c.status === 'active').length;
    const totalStudents = classes.reduce((sum, c) => sum + (c.enrolledStudents || 0), 0);
    const avgScore = classes.length > 0 
      ? (classes.reduce((sum, c) => sum + (c.averageScore || 0), 0) / classes.length).toFixed(1)
      : 0;
    const avgCompletion = classes.length > 0
      ? Math.round(classes.reduce((sum, c) => sum + (c.completionRate || 0), 0) / classes.length)
      : 0;
    const atRiskClasses = classes.filter(c => (c.completionRate || 0) < 60).length;

    return {
      totalClasses,
      ongoingClasses,
      totalStudents,
      avgScore,
      avgCompletion,
      atRiskClasses
    };
  }, [classes]);

  // Lọc classes theo filters
  const filteredClasses = useMemo(() => {
    return classes.filter(c => {
      const matchesStatus = filters.status === 'all' || c.status === filters.status;
      const matchesCourse = filters.course === 'all' || c.courseId === filters.course;
      const matchesSchedule = filters.schedule === 'all';
      const matchesSearch = !searchTerm || 
        (c.name && c.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (c.course && c.course.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesCourse && matchesSchedule && matchesSearch;
    });
  }, [classes, filters, searchTerm]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({ status: 'all', course: 'all', schedule: 'all' });
    setSearchTerm('');
  };

  const getStatusColor = (completionRate) => {
    if (completionRate >= 80) return 'bg-emerald-500';
    if (completionRate >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getStatusLabel = (completionRate) => {
    if (completionRate >= 80) return 'Tốt';
    if (completionRate >= 60) return 'Đạt yêu cầu';
    return 'Cần cải thiện';
  };

  return (
    <div className="p-4 text-sm space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Tổng Lớp Học</span>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiData.totalClasses}</div>
          <div className="text-[10px] text-gray-500 mt-1">so với ~0% tháng trước</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Lớp Đang Diễn Ra</span>
            <Clock className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiData.ongoingClasses}</div>
          <div className="text-[10px] text-gray-500 mt-1">so với ~0% tháng trước</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Tổng Sinh Viên</span>
            <Users className="h-5 w-5 text-orange-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiData.totalStudents}</div>
          <div className="text-[10px] text-gray-500 mt-1">so với ~0% tháng trước</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Điểm Trung Bình</span>
            <GraduationCap className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiData.avgScore}/10</div>
          <div className="text-[10px] text-gray-500 mt-1">so với ~0% tháng trước</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Tỷ Lệ Hoàn Thành</span>
            <TrendingUp className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiData.avgCompletion}%</div>
          <div className="text-[10px] text-gray-500 mt-1">so với ~0% tháng trước</div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-600">Lớp Cần Chú Ý</span>
            <AlertTriangle className="h-5 w-5 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{kpiData.atRiskClasses}</div>
          <div className="text-[10px] text-gray-500 mt-1">so với ~0% tháng trước</div>
        </div>
      </div>

      {/* Filters - Sticky */}
      <div className="bg-white rounded-lg shadow p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-900">Bộ lọc</span>
            <span className="text-xs text-gray-500">({filteredClasses.length} lớp học)</span>
          </div>
          <button
            onClick={resetFilters}
            className="text-xs text-blue-600 hover:text-blue-700"
          >
            Đặt lại bộ lọc
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="h-4 w-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo lớp"
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang diễn ra</option>
            <option value="upcoming">Sắp diễn ra</option>
            <option value="completed">Hoàn thành</option>
          </select>

          <select
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.course}
            onChange={(e) => handleFilterChange('course', e.target.value)}
          >
            <option value="all">Tất cả khóa học</option>
            <option value="intro-prog">Nhập môn lập trình</option>
            <option value="prog-technique">Kĩ thuật lập trình</option>
            <option value="oop">Lập trình hướng đối tượng</option>
            <option value="data-struct-algo">Cấu trúc dữ liệu và giải thuật</option>
          </select>

          <select
            className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={filters.schedule}
            onChange={(e) => handleFilterChange('schedule', e.target.value)}
          >
            <option value="all">Tất cả lịch học</option>
            <option value="morning">Buổi sáng</option>
            <option value="afternoon">Buổi chiều</option>
          </select>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((classItem) => (
          <div key={classItem.id} className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow relative">
            {/* Average Score Badge */}
            <div className="absolute top-4 right-4 text-xs font-semibold text-gray-700">
              ~{classItem.averageScore?.toFixed(1) || '0.0'}
            </div>

            {/* Course Code & Name */}
            <div className="mb-3 pr-16">
              <div className="text-sm font-semibold text-gray-900">{classItem.name}</div>
              <div className="text-xs text-gray-600 mt-1">{classItem.course}</div>
            </div>

            {/* Status Badge */}
            <div className="mb-3">
              <span className={`inline-flex px-2 py-1 text-[10px] font-medium rounded-full ${
                classItem.status === 'active' 
                  ? 'bg-emerald-100 text-emerald-700'
                  : classItem.status === 'upcoming'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {classItem.status === 'active' ? 'Đang diễn ra' : classItem.status === 'upcoming' ? 'Sắp diễn ra' : 'Hoàn thành'}
              </span>
            </div>

            {/* Student Count */}
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <Users className="h-3.5 w-3.5 mr-1.5" />
              <span>{classItem.enrolledStudents} sinh viên</span>
            </div>

            {/* Schedule */}
            <div className="flex items-center text-xs text-gray-600 mb-2">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              <span>{classItem.schedule}</span>
            </div>

            {/* Location & Duration */}
            <div className="flex items-start gap-3 text-xs text-gray-600 mb-3">
              <div className="flex items-center">
                <MapPin className="h-3.5 w-3.5 mr-1.5" />
                <span>{classItem.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                <span>{classItem.duration}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Tiến độ hoàn thành</span>
                <span className="font-semibold text-gray-900">{Math.round(classItem.completionRate || 0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getStatusColor(classItem.completionRate || 0)}`}
                  style={{ width: `${classItem.completionRate || 0}%` }}
                />
              </div>
            </div>


            {/* View Details Link */}
            <div className="pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setSelectedClass(classItem);
                  setShowDetailModal(true);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Xem chi tiết →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Class Detail Modal */}
      {showDetailModal && (
        <ClassDetailModal
          classItem={selectedClass}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedClass(null);
          }}
        />
      )}
    </div>
  );
};

export default ClassDashboard;

