import React from 'react';
import { Users, Clock, Calendar, TrendingUp, MapPin, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClassCard = ({ classData }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang diễn ra' },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp diễn ra' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      cancelled: { class: 'status-badge status-at-risk', text: 'Đã hủy' }
    };
    
    return statusConfig[status] || statusConfig.active;
  };

  const getPerformanceColor = (score) => {
    if (score >= 9.0) return 'text-success-600';
    if (score >= 8.0) return 'text-primary-600';
    if (score >= 7.0) return 'text-warning-600';
    return 'text-danger-600';
  };

  const getCompletionColor = (rate) => {
    if (rate >= 8.0) return 'bg-success-600';
    if (rate >= 7.0) return 'bg-primary-600';
    if (rate >= 6.0) return 'bg-warning-600';
    return 'bg-danger-600';
  };

  return (
    <div className="card p-6 hover:shadow-medium transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {classData.name}
            </h3>
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all">
              <MoreVertical className="h-4 w-4 text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-3">{classData.course}</p>
          <span className={getStatusBadge(classData.status).class}>
            {getStatusBadge(classData.status).text}
          </span>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="h-4 w-4" />
            <span>{classData.enrolledStudents} sinh viên</span>
          </div>
          <div className="flex items-center space-x-1">
            <TrendingUp className="h-4 w-4 text-gray-400" />
            <span className={`font-medium ${getPerformanceColor(classData.averageScore || 0)}`}>
              {(classData.averageScore || 0).toFixed(1)}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{classData.schedule}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{classData.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{classData.duration}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Tiến độ hoàn thành</span>
            <span className="font-medium text-gray-900">{Math.round(classData.completionRate || 0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor(classData.completionRate || 0)}`}
              style={{ width: `${classData.completionRate || 0}%` }}
            ></div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{classData.activeAssignments}</span> bài tập đang mở
          </div>
          <Link 
            to={`/classes/${classData.id}`}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Xem chi tiết →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClassCard;