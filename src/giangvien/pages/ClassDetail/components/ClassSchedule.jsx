import React from 'react';
import { Calendar, Clock, MapPin, Users, Video } from 'lucide-react';

const ClassSchedule = ({ schedule, classId }) => {
  const [showAttendanceDetail, setShowAttendanceDetail] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState(null);

  const calculateAttendanceScore = (session) => {
    const totalStudents = (session.attendedStudents || 0) + (session.absentStudents || 0) + (session.lateStudents || 0);
    if (totalStudents === 0) return 0;
    
    // Có mặt = 10 điểm, Muộn = 5 điểm, Vắng = 0 điểm
    const totalScore = (session.attendedStudents || 0) * 10 + (session.lateStudents || 0) * 5 + (session.absentStudents || 0) * 0;
    return (totalScore / totalStudents).toFixed(1);
  };

  const getSessionTypeIcon = (type) => {
    const icons = {
      lecture: Calendar,
      lab: Users,
      online: Video,
      exam: Clock
    };
    return icons[type] || Calendar;
  };

  const getSessionTypeColor = (type) => {
    const colors = {
      lecture: 'bg-primary-50 text-primary-600',
      lab: 'bg-success-50 text-success-600',
      online: 'bg-warning-50 text-warning-600',
      exam: 'bg-danger-50 text-danger-600'
    };
    return colors[type] || colors.lecture;
  };

  const getSessionTypeName = (type) => {
    const names = {
      lecture: 'Lý thuyết',
      lab: 'Thực hành',
      online: 'Trực tuyến',
      exam: 'Kiểm tra'
    };
    return names[type] || 'Lý thuyết';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { class: 'status-badge status-completed', text: 'Đã hoàn thành' },
      ongoing: { class: 'status-badge status-active', text: 'Đang diễn ra' },
      upcoming: { class: 'status-badge status-pending', text: 'Sắp diễn ra' },
      cancelled: { class: 'status-badge status-at-risk', text: 'Đã hủy' }
    };
    
    return statusConfig[status] || statusConfig.upcoming;
  };

  return (
    <div className="space-y-6">
      {/* Schedule Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {schedule?.filter(s => s.status === 'completed').length || 0}
          </div>
          <div className="text-sm text-gray-600">Buổi đã hoàn thành</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-success-600 mb-1">
            {schedule?.filter(s => s.status === 'ongoing').length || 0}
          </div>
          <div className="text-sm text-gray-600">Buổi đang diễn ra</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-warning-600 mb-1">
            {schedule?.filter(s => s.status === 'upcoming').length || 0}
          </div>
          <div className="text-sm text-gray-600">Buổi sắp diễn ra</div>
        </div>
        <div className="card p-6 text-center">
          <div className="text-2xl font-bold text-danger-600 mb-1">
            {schedule?.filter(s => s.status === 'cancelled').length || 0}
          </div>
          <div className="text-sm text-gray-600">Buổi đã hủy</div>
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-4">
        {schedule?.map((session, index) => {
          const SessionIcon = getSessionTypeIcon(session.type);
          const statusInfo = getStatusBadge(session.status);
          
          return (
            <div key={index} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${getSessionTypeColor(session.type)}`}>
                    <SessionIcon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {getSessionTypeName(session.type)}
                      </span>
                      <span className={statusInfo.class}>
                        {statusInfo.text}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{session.description}</p>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>{session.date}</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedSession(session);
                    setShowAttendanceDetail(true);
                  }}
                  className="text-right bg-primary-50 rounded-lg p-3 hover:bg-primary-100 transition-colors cursor-pointer group"
                >
                  <div className="text-2xl font-bold text-primary-600 mb-1">
                    {session.status === 'completed' ? calculateAttendanceScore(session) : '-'}
                  </div>
                  <div className="text-xs text-gray-600">Điểm chuyên cần TB</div>
                  <div className="text-xs text-primary-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Xem chi tiết →
                  </div>
                </button>
              </div>

              {session.status === 'completed' && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Có mặt: </span>
                      <span className="font-medium text-success-600">{session.attendedStudents}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vắng mặt: </span>
                      <span className="font-medium text-danger-600">{session.absentStudents}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Muộn: </span>
                      <span className="font-medium text-warning-600">{session.lateStudents}</span>
                    </div>
                  </div>
                </div>
              )}

              {session.materials && session.materials.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Tài liệu buổi học:</h4>
                  <div className="flex flex-wrap gap-2">
                    {session.materials.map((material, idx) => (
                      <a
                        key={idx}
                        href={material.url}
                        className="text-sm text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1 rounded-full"
                      >
                        {material.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {(!schedule || schedule.length === 0) && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có lịch học nào
          </h3>
          <p className="text-gray-500">
            Lịch học sẽ được hiển thị khi được tạo
          </p>
        </div>
      )}

      {/* Attendance Detail Modal */}
      {showAttendanceDetail && selectedSession && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowAttendanceDetail(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedSession.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedSession.date}</p>
                </div>
                <button onClick={() => setShowAttendanceDetail(false)} className="text-gray-400 hover:text-gray-600">
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-primary-50 rounded-lg p-4 text-center">
                  <div className="text-4xl font-bold text-primary-600 mb-2">
                    {calculateAttendanceScore(selectedSession)}
                  </div>
                  <div className="text-sm text-gray-600">Điểm chuyên cần trung bình</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Có mặt = 10đ • Muộn = 5đ • Vắng = 0đ
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-success-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-success-600">{selectedSession.attendedStudents || 0}</div>
                  <div className="text-sm text-gray-600">Có mặt (10đ)</div>
                </div>
                <div className="bg-warning-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-warning-600">{selectedSession.lateStudents || 0}</div>
                  <div className="text-sm text-gray-600">Muộn (5đ)</div>
                </div>
                <div className="bg-danger-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-danger-600">{selectedSession.absentStudents || 0}</div>
                  <div className="text-sm text-gray-600">Vắng (0đ)</div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Cách tính điểm chuyên cần:</h4>
                <div className="text-sm text-gray-700 space-y-2">
                  <p>• Mỗi sinh viên <strong>có mặt</strong> được <strong className="text-success-600">10 điểm</strong></p>
                  <p>• Mỗi sinh viên <strong>đến muộn</strong> được <strong className="text-warning-600">5 điểm</strong></p>
                  <p>• Mỗi sinh viên <strong>vắng mặt</strong> được <strong className="text-danger-600">0 điểm</strong></p>
                  <p className="pt-2 border-t border-gray-200 mt-2">
                    <strong>Điểm TB = </strong>
                    ({selectedSession.attendedStudents}×10 + {selectedSession.lateStudents}×5 + {selectedSession.absentStudents}×0) / 
                    {(selectedSession.attendedStudents || 0) + (selectedSession.lateStudents || 0) + (selectedSession.absentStudents || 0)} = 
                    <strong className="text-primary-600"> {calculateAttendanceScore(selectedSession)} điểm</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSchedule;