import React from 'react';
import { Users, Clock, Calendar, TrendingUp, MapPin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClassList = ({ classes }) => {
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
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lớp học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sinh viên
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lịch học
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tiến độ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Điểm TB
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.map((classItem) => (
              <tr key={classItem.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {classItem.name}
                    </div>
                    <div className="text-sm text-gray-500">{classItem.course}</div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {classItem.location}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={getStatusBadge(classItem.status).class}>
                    {getStatusBadge(classItem.status).text}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">{classItem.enrolledStudents}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      {classItem.schedule}
                    </div>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {classItem.duration}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium text-gray-900">{Math.round(classItem.completionRate || 0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor(classItem.completionRate || 0)}`}
                          style={{ width: `${classItem.completionRate || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 text-gray-400 mr-2" />
                    <span className={`text-sm font-medium ${getPerformanceColor(classItem.averageScore || 0)}`}>
                      {(classItem.averageScore || 0).toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    to={`/classes/${classItem.id}`}
                    className="text-primary-600 hover:text-primary-900 inline-flex items-center"
                  >
                    Chi tiết
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassList;