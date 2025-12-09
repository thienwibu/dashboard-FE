import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Download, Users, Clock, Calendar, FileText, CheckCircle, AlertTriangle, MapPin, X } from 'lucide-react';

const AssignmentDetailHeader = ({ assignment }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
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

  // Tính số bài nộp muộn thực tế dựa trên thời gian
  const actualLateSubmissions = assignment.submissions 
    ? assignment.submissions.filter(s => {
        if (!s.submittedAt || !assignment.dueDate) return false;
        return new Date(s.submittedAt) > new Date(assignment.dueDate);
      }).length
    : 0;

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const isLateSubmission = (submission) => {
    if (!submission.submittedAt || !assignment.dueDate) return false;
    return new Date(submission.submittedAt) > new Date(assignment.dueDate);
  };

  const getFilteredSubmissions = () => {
    if (!assignment.submissions || !selectedCategory) return [];
    
    switch (selectedCategory.id) {
      case 'submitted':
        return assignment.submissions.filter(s => s.submittedAt !== null);
      case 'notSubmitted':
        // Tạo danh sách sinh viên chưa nộp (giả lập)
        const submittedIds = assignment.submissions.map(s => s.studentId);
        return Array.from({ length: assignment.totalStudents - assignment.submittedCount }, (_, i) => ({
          id: `missing-${i}`,
          studentId: `SV${String(i + 100).padStart(3, '0')}`,
          studentName: `Sinh viên ${i + 1}`,
          status: 'missing',
          submittedAt: null
        }));
      case 'late':
        // Lọc tất cả bài nộp muộn dựa trên thời gian nộp so với deadline
        return assignment.submissions.filter(s => isLateSubmission(s));
      case 'total':
        return assignment.submissions;
      default:
        return assignment.submissions;
    }
  };

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
        <button
          onClick={() => handleCategoryClick({
            id: 'total',
            title: 'Tổng sinh viên',
            count: assignment.totalStudents,
            color: 'primary'
          })}
          className="text-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {assignment.totalStudents}
          </div>
          <div className="text-sm text-gray-600">Tổng sinh viên</div>
        </button>
        
        <button
          onClick={() => handleCategoryClick({
            id: 'submitted',
            title: 'Đã nộp bài',
            count: assignment.submittedCount,
            color: 'success'
          })}
          className="text-center p-4 bg-success-50 rounded-lg hover:bg-success-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-success-600 mb-1">
            {assignment.submittedCount}
          </div>
          <div className="text-sm text-gray-600">Đã nộp bài</div>
        </button>
        
        <button
          onClick={() => handleCategoryClick({
            id: 'notSubmitted',
            title: 'Chưa nộp bài',
            count: assignment.totalStudents - assignment.submittedCount,
            color: 'warning'
          })}
          className="text-center p-4 bg-warning-50 rounded-lg hover:bg-warning-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-warning-600 mb-1">
            {assignment.totalStudents - assignment.submittedCount}
          </div>
          <div className="text-sm text-gray-600">Chưa nộp bài</div>
        </button>
        
        <button
          onClick={() => handleCategoryClick({
            id: 'late',
            title: 'Nộp muộn',
            count: actualLateSubmissions,
            color: 'danger'
          })}
          className="text-center p-4 bg-danger-50 rounded-lg hover:bg-danger-100 transition-colors cursor-pointer"
        >
          <div className="text-2xl font-bold text-danger-600 mb-1">
            {actualLateSubmissions}
          </div>
          <div className="text-sm text-gray-600">Nộp muộn</div>
        </button>
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

      {/* Modal chi tiết */}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCategory.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedCategory.count} sinh viên
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {getFilteredSubmissions().length > 0 ? (
                <div className="space-y-3">
                  {getFilteredSubmissions().map((submission, index) => (
                    <div 
                      key={submission.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{submission.studentName}</p>
                          <p className="text-sm text-gray-600">{submission.studentId}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        {submission.submittedAt && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Thời gian nộp</p>
                            <p className="text-sm font-medium text-gray-900">
                              {new Date(submission.submittedAt).toLocaleDateString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        )}
                        {submission.score !== null && submission.score !== undefined && (
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Điểm</p>
                            <p className="text-lg font-bold text-gray-900">{submission.score}</p>
                          </div>
                        )}
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            submission.status === 'graded' 
                              ? 'bg-success-100 text-success-700'
                              : submission.status === 'pending'
                              ? 'bg-warning-100 text-warning-700'
                              : submission.status === 'late'
                              ? 'bg-danger-100 text-danger-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {submission.status === 'graded' ? 'Đã chấm' : 
                             submission.status === 'pending' ? 'Chờ chấm' : 
                             submission.status === 'late' ? 'Nộp muộn' : 'Chưa nộp'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">Không có sinh viên nào trong danh mục này</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetailHeader;