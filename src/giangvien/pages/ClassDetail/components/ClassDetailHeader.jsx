import React, { useMemo } from 'react';
import { Users, Clock, MapPin, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';

const ClassDetailHeader = ({ classData }) => {
  // Tính số bài tập đang mở từ assignments thực tế
  const activeAssignmentsCount = useMemo(() => {
    if (classData.assignments && Array.isArray(classData.assignments)) {
      return classData.assignments.filter(a => a.status === 'active').length;
    }
    return classData.activeAssignments || 0;
  }, [classData.assignments, classData.activeAssignments]);
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang diễn ra' },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp diễn ra' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      cancelled: { class: 'status-badge status-at-risk', text: 'Đã hủy' }
    };

    return statusConfig[status] || statusConfig.active;
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'bg-success-600';
    if (rate >= 70) return 'bg-primary-600';
    if (rate >= 60) return 'bg-warning-600';
    return 'bg-danger-600';
  };

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-2xl font-bold text-gray-700">{classData.name}</h1>
            <span className={getStatusBadge(classData.status).class}>
              {getStatusBadge(classData.status).text}
            </span>
          </div>

          <p className="text-lg text-gray-600 mb-4">{classData.course}</p>

          <div className="mb-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span className="text-sm">{classData.students?.length || classData.enrolledStudents || 0} sinh viên</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Tiến độ hoàn thành lớp học</span>
                <span className="font-medium text-gray-700">{Math.round(classData.completionRate || 0)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all duration-300 ${getCompletionColor(classData.completionRate || 0)}`}
                  style={{ width: `${classData.completionRate || 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:w-64">
          <div className="text-center p-4 bg-success-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-success-600" />
            </div>
            <p className="text-2xl font-bold text-success-600">{Math.round(classData.completionRate || 0)}%</p>
            <p className="text-xs text-gray-600">Hoàn thành TB</p>
          </div>

          <div className="text-center p-4 bg-warning-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <AlertTriangle className="h-5 w-5 text-warning-600" />
            </div>
            <p className="text-2xl font-bold text-warning-600">{activeAssignmentsCount}</p>
            <p className="text-xs text-gray-600">Bài tập mở</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassDetailHeader;