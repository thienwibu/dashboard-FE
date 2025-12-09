import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Download, Users, Clock, Calendar, FileText, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

const AssignmentDetailHeader = ({ assignment }) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { class: 'status-badge bg-gray-100 text-gray-800', text: 'Bản nháp', icon: FileText },
      active: { class: 'status-badge status-active', text: 'Đang mở', icon: Clock },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp mở', icon: Calendar },
      completed: { class: 'status-badge status-completed', text: 'Đã đóng', icon: CheckCircle },
      overdue: { class: 'status-badge status-at-risk', text: 'Quá hạn', icon: AlertTriangle }
    };
    
    return statusConfig[status] || statusConfig.draft;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusInfo = getStatusBadge(assignment.status);
  const StatusIcon = statusInfo.icon;
  const submissionRate = assignment.totalStudents > 0 
    ? Math.round((assignment.submittedCount / assignment.totalStudents) * 100)
    : 0;

  return (
    <div className="card p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-3">
            <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
            <span className={statusInfo.class}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusInfo.text}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 text-lg leading-relaxed">
            {assignment.description}
          </p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Mở: {formatDate(assignment.startDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Hạn: {formatDate(assignment.dueDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{assignment.course} - {assignment.className}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-6">
          <Link
            to={`/assignments/${assignment.id}/edit`}
            className="btn-secondary flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Chỉnh sửa</span>
          </Link>
          <button className="btn-secondary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="text-center p-4 bg-primary-50 rounded-lg">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {assignment.totalStudents}
          </div>
          <div className="text-sm text-gray-600">Tổng sinh viên</div>
        </div>
        
        <div className="text-center p-4 bg-success-50 rounded-lg">
          <div className="text-2xl font-bold text-success-600 mb-1">
            {assignment.submittedCount}
          </div>
          <div className="text-sm text-gray-600">Đã nộp bài</div>
        </div>
        
        <div className="text-center p-4 bg-warning-50 rounded-lg">
          <div className="text-2xl font-bold text-warning-600 mb-1">
            {assignment.totalStudents - assignment.submittedCount}
          </div>
          <div className="text-sm text-gray-600">Chưa nộp bài</div>
        </div>
        
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {assignment.averageScore}%
          </div>
          <div className="text-sm text-gray-600">Điểm trung bình</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-gray-600">Tỷ lệ nộp bài</span>
          <span className="font-medium text-gray-900">{submissionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-primary-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${submissionRate}%` }}
          ></div>
        </div>
      </div>

      {/* Assignment Files */}
      {assignment.files && assignment.files.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Tài liệu đính kèm</h3>
          <div className="flex flex-wrap gap-2">
            {assignment.files.map((file, index) => (
              <a
                key={index}
                href={file.url}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm text-gray-700 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>{file.name}</span>
                <Download className="h-3 w-3" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailHeader;