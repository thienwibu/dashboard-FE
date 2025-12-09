import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from 'lucide-react';

const AssignmentProgress = ({ assignments, classId }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang mở', icon: Clock },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp mở', icon: Calendar },
      completed: { class: 'status-badge status-completed', text: 'Đã đóng', icon: CheckCircle },
      overdue: { class: 'status-badge status-at-risk', text: 'Quá hạn', icon: AlertCircle }
    };
    
    return statusConfig[status] || statusConfig.active;
  };

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'bg-success-600';
    if (rate >= 60) return 'bg-primary-600';
    if (rate >= 40) return 'bg-warning-600';
    return 'bg-danger-600';
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {assignments?.filter(a => a.status === 'active').length || 0}
          </div>
          <div className="text-sm text-gray-600">Bài tập đang mở</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-warning-600 mb-1">
            {assignments?.filter(a => a.status === 'upcoming').length || 0}
          </div>
          <div className="text-sm text-gray-600">Bài tập sắp mở</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-success-600 mb-1">
            {assignments?.filter(a => a.status === 'completed').length || 0}
          </div>
          <div className="text-sm text-gray-600">Bài tập đã đóng</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-danger-600 mb-1">
            {assignments?.filter(a => a.status === 'overdue').length || 0}
          </div>
          <div className="text-sm text-gray-600">Bài tập quá hạn</div>
        </div>
      </div>

      <div className="space-y-4">
        {assignments?.map((assignment) => {
          const statusInfo = getStatusBadge(assignment.status);
          const StatusIcon = statusInfo.icon;
          
          return (
            <div key={assignment.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                    <span className={statusInfo.class}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusInfo.text}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{assignment.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Mở: {assignment.startDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Hạn: {assignment.dueDate}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4" />
                      <span>{assignment.submittedCount}/{assignment.totalStudents} nộp bài</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {(assignment.averageScore || 0).toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600">Điểm trung bình</div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Tỷ lệ nộp bài</span>
                    <span className="font-medium text-gray-900">
                      {Math.round((assignment.submittedCount / assignment.totalStudents) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor((assignment.submittedCount / assignment.totalStudents) * 100)}`}
                      style={{ width: `${(assignment.submittedCount / assignment.totalStudents) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-success-600 font-medium">
                      {assignment.submittedCount} đã nộp
                    </span>
                    <span className="text-warning-600 font-medium">
                      {assignment.totalStudents - assignment.submittedCount} chưa nộp
                    </span>
                  </div>
                  <Link 
                    to={`/assignments/${assignment.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Xem chi tiết →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {(!assignments || assignments.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có bài tập nào
          </h3>
          <p className="text-gray-500">
            Bài tập sẽ được hiển thị khi giảng viên tạo mới
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentProgress;