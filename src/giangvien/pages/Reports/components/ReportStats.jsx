import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, BookOpen, AlertCircle, CheckCircle, Clock, X, ChevronRight } from 'lucide-react';
import { mockStudentTrackingData, mockDashboardData, mockAssignmentData } from '../../../data/mockData';

const ReportStats = ({ stats }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const statCards = [
    {
      title: 'Tổng sinh viên',
      value: stats?.totalStudents || 0,
      change: stats?.studentChange || 0,
      icon: Users,
      color: 'blue',
      description: 'Tổng số sinh viên đang theo học'
    },
    {
      title: 'Khóa học hoạt động',
      value: stats?.activeCourses || 0,
      change: stats?.courseChange || 0,
      icon: BookOpen,
      color: 'purple',
      description: 'Số khóa học đang diễn ra'
    },
    {
      title: 'Tỷ lệ hoàn thành',
      value: stats?.completionRate || 0,
      change: stats?.completionChange || 0,
      icon: CheckCircle,
      color: 'green',
      suffix: '%',
      description: 'Tỷ lệ hoàn thành bài tập'
    },
    {
      title: 'Sinh viên rủi ro',
      value: stats?.atRiskStudents || 0,
      change: stats?.riskChange || 0,
      icon: AlertCircle,
      color: 'red',
      description: 'Sinh viên có nguy cơ bỏ học',
      invertChange: true
    },
    {
      title: 'Bài tập chưa chấm',
      value: stats?.pendingAssignments || 0,
      change: stats?.pendingChange || 0,
      icon: Clock,
      color: 'orange',
      description: 'Số bài tập đang chờ chấm'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' }
    };
    return colors[color] || colors.blue;
  };

  const renderChangeIndicator = (change, invertChange = false) => {
    if (change === 0) {
      return (
        <div className="flex items-center gap-1 text-xs font-medium text-gray-500 px-2 py-1 bg-gray-50 rounded">
          <span>0%</span>
          <span className="text-xs">vs tháng trước</span>
        </div>
      );
    }

    const isPositive = invertChange ? change < 0 : change > 0;
    return (
      <div 
        className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
          isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        }`}
        title={`${isPositive ? 'Tăng' : 'Giảm'} ${Math.abs(change)}% so với tháng trước`}
      >
        {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{change > 0 ? '+' : ''}{change}%</span>
        <span className="text-xs opacity-75">vs tháng trước</span>
      </div>
    );
  };

  const handleCardClick = (stat) => {
    let content = null;

    switch (stat.title) {
      case 'Tổng sinh viên':
        content = {
          title: 'Danh sách sinh viên',
          type: 'students',
          data: mockStudentTrackingData.students
        };
        break;
      case 'Khóa học hoạt động':
        content = {
          title: 'Khóa học đang diễn ra',
          type: 'courses',
          data: mockDashboardData.courseMonitoring
        };
        break;
      case 'Tỷ lệ hoàn thành':
        content = {
          title: 'Chi tiết tỷ lệ hoàn thành',
          type: 'completion',
          data: mockDashboardData.courseMonitoring
        };
        break;
      case 'Sinh viên rủi ro':
        content = {
          title: 'Sinh viên có nguy cơ cao',
          type: 'risk',
          data: mockStudentTrackingData.students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium')
        };
        break;
      case 'Bài tập chưa chấm':
        content = {
          title: 'Bài tập đang chờ chấm',
          type: 'pending',
          data: mockAssignmentData.assignments.filter(a => a.status === 'active')
        };
        break;
    }

    setModalContent(content);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colors = getColorClasses(stat.color);

          return (
            <button
              key={index}
              onClick={() => handleCardClick(stat)}
              className={`bg-white rounded-xl shadow-sm border ${colors.border} p-6 hover:shadow-lg transition-all text-left group cursor-pointer`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${colors.bg} group-hover:scale-110 transition-transform`}>
                  <Icon className={colors.text} size={24} />
                </div>
                {renderChangeIndicator(stat.change, stat.invertChange)}
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-1 mb-2">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.suffix && (
                  <span className="text-lg text-gray-500">{stat.suffix}</span>
                )}
              </div>
              <p className="text-xs text-gray-500">{stat.description}</p>
              <div className="mt-3 flex items-center text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Xem chi tiết</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Detail Modal */}
      {showDetailModal && modalContent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{modalContent.title}</h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Students List */}
              {modalContent.type === 'students' && (
                <div className="space-y-3">
                  {modalContent.data.map((student, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-600">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.studentId} • {student.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-gray-900">{student.averageScore.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">Điểm TB</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Courses List */}
              {modalContent.type === 'courses' && (
                <div className="space-y-4">
                  {modalContent.data.map((course, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{course.name}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {course.enrolledStudents} sinh viên • {course.duration}
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-success-100 text-success-800 rounded-full text-sm font-medium">
                          Đang diễn ra
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                          <div className="text-sm text-gray-600">Tỷ lệ hoàn thành</div>
                          <div className="flex items-center mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                              <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${course.completionRate}%` }}></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{course.completionRate}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Điểm trung bình</div>
                          <div className="text-lg font-bold text-gray-900 mt-1">{course.averageScore.toFixed(1)}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Completion Details */}
              {modalContent.type === 'completion' && (
                <div className="space-y-4">
                  <div className="bg-success-50 p-4 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-success-600">
                        {Math.round(modalContent.data.reduce((sum, c) => sum + c.completionRate, 0) / modalContent.data.length)}%
                      </div>
                      <div className="text-gray-600 mt-1">Tỷ lệ hoàn thành trung bình</div>
                    </div>
                  </div>
                  {modalContent.data.map((course, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium text-gray-900">{course.name}</div>
                        <div className={`text-2xl font-bold ${
                          course.completionRate >= 80 ? 'text-success-600' :
                          course.completionRate >= 60 ? 'text-warning-600' :
                          'text-danger-600'
                        }`}>
                          {course.completionRate}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full ${
                            course.completionRate >= 80 ? 'bg-success-600' :
                            course.completionRate >= 60 ? 'bg-warning-600' :
                            'bg-danger-600'
                          }`}
                          style={{ width: `${course.completionRate}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        {course.enrolledStudents} sinh viên • Điểm TB: {course.averageScore.toFixed(1)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Risk Students */}
              {modalContent.type === 'risk' && (
                <div className="space-y-3">
                  {modalContent.data.map((student, index) => (
                    <div key={index} className="border-l-4 border-danger-500 bg-danger-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-danger-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-danger-600">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.studentId}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          student.riskLevel === 'high' ? 'bg-danger-100 text-danger-800' : 'bg-warning-100 text-warning-800'
                        }`}>
                          Rủi ro {student.riskLevel === 'high' ? 'cao' : 'trung bình'}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Điểm TB</div>
                          <div className="font-bold text-danger-600">{student.averageScore.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Hoàn thành</div>
                          <div className="font-bold text-danger-600">{student.completionRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Bài tập</div>
                          <div className="font-bold text-danger-600">{student.completedAssignments}/{student.totalAssignments}</div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-2">
                        <div className="text-sm font-medium text-gray-900">Môn học có vấn đề:</div>
                        {(() => {
                          // Logic lọc môn học dựa trên mức độ rủi ro
                          const threshold = student.riskLevel === 'high' 
                            ? { score: 5.0, progress: 50 }  // Rủi ro cao: điểm < 5.0 hoặc tiến độ < 50%
                            : { score: 6.5, progress: 75 }; // Rủi ro trung bình: điểm < 6.5 hoặc tiến độ < 75%
                          
                          const problematicCourses = student.courses?.filter(c => 
                            c.score < threshold.score || c.progress < threshold.progress
                          ) || [];
                          
                          if (problematicCourses.length === 0) {
                            return (
                              <div className="text-sm text-gray-500 italic bg-gray-50 rounded p-2">
                                Tất cả môn học đang ổn định
                              </div>
                            );
                          }
                          
                          return problematicCourses.map((course, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm bg-white rounded p-2 border border-gray-200">
                              <span className="text-gray-700 font-medium">{course.name}</span>
                              <div className="flex items-center space-x-3">
                                <span className={`font-medium ${
                                  course.score < 5.0 ? 'text-danger-600' : 
                                  course.score < 6.5 ? 'text-warning-600' : 
                                  'text-gray-600'
                                }`}>
                                  Điểm: {course.score.toFixed(1)}
                                </span>
                                <span className={`font-medium ${
                                  course.progress < 50 ? 'text-danger-600' : 
                                  course.progress < 75 ? 'text-warning-600' : 
                                  'text-gray-600'
                                }`}>
                                  Tiến độ: {course.progress}%
                                </span>
                              </div>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pending Assignments */}
              {modalContent.type === 'pending' && (
                <div className="space-y-3">
                  {modalContent.data.map((assignment, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{assignment.title}</div>
                          <div className="text-sm text-gray-600 mt-1">{assignment.course} • {assignment.className}</div>
                        </div>
                        <span className="px-3 py-1 bg-warning-100 text-warning-800 rounded-full text-sm font-medium">
                          Chờ chấm
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 mt-3 text-sm">
                        <div>
                          <div className="text-gray-600">Đã nộp</div>
                          <div className="font-medium text-gray-900">{assignment.submittedCount}/{assignment.totalStudents}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Hạn nộp</div>
                          <div className="font-medium text-gray-900">
                            {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-600">Nộp muộn</div>
                          <div className="font-medium text-warning-600">{assignment.lateSubmissions}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReportStats;
