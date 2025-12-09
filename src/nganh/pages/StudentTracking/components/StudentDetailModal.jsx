import React, { useState } from 'react';
import { X, Mail, Phone, Calendar, Clock, Award, TrendingUp, TrendingDown, AlertTriangle, BookOpen, User } from 'lucide-react';

const StudentDetailModal = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !student) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang học' },
      at_risk: { class: 'status-badge status-at-risk', text: 'Có nguy cơ' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      dropped: { class: 'status-badge bg-gray-100 text-gray-800', text: 'Đã bỏ học' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const getRiskBadge = (riskLevel) => {
    const riskConfig = {
      low: { class: 'bg-success-100 text-success-800', text: 'Thấp', icon: '🟢' },
      medium: { class: 'bg-warning-100 text-warning-800', text: 'Trung bình', icon: '🟡' },
      high: { class: 'bg-danger-100 text-danger-800', text: 'Cao', icon: '🔴' }
    };
    return riskConfig[riskLevel] || riskConfig.low;
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: User },
    { id: 'courses', label: 'Khóa học', icon: BookOpen },
    { id: 'assignments', label: 'Bài tập', icon: Award },
    { id: 'notes', label: 'Ghi chú', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{student.name}</h2>
                <p className="text-gray-600">{student.studentId} • {student.email}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={getStatusBadge(student.status).class}>
                    {getStatusBadge(student.status).text}
                  </span>
                  <span className={`status-badge ${getRiskBadge(student.riskLevel).class}`}>
                    {getRiskBadge(student.riskLevel).icon} Rủi ro {getRiskBadge(student.riskLevel).text}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary-600">{(student.averageScore || 0).toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Điểm trung bình</div>
                    <div className="flex items-center justify-center mt-1">
                      {student.scoreChange > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-danger-600" />
                      )}
                      <span className={`text-xs ml-1 ${student.scoreChange > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {Math.abs(student.scoreChange || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-success-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-success-600">{student.completionRate}%</div>
                    <div className="text-sm text-gray-600">Hoàn thành</div>
                  </div>

                  <div className="bg-warning-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-warning-600">{student.totalHours}h</div>
                    <div className="text-sm text-gray-600">Thời gian học</div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-gray-600">
                      {student.completedAssignments}/{student.totalAssignments}
                    </div>
                    <div className="text-sm text-gray-600">Bài tập</div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">Thông tin liên hệ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-medium text-gray-900">{student.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Điện thoại</div>
                        <div className="font-medium text-gray-900">{student.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                {student.riskLevel === 'high' && (
                  <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-danger-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-danger-800">Cảnh báo: Sinh viên có nguy cơ cao</h3>
                        <p className="text-sm text-danger-700 mt-1">
                          Sinh viên này cần được can thiệp ngay lập tức. Điểm số thấp và tỷ lệ hoàn thành kém.
                        </p>
                        <div className="mt-3">
                          <button className="bg-danger-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger-700 transition-colors">
                            Tạo kế hoạch can thiệp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Khóa học đang tham gia</h3>
                {student.courses?.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{course.name}</h4>
                      <span className="text-sm text-gray-600">{course.progress}% hoàn thành</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Điểm: {(course.score || 0).toFixed(1)}</span>
                      <span>Lớp: {course.className}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Bài tập gần đây</h3>
                {student.recentAssignments?.map((assignment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{assignment.title}</h4>
                      <span className={`text-sm font-medium ${
                        assignment.score >= 8.0 ? 'text-success-600' : 
                        assignment.score >= 7.0 ? 'text-warning-600' : 'text-danger-600'
                      }`}>
                        {(assignment.score || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Nộp: {assignment.submittedDate}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        assignment.status === 'completed' ? 'bg-success-100 text-success-800' :
                        assignment.status === 'late' ? 'bg-warning-100 text-warning-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {assignment.status === 'completed' ? 'Đúng hạn' :
                         assignment.status === 'late' ? 'Trễ hạn' : 'Chưa nộp'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Ghi chú của giảng viên</h3>
                  <button className="btn-primary text-sm">Thêm ghi chú</button>
                </div>
                <div className="space-y-3">
                  {student.notes?.map((note, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{note.author}</span>
                        <span className="text-xs text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Chưa có ghi chú nào</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Đóng
            </button>
            <button className="btn-primary">
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;