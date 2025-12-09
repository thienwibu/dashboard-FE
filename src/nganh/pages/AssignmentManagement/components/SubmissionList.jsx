import React, { useState } from 'react';
import { Search, Filter, Download, Eye, MessageSquare, Clock, CheckCircle, AlertTriangle, FileText } from 'lucide-react';

const SubmissionList = ({ submissions, assignmentId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { class: 'status-badge status-completed', text: 'Đã nộp', icon: CheckCircle },
      late: { class: 'status-badge status-at-risk', text: 'Nộp muộn', icon: AlertTriangle },
      graded: { class: 'status-badge status-active', text: 'Đã chấm', icon: CheckCircle },
      pending: { class: 'status-badge status-pending', text: 'Chờ chấm', icon: Clock },
      missing: { class: 'status-badge bg-gray-100 text-gray-800', text: 'Chưa nộp', icon: FileText }
    };
    
    return statusConfig[status] || statusConfig.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa nộp';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredAndSortedSubmissions = submissions
    ?.filter(submission => {
      const matchesSearch = submission.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           submission.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || submission.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'studentName':
          return a.studentName.localeCompare(b.studentName);
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'submittedAt':
          if (!a.submittedAt && !b.submittedAt) return 0;
          if (!a.submittedAt) return 1;
          if (!b.submittedAt) return -1;
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        default:
          return 0;
      }
    }) || [];

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm sinh viên..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="submitted">Đã nộp</option>
              <option value="late">Nộp muộn</option>
              <option value="graded">Đã chấm</option>
              <option value="pending">Chờ chấm</option>
              <option value="missing">Chưa nộp</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="submittedAt">Sắp xếp theo thời gian nộp</option>
              <option value="studentName">Sắp xếp theo tên</option>
              <option value="score">Sắp xếp theo điểm</option>
            </select>

            <button className="btn-secondary flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Xuất danh sách</span>
            </button>
          </div>
        </div>
      </div>

      {/* Submission List */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tệp đính kèm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedSubmissions.map((submission) => {
                const statusInfo = getStatusBadge(submission.status);
                const StatusIcon = statusInfo.icon;
                
                return (
                  <tr key={submission.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {submission.studentName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {submission.studentName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.studentId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={statusInfo.class}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusInfo.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(submission.submittedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.score !== null ? (
                        <div className="flex items-center">
                          <span className={`text-sm font-medium ${
                            submission.score >= 80 ? 'text-success-600' :
                            submission.score >= 70 ? 'text-primary-600' :
                            submission.score >= 60 ? 'text-warning-600' :
                            'text-danger-600'
                          }`}>
                            {submission.score}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Chưa chấm</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {submission.files && submission.files.length > 0 ? (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {submission.files.length} tệp
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Không có</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <button
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Xem bài nộp"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                          title="Nhận xét"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        {submission.files && submission.files.length > 0 && (
                          <button
                            className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-colors"
                            title="Tải xuống"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredAndSortedSubmissions.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy bài nộp nào
          </h3>
          <p className="text-gray-500">
            Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;