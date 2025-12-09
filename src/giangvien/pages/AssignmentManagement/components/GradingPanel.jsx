import React, { useState } from 'react';
import { Search, Filter, Save, MessageSquare, FileText, Download, CheckCircle, Clock } from 'lucide-react';

const GradingPanel = ({ submissions, assignmentId }) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState({});

  const pendingSubmissions = submissions?.filter(s => 
    (filterStatus === 'all' || s.status === filterStatus) &&
    (s.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     s.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const handleGradeChange = (submissionId, grade) => {
    setGrades(prev => ({
      ...prev,
      [submissionId]: grade
    }));
  };

  const handleFeedbackChange = (submissionId, feedbackText) => {
    setFeedback(prev => ({
      ...prev,
      [submissionId]: feedbackText
    }));
  };

  const handleSaveGrade = async (submissionId) => {
    try {
      const grade = grades[submissionId];
      const feedbackText = feedback[submissionId];
      
      // Here you would make an API call to save the grade and feedback
      console.log('Saving grade:', { submissionId, grade, feedback: feedbackText });
      
      // Update local state to reflect the change
      // This would typically be handled by refetching data
      alert('Đã lưu điểm và nhận xét thành công!');
    } catch (error) {
      console.error('Error saving grade:', error);
      alert('Có lỗi xảy ra khi lưu điểm!');
    }
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

  return (
    <div className="space-y-6">
      {/* Filters */}
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
              <option value="pending">Chờ chấm điểm</option>
              <option value="submitted">Đã nộp</option>
              <option value="late">Nộp muộn</option>
              <option value="graded">Đã chấm</option>
              <option value="all">Tất cả</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Submission List */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Danh sách bài nộp ({pendingSubmissions.length})
          </h3>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingSubmissions.map((submission) => (
              <div
                key={submission.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedSubmission?.id === submission.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedSubmission(submission)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="text-xs font-medium text-white">
                        {submission.studentName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {submission.studentName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {submission.studentId}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {submission.status === 'late' && (
                      <span className="status-badge status-at-risk">
                        <Clock className="h-3 w-3 mr-1" />
                        Muộn
                      </span>
                    )}
                    {submission.score !== null && (
                      <span className="text-sm font-medium text-success-600">
                        {submission.score}%
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Nộp: {formatDate(submission.submittedAt)}
                </div>
                
                {submission.files && submission.files.length > 0 && (
                  <div className="flex items-center space-x-1 mt-2">
                    <FileText className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      {submission.files.length} tệp đính kèm
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {pendingSubmissions.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có bài nộp nào cần chấm</p>
            </div>
          )}
        </div>

        {/* Grading Panel */}
        <div className="card p-6">
          {selectedSubmission ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Chấm điểm bài nộp
                  </h3>
                  <p className="text-sm text-gray-600">
                    {selectedSubmission.studentName} - {selectedSubmission.studentId}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Files */}
              {selectedSubmission.files && selectedSubmission.files.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Tệp đính kèm
                  </h4>
                  <div className="space-y-2">
                    {selectedSubmission.files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">{file.name}</span>
                        </div>
                        <button className="text-primary-600 hover:text-primary-700 text-sm">
                          Tải xuống
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Grade Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Điểm số (0-100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={grades[selectedSubmission.id] || selectedSubmission.score || ''}
                  onChange={(e) => handleGradeChange(selectedSubmission.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập điểm..."
                />
              </div>

              {/* Feedback */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét
                </label>
                <textarea
                  rows={6}
                  value={feedback[selectedSubmission.id] || selectedSubmission.feedback || ''}
                  onChange={(e) => handleFeedbackChange(selectedSubmission.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Nhập nhận xét cho sinh viên..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <button className="btn-secondary flex items-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Gửi tin nhắn</span>
                </button>
                
                <button
                  onClick={() => handleSaveGrade(selectedSubmission.id)}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Lưu điểm</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chọn bài nộp để chấm điểm
              </h3>
              <p className="text-gray-500">
                Chọn một bài nộp từ danh sách bên trái để bắt đầu chấm điểm
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradingPanel;