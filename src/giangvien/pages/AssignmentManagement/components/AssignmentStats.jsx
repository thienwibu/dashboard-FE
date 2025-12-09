import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, AlertTriangle, Users, TrendingUp, TrendingDown, X, ChevronRight } from 'lucide-react';
import { mockAssignmentData } from '../../../data/mockData';

const AssignmentStats = ({ data }) => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showAssignmentDetail, setShowAssignmentDetail] = useState(false);

  if (!data) return null;

  const stats = [
    {
      id: 'total',
      title: 'Tổng Bài Tập',
      value: data.totalAssignments,
      change: data.assignmentChange,
      icon: FileText,
      color: 'primary',
      description: 'Tổng số bài tập đã tạo trong hệ thống'
    },
    {
      id: 'active',
      title: 'Đang Mở',
      value: data.activeAssignments,
      change: data.activeChange,
      icon: Clock,
      color: 'warning',
      description: 'Bài tập đang mở và chờ sinh viên nộp'
    },
    {
      id: 'completed',
      title: 'Đã Hoàn Thành',
      value: data.completedAssignments,
      change: data.completedChange,
      icon: CheckCircle,
      color: 'success',
      description: 'Bài tập đã hoàn thành và chấm điểm'
    },
    {
      id: 'overdue',
      title: 'Quá Hạn',
      value: data.overdueAssignments,
      change: data.overdueChange,
      icon: AlertTriangle,
      color: 'danger',
      description: 'Bài tập đã quá hạn nộp'
    },
    {
      id: 'submission',
      title: 'Tỷ Lệ Nộp Bài TB',
      value: `${data.averageSubmissionRate}%`,
      change: data.submissionChange,
      icon: Users,
      color: 'primary',
      description: 'Tỷ lệ nộp bài trung bình của sinh viên'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      primary: 'text-primary-600 bg-primary-50',
      success: 'text-success-600 bg-success-50',
      warning: 'text-warning-600 bg-warning-50',
      danger: 'text-danger-600 bg-danger-50'
    };
    return colors[color] || colors.primary;
  };

  const getDetailData = (statId) => {
    const assignments = mockAssignmentData?.assignments || [];
    
    switch (statId) {
      case 'total':
        return assignments;
      case 'active':
        return assignments.filter(a => a.status === 'active');
      case 'completed':
        return assignments.filter(a => a.status === 'completed');
      case 'overdue':
        return assignments.filter(a => a.status === 'overdue');
      case 'submission':
        return assignments.sort((a, b) => (b.submittedCount / b.totalStudents) - (a.submittedCount / a.totalStudents));
      default:
        return assignments;
    }
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'bg-warning-100 text-warning-700', text: 'Đang mở' },
      completed: { class: 'bg-success-100 text-success-700', text: 'Hoàn thành' },
      overdue: { class: 'bg-danger-100 text-danger-700', text: 'Quá hạn' },
      upcoming: { class: 'bg-primary-100 text-primary-700', text: 'Sắp tới' },
      draft: { class: 'bg-gray-100 text-gray-700', text: 'Nháp' }
    };
    return statusConfig[status] || statusConfig.draft;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const isPositive = stat.change > 0;
          const TrendIcon = isPositive ? TrendingUp : TrendingDown;

          return (
            <button
              key={index}
              onClick={() => handleStatClick(stat)}
              className="card p-6 text-left hover:shadow-medium transition-all duration-200 group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col items-end space-y-1">
                  <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                    <TrendIcon className="h-4 w-4" />
                    <span>{Math.abs(stat.change)}%</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              <div>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">
                  {stat.title}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedStat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(selectedStat.color)}`}>
                  <selectedStat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedStat.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedStat.description}
                  </p>
                </div>
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
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Giá trị hiện tại</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedStat.value}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Thay đổi</p>
                  <div className="flex items-center mt-1">
                    {selectedStat.change > 0 ? (
                      <TrendingUp className="h-5 w-5 text-success-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-danger-600 mr-1" />
                    )}
                    <span className={`text-2xl font-bold ${
                      selectedStat.change > 0 ? 'text-success-600' : 'text-danger-600'
                    }`}>
                      {Math.abs(selectedStat.change)}%
                    </span>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tổng bài tập</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {getDetailData(selectedStat.id).length}
                  </p>
                </div>
              </div>

              {/* Danh sách bài tập */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách bài tập
                </h4>
                <div className="space-y-3">
                  {getDetailData(selectedStat.id).map((assignment, index) => (
                    <button
                      key={assignment.id}
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowAssignmentDetail(true);
                      }}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all cursor-pointer text-left"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{assignment.title}</p>
                          <p className="text-sm text-gray-600">{assignment.course} • {assignment.className}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Đã nộp</p>
                          <p className="text-lg font-bold text-gray-900">
                            {assignment.submittedCount}/{assignment.totalStudents}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Điểm TB</p>
                          <p className="text-lg font-bold text-gray-900">
                            {assignment.averageScore > 0 ? assignment.averageScore.toFixed(1) : '-'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(assignment.status).class}`}>
                            {getStatusBadge(assignment.status).text}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Mẹo:</strong> Click vào bất kỳ bài tập nào để xem chi tiết sinh viên đã nộp/chưa nộp
                  </p>
                </div>
              </div>
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

      {/* Modal chi tiết bài tập */}
      {showAssignmentDetail && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedAssignment.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedAssignment.course} • {selectedAssignment.className}
                </p>
              </div>
              <button
                onClick={() => setShowAssignmentDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Tính toán số liệu chính xác */}
              {(() => {
                const allSubmissions = mockAssignmentData.assignmentDetails.submissions || [];
                const actualSubmitted = allSubmissions.filter(s => s.submittedAt !== null);
                const actualLate = allSubmissions.filter(s => {
                  if (!s.submittedAt || !selectedAssignment.dueDate) return false;
                  return new Date(s.submittedAt) > new Date(selectedAssignment.dueDate);
                });
                
                // Đảm bảo totalStudents >= số đã nộp để tránh số âm
                const correctedTotalStudents = Math.max(selectedAssignment.totalStudents, actualSubmitted.length);
                const actualNotSubmitted = correctedTotalStudents - actualSubmitted.length;

                return (
                  <>
                    <div className="mb-6">
                      <div className="bg-blue-50 rounded-lg p-4 mb-4 text-center">
                        <p className="text-sm text-gray-600">Tổng sinh viên trong lớp</p>
                        <p className="text-3xl font-bold text-blue-600 mt-1">{correctedTotalStudents}</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-success-50 p-4 rounded-lg border border-success-200">
                          <p className="text-sm text-success-700 font-medium">Đã nộp</p>
                          <p className="text-2xl font-bold text-success-600 mt-1">{actualSubmitted.length}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {((actualSubmitted.length / correctedTotalStudents) * 100).toFixed(0)}% sinh viên
                          </p>
                        </div>
                        <div className="bg-warning-50 p-4 rounded-lg border border-warning-200">
                          <p className="text-sm text-warning-700 font-medium">Chưa nộp</p>
                          <p className="text-2xl font-bold text-warning-600 mt-1">{actualNotSubmitted}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            {((actualNotSubmitted / correctedTotalStudents) * 100).toFixed(0)}% sinh viên
                          </p>
                        </div>
                        <div className="bg-danger-50 p-4 rounded-lg border border-danger-200">
                          <p className="text-sm text-danger-700 font-medium">Nộp muộn</p>
                          <p className="text-2xl font-bold text-danger-600 mt-1">{actualLate.length}</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Trong số đã nộp
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-4 bg-gray-50 rounded-lg p-3 text-sm text-gray-700">
                        <strong>Giải thích:</strong> Đã nộp ({actualSubmitted.length}) + Chưa nộp ({actualNotSubmitted}) = Tổng ({correctedTotalStudents}) sinh viên
                      </div>
                    </div>

              {/* Danh sách sinh viên đã nộp */}
              {actualSubmitted.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Sinh viên đã nộp ({actualSubmitted.length})
                  </h4>
                  <div className="space-y-2">
                    {actualSubmitted.map((submission, index) => (
                        <div 
                          key={submission.id}
                          className="flex items-center justify-between p-3 bg-success-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-success-600 font-semibold">{index + 1}</span>
                            <div>
                              <p className="font-medium text-gray-900">{submission.studentName}</p>
                              <p className="text-xs text-gray-600">{submission.studentId}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-600">Điểm</p>
                              <p className="text-sm font-bold text-gray-900">
                                {submission.score !== null ? submission.score : 'Chưa chấm'}
                              </p>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              submission.status === 'graded' ? 'bg-success-100 text-success-700' : 'bg-warning-100 text-warning-700'
                            }`}>
                              {submission.status === 'graded' ? 'Đã chấm' : 'Chờ chấm'}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Danh sách sinh viên nộp muộn */}
              {actualLate.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Sinh viên nộp muộn ({actualLate.length})
                  </h4>
                  <div className="space-y-2">
                    {actualLate.map((submission, index) => (
                        <div 
                          key={submission.id}
                          className="flex items-center justify-between p-3 bg-danger-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-danger-600 font-semibold">{index + 1}</span>
                            <div>
                              <p className="font-medium text-gray-900">{submission.studentName}</p>
                              <p className="text-xs text-gray-600">{submission.studentId}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-xs text-gray-600">Điểm</p>
                              <p className="text-sm font-bold text-gray-900">
                                {submission.score !== null ? submission.score : 'Chưa chấm'}
                              </p>
                            </div>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-danger-100 text-danger-700">
                              Nộp muộn
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Danh sách sinh viên chưa nộp */}
              {actualNotSubmitted > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Sinh viên chưa nộp ({actualNotSubmitted})
                  </h4>
                  <div className="space-y-2">
                    {Array.from({ length: actualNotSubmitted }, (_, index) => {
                      const submission = mockAssignmentData.assignmentDetails.submissions.find(s => s.status === 'missing');
                      return (
                        <div 
                          key={index}
                          className="flex items-center justify-between p-3 bg-warning-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="text-warning-600 font-semibold">{index + 1}</span>
                            <div>
                              <p className="font-medium text-gray-900">{submission?.studentName || `Sinh viên ${index + 1}`}</p>
                              <p className="text-xs text-gray-600">{submission?.studentId || `SV${String(index + 100).padStart(3, '0')}`}</p>
                            </div>
                          </div>
                          <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-warning-100 text-warning-700">
                            Chưa nộp
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
                  </>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowAssignmentDetail(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssignmentStats;
