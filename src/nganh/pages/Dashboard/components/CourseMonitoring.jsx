import React from 'react';
import { Clock, Users, TrendingUp, MoreVertical } from 'lucide-react';

const CourseMonitoring = ({ data }) => {
  if (!data) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang diễn ra' },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp diễn ra' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' }
    };
    
    return statusConfig[status] || statusConfig.active;
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 80) return 'text-success-600';
    if (performance >= 60) return 'text-warning-600';
    return 'text-danger-600';
  };

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Theo Dõi Khóa Học</h3>
          <p className="text-sm text-gray-600">Trạng thái và hiệu suất các khóa học</p>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {data.map((course, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 mb-1">{course.name}</h4>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{course.enrolledStudents} sinh viên</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
              <span className={getStatusBadge(course.status).class}>
                {getStatusBadge(course.status).text}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Tiến độ hoàn thành</span>
                  <span className="font-medium text-gray-900">{course.completionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.completionRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="ml-4 text-right">
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4 text-gray-400" />
                  <span className={`text-sm font-medium ${getPerformanceColor(course.averageScore)}`}>
                    {course.averageScore}%
                  </span>
                </div>
                <p className="text-xs text-gray-500">Điểm TB</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
          Xem tất cả khóa học
        </button>
      </div>
    </div>
  );
};

export default CourseMonitoring;