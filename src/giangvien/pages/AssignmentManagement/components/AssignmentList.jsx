import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Users, Eye, Edit, Trash2, CheckCircle, AlertTriangle, FileText, UserCheck, UserX, AlertCircle, Info } from 'lucide-react';

const AssignmentList = ({ assignments, onDelete }) => {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'submitted', 'notSubmitted', 'late'
  
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

  const getCompletionColor = (rate) => {
    if (rate >= 80) return 'bg-success-600';
    if (rate >= 60) return 'bg-primary-600';
    if (rate >= 40) return 'bg-warning-600';
    return 'bg-danger-600';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleShowDetails = (assignment, tab = 'all') => {
    setSelectedAssignment(assignment);
    setActiveTab(tab);
    setShowDetailsModal(true);
  };

  const getSubmissionDetails = (assignment) => {
    // Danh sách đầy đủ 10 sinh viên thực tế
    const allStudents = [
      { id: 1, name: 'Nguyễn Văn Minh', studentId: '122000001', email: 'minh.nv@student.edu.vn' },
      { id: 2, name: 'Trần Thị Hương', studentId: '122000002', email: 'huong.tt@student.edu.vn' },
      { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003', email: 'nam.lh@student.edu.vn' },
      { id: 4, name: 'Phạm Thị Lan', studentId: '122000004', email: 'lan.pt@student.edu.vn' },
      { id: 5, name: 'Vũ Đức Thành', studentId: '122000005', email: 'thanh.vd@student.edu.vn' },
      { id: 6, name: 'Hoàng Thị Mai', studentId: '122000006', email: 'mai.ht@student.edu.vn' },
      { id: 7, name: 'Đặng Văn Hùng', studentId: '122000007', email: 'hung.dv@student.edu.vn' },
      { id: 8, name: 'Bùi Thị Ngọc', studentId: '122000008', email: 'ngoc.bt@student.edu.vn' },
      { id: 9, name: 'Lý Minh Tuấn', studentId: '122000009', email: 'tuan.lm@student.edu.vn' },
      { id: 10, name: 'Ngô Thị Thu', studentId: '122000010', email: 'thu.nt@student.edu.vn' }
    ];
    
    const submitted = [];
    const notSubmitted = [];
    const lateSubmitted = [];
    
    // Lấy sinh viên theo số lượng trong assignment
    const studentsInClass = allStudents.slice(0, assignment.totalStudents);
    
    studentsInClass.forEach((student, index) => {
      if (index < assignment.submittedCount - assignment.lateSubmissions) {
        submitted.push({ ...student, submittedAt: '20/11/2024 14:30', score: 8.5 });
      } else if (index < assignment.submittedCount) {
        lateSubmitted.push({ ...student, submittedAt: '23/11/2024 16:45', score: 7.0 });
      } else {
        notSubmitted.push(student);
      }
    });
    
    return { submitted, notSubmitted, lateSubmitted };
  };

  return (
    <>
      <div className="space-y-4">
        {assignments.map((assignment) => {
        const statusInfo = getStatusBadge(assignment.status);
        const StatusIcon = statusInfo.icon;
        const submissionRate = assignment.totalStudents > 0
          ? Math.round((assignment.submittedCount / assignment.totalStudents) * 100)
          : 0;

        return (
          <div key={assignment.id} className="card p-6 hover:shadow-medium transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Link
                    to={`/assignments/${assignment.id}`}
                    className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                  >
                    {assignment.title}
                  </Link>
                  <span className={statusInfo.class}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.text}
                  </span>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">
                  {assignment.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Mở: {formatDate(assignment.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>Hạn: {formatDate(assignment.dueDate)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{assignment.submittedCount}/{assignment.totalStudents} nộp bài</span>
                  </div>
                  <div className="text-primary-600 font-medium">
                    {assignment.course} - {assignment.className}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleShowDetails(assignment)}
                  className="p-2 text-gray-400 hover:text-info-600 hover:bg-info-50 rounded-lg transition-colors"
                  title="Xem danh sách sinh viên"
                >
                  <Info className="h-4 w-4" />
                </button>
                <Link
                  to={`/assignments/${assignment.id}`}
                  className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Xem chi tiết bài tập"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <Link
                  to={`/assignments/${assignment.id}/edit`}
                  className="p-2 text-gray-400 hover:text-warning-600 hover:bg-warning-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => onDelete(assignment.id)}
                  className="p-2 text-gray-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                  title="Xóa bài tập"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Tỷ lệ nộp bài</span>
                  <span className="font-medium text-gray-900">{submissionRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getCompletionColor(submissionRate)}`}
                    style={{ width: `${submissionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-6 text-sm">
                  <button
                    onClick={() => handleShowDetails(assignment, 'submitted')}
                    className="text-center hover:bg-success-50 px-3 py-2 rounded-lg transition-colors group"
                    title="Xem danh sách sinh viên đã nộp"
                  >
                    <div className="flex items-center space-x-1">
                      <UserCheck className="h-4 w-4 text-success-600" />
                      <div className="text-lg font-bold text-success-600">{assignment.submittedCount - assignment.lateSubmissions}</div>
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-success-700">Đã nộp</div>
                  </button>
                  <button
                    onClick={() => handleShowDetails(assignment, 'notSubmitted')}
                    className="text-center hover:bg-warning-50 px-3 py-2 rounded-lg transition-colors group"
                    title="Xem danh sách sinh viên chưa nộp"
                  >
                    <div className="flex items-center space-x-1">
                      <UserX className="h-4 w-4 text-warning-600" />
                      <div className="text-lg font-bold text-warning-600">
                        {assignment.totalStudents - assignment.submittedCount}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 group-hover:text-warning-700">Chưa nộp</div>
                  </button>
                  {assignment.lateSubmissions > 0 && (
                    <button
                      onClick={() => handleShowDetails(assignment, 'late')}
                      className="text-center hover:bg-danger-50 px-3 py-2 rounded-lg transition-colors group"
                      title="Xem danh sách sinh viên nộp muộn"
                    >
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="h-4 w-4 text-danger-600" />
                        <div className="text-lg font-bold text-danger-600">{assignment.lateSubmissions}</div>
                      </div>
                      <div className="text-xs text-gray-500 group-hover:text-danger-700">Nộp muộn</div>
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">
                    Cập nhật: {formatDate(assignment.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>

    {/* Modal chi tiết sinh viên */}
    {showDetailsModal && selectedAssignment && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedAssignment.title}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedAssignment.course} - {selectedAssignment.className}
                </p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Tất cả
              </button>
              <button
                onClick={() => setActiveTab('submitted')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'submitted'
                    ? 'bg-success-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Đã nộp
              </button>
              <button
                onClick={() => setActiveTab('notSubmitted')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'notSubmitted'
                    ? 'bg-warning-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Chưa nộp
              </button>
              <button
                onClick={() => setActiveTab('late')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'late'
                    ? 'bg-danger-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                Nộp muộn
              </button>
            </div>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {(() => {
              const { submitted, notSubmitted, lateSubmitted } = getSubmissionDetails(selectedAssignment);
              
              return (
                <div className="space-y-6">
                  {/* Đã nộp đúng hạn */}
                  {(activeTab === 'all' || activeTab === 'submitted') && submitted.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <UserCheck className="h-5 w-5 text-success-600" />
                        <h4 className="font-semibold text-gray-900">
                          Đã nộp đúng hạn ({submitted.length})
                        </h4>
                      </div>
                      <div className="bg-success-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {submitted.map((student) => (
                            <div key={student.id} className="bg-white p-3 rounded-lg border border-success-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{student.name}</div>
                                  <div className="text-sm text-primary-600 font-mono">{student.studentId}</div>
                                  <div className="text-xs text-gray-500 mt-1">{student.email}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-success-600">
                                    {student.score ? `${student.score} điểm` : 'Chưa chấm'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{student.submittedAt}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Nộp muộn */}
                  {(activeTab === 'all' || activeTab === 'late') && lateSubmitted.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <AlertCircle className="h-5 w-5 text-danger-600" />
                        <h4 className="font-semibold text-gray-900">
                          Nộp muộn ({lateSubmitted.length})
                        </h4>
                      </div>
                      <div className="bg-danger-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {lateSubmitted.map((student) => (
                            <div key={student.id} className="bg-white p-3 rounded-lg border border-danger-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{student.name}</div>
                                  <div className="text-sm text-primary-600 font-mono">{student.studentId}</div>
                                  <div className="text-xs text-gray-500 mt-1">{student.email}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-semibold text-danger-600">
                                    {student.score ? `${student.score} điểm` : 'Chưa chấm'}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">{student.submittedAt}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Chưa nộp */}
                  {(activeTab === 'all' || activeTab === 'notSubmitted') && notSubmitted.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <UserX className="h-5 w-5 text-warning-600" />
                        <h4 className="font-semibold text-gray-900">
                          Chưa nộp ({notSubmitted.length})
                        </h4>
                      </div>
                      <div className="bg-warning-50 rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {notSubmitted.map((student) => (
                            <div key={student.id} className="bg-white p-3 rounded-lg border border-warning-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{student.name}</div>
                                  <div className="text-sm text-primary-600 font-mono">{student.studentId}</div>
                                  <div className="text-xs text-gray-500 mt-1">{student.email}</div>
                                </div>
                                <div className="text-right">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
                                    Chưa nộp
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Tổng số sinh viên: <span className="font-semibold">{selectedAssignment.totalStudents}</span>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AssignmentList;