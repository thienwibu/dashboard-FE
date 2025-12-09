import React from 'react';
import { Users, Clock, TrendingUp, Award, BarChart3, ArrowRight, GraduationCap, UserCheck, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, courses = [] }) => {
  if (!course) return null;

  // Tính trung bình ngành
  const industryAvgCompletion = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (c.completionRate || 0), 0) / courses.length)
    : 0;
  
  // So sánh với trung bình ngành
  const completionDiff = (course.completionRate || 0) - industryAvgCompletion;
  const comparisonText = completionDiff > 0 
    ? `Cao hơn TB ngành +${Math.abs(completionDiff)}%`
    : completionDiff < 0
    ? `Thấp hơn TB ngành ${completionDiff}%`
    : `Bằng TB ngành`;

  // Xếp hạng khóa (dựa trên completion rate)
  const sortedCourses = [...courses].sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0));
  const rankingIndex = sortedCourses.findIndex(c => c.id === course.id);
  const ranking = rankingIndex >= 0 ? rankingIndex + 1 : null;
  const isTop3 = ranking !== null && ranking <= 3;

  // Tính tỷ lệ sinh viên: hoàn thành / đang học / bỏ học (mock data)
  const completedStudents = Math.round((course.enrolledStudents || 0) * (course.completionRate || 0) / 100);
  const inProgressStudents = Math.round((course.enrolledStudents || 0) * (1 - (course.completionRate || 0) / 100) * 0.8);
  const droppedStudents = (course.enrolledStudents || 0) - completedStudents - inProgressStudents;
  const getStatusBadge = (status) => {
    const styles = {
      active: 'bg-green-100 text-green-700 border-green-200',
      completed: 'bg-gray-100 text-gray-700 border-gray-200',
      upcoming: 'bg-blue-100 text-blue-700 border-blue-200'
    };
    
    const labels = {
      active: 'Đang hoạt động',
      completed: 'Đã hoàn thành',
      upcoming: 'Sắp diễn ra'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || styles.active}`}>
        {labels[status] || status}
      </span>
    );
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'bg-emerald-500';
    if (rate >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const getCompletionBarColor = (rate) => {
    if (rate >= 80) return 'bg-emerald-500';
    if (rate >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Top 3 Metrics */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <span className="text-xs text-gray-600">Giảng viên</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{course.instructorCount || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <GraduationCap className="h-4 w-4 text-purple-600" />
              <span className="text-xs text-gray-600">Lớp học</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{course.classCount || 0}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span className="text-xs text-gray-600">Hoàn thành</span>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-lg font-bold text-gray-900 mb-1">{course.completionRate || 0}%</p>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getCompletionBarColor(course.completionRate || 0)}`}
                  style={{ width: `${course.completionRate || 0}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Course Name - Prominent */}
        <div className="mb-3">
          <h3 className="text-xl font-bold text-blue-600 mb-1 group-hover:text-blue-700 transition-colors">
            {course.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            <span>{course.duration}</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          {getStatusBadge(course.status)}
        </div>

        {/* Completion Rate Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="text-gray-600">Tỷ lệ hoàn thành</span>
            <span className="font-semibold text-gray-900">{course.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${getCompletionBarColor(course.completionRate || 0)}`}
              style={{ width: `${course.completionRate || 0}%` }}
            />
          </div>
        </div>

        {/* Students and Instructors */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-xs text-gray-600">Sinh viên</p>
              <p className="text-sm font-semibold text-gray-900">{course.enrolledStudents}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-xs text-gray-600">Giảng viên</p>
              <p className="text-sm font-semibold text-gray-900">
                {course.instructorNames?.slice(0, 2).join(', ') || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Average Score Badge */}
        <div className="mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-semibold">
            <Award className="h-4 w-4" />
            Điểm TB toàn ngành: {course.averageScore?.toFixed(1) || '0.0'}/10
          </span>
        </div>

        {/* Tỷ lệ sinh viên: hoàn thành / đang học / bỏ học */}
        <div className="mb-4 bg-gray-50 rounded-lg p-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Users size={14} />
            Tỷ lệ sinh viên
          </h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-semibold text-green-600">{completedStudents}</div>
              <div className="text-gray-600">Hoàn thành</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-amber-600">{inProgressStudents}</div>
              <div className="text-gray-600">Đang học</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">{droppedStudents}</div>
              <div className="text-gray-600">Bỏ học</div>
            </div>
          </div>
        </div>

        {/* So sánh với trung bình ngành */}
        <div className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-700">So sánh với TB ngành:</span>
            <span className={`text-xs font-bold ${
              completionDiff > 0 ? 'text-green-600' : completionDiff < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {comparisonText}
            </span>
          </div>
        </div>

        {/* Xếp hạng khóa */}
        {isTop3 && (
          <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border border-amber-200">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">
                Top {ranking} khóa có tiến độ tốt nhất
              </span>
            </div>
          </div>
        )}

        {/* Chỉ báo màu */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-xs font-medium text-gray-600">Trạng thái:</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            (course.completionRate || 0) >= 85 
              ? 'bg-green-100 text-green-700'
              : (course.completionRate || 0) >= 70
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {(course.completionRate || 0) >= 85 
              ? '✓ Tốt'
              : (course.completionRate || 0) >= 70
              ? '⚠ Trung bình'
              : '✗ Cần chú ý'
            }
          </span>
        </div>

        {/* Last Updated */}
        <div className="mb-4 text-xs text-gray-500">
          Cập nhật: {course.lastUpdated || '3 ngày trước'}
        </div>

        {/* Phân tích khóa học Button */}
        <Link
          to={`/courses/${course.id}`}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg font-medium transition-colors group text-sm"
        >
          <span>Phân tích khóa học</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;

