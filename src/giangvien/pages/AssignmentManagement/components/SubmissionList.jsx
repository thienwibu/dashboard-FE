import React, { useState } from 'react';
import {
  Filter,
  Download,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
  X,
} from 'lucide-react';
import SmartSearchInput from '../../../components/SmartSearchInput';

const SubmissionList = ({ submissions, assignmentId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const getStatusBadge = (status) => {
    const statusConfig = {
      submitted: { class: 'status-badge status-completed', text: 'Đã nộp', icon: CheckCircle },
      late: { class: 'status-badge status-at-risk', text: 'Nộp muộn', icon: AlertTriangle },
      graded: { class: 'status-badge status-active', text: 'Đã chấm', icon: CheckCircle },
      pending: { class: 'status-badge status-pending', text: 'Chờ chấm', icon: Clock },
      missing: { class: 'status-badge bg-gray-100 text-gray-600', text: 'Chưa nộp', icon: FileText }
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

  const filteredAndSortedSubmissions =
    submissions
      ?.filter((submission) => {
        const matchesSearch =
          submission.studentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          submission.studentId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
          filterStatus === 'all' || submission.status === filterStatus;
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

  // Xuất danh sách ra CSV
  const handleExportList = () => {
    const headers = [
      'STT',
      'MSSV',
      'Họ tên',
      'Trạng thái',
      'Thời gian nộp',
      'Điểm',
      'Nhận xét',
    ];
    const rows = filteredAndSortedSubmissions.map((s, idx) => [
      idx + 1,
      s.studentId,
      s.studentName,
      s.status === 'graded'
        ? 'Đã chấm'
        : s.status === 'pending'
          ? 'Chờ chấm'
          : s.status === 'late'
            ? 'Nộp muộn'
            : s.status === 'missing'
              ? 'Chưa nộp'
              : 'Đã nộp',
      s.submittedAt
        ? new Date(s.submittedAt).toLocaleString('vi-VN')
        : 'Chưa nộp',
      s.score !== null ? s.score : 'Chưa chấm',
      s.feedback || '',
    ]);

    const csvContent =
      '\uFEFF' +
      [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `danh_sach_nop_bai_${assignmentId}_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Xem chi tiết bài nộp
  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailModal(true);
  };

  // Mở modal nhận xét
  const handleOpenFeedback = (submission) => {
    setSelectedSubmission(submission);
    setFeedbackText(submission.feedback || '');
    setShowFeedbackModal(true);
  };

  // Lưu nhận xét
  const handleSaveFeedback = () => {
    // Trong thực tế sẽ gọi API để lưu
    alert(`Đã lưu nhận xét cho sinh viên ${selectedSubmission.studentName}`);
    setShowFeedbackModal(false);
  };

  // Tải xuống file
  const handleDownloadFiles = (submission) => {
    if (submission.files && submission.files.length > 0) {
      submission.files.forEach((file) => {
        // Trong thực tế sẽ tải file từ server
        alert(`Đang tải xuống: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <SmartSearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Tìm kiếm sinh viên..."
              className="w-64"
            />
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

            <button
              onClick={handleExportList}
              className="btn-secondary flex items-center space-x-2"
            >
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
            <thead className="bg-primary-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Sinh viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Thời gian nộp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Điểm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Tệp đính kèm
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
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
                          <div className="text-sm font-medium text-gray-700">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
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
                          onClick={() => handleViewSubmission(submission)}
                          className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Xem bài nộp"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenFeedback(submission)}
                          className="p-2 text-gray-400 hover:text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                          title="Nhận xét"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        {submission.files && submission.files.length > 0 && (
                          <button
                            onClick={() => handleDownloadFiles(submission)}
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
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Không tìm thấy bài nộp nào
          </h3>
          <p className="text-gray-500">
            Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}

      {/* Modal xem chi tiết bài nộp */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-700">
                Chi tiết bài nộp
              </h3>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-150px)]">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">
                      {selectedSubmission.studentName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-700">
                      {selectedSubmission.studentName}
                    </h4>
                    <p className="text-gray-600">
                      {selectedSubmission.studentId}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Trạng thái</p>
                    <p className="font-semibold text-gray-700">
                      {selectedSubmission.status === 'graded'
                        ? 'Đã chấm'
                        : selectedSubmission.status === 'pending'
                          ? 'Chờ chấm'
                          : selectedSubmission.status === 'late'
                            ? 'Nộp muộn'
                            : 'Chưa nộp'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Điểm số</p>
                    <p className="font-semibold text-gray-700">
                      {selectedSubmission.score !== null
                        ? `${selectedSubmission.score} điểm`
                        : 'Chưa chấm'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <p className="text-sm text-gray-500">Thời gian nộp</p>
                    <p className="font-semibold text-gray-700">
                      {selectedSubmission.submittedAt
                        ? formatDate(selectedSubmission.submittedAt)
                        : 'Chưa nộp'}
                    </p>
                  </div>
                </div>

                {selectedSubmission.feedback && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Nhận xét</p>
                    <div className="bg-blue-50 p-4 rounded-lg text-gray-700">
                      {selectedSubmission.feedback}
                    </div>
                  </div>
                )}

                {selectedSubmission.files &&
                  selectedSubmission.files.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">
                        Tệp đính kèm
                      </p>
                      <div className="space-y-2">
                        {selectedSubmission.files.map((file, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-gray-400" />
                              <span className="text-gray-700">{file.name}</span>
                              <span className="text-sm text-gray-500">
                                ({(file.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                alert(`Đang tải xuống: ${file.name}`)
                              }
                              className="text-primary-600 hover:text-primary-700"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailModal(false)}
                className="btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nhận xét */}
      {showFeedbackModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-700">
                Nhận xét cho {selectedSubmission.studentName}
              </h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Nhập nhận xét cho sinh viên..."
                className="w-full h-40 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button onClick={handleSaveFeedback} className="btn-primary">
                Lưu nhận xét
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;