import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationPanel = ({ data }) => {
  const [notifications, setNotifications] = useState(data || []);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const getNotificationIcon = (type) => {
    const icons = {
      warning: AlertTriangle,
      info: Info,
      success: CheckCircle,
      reminder: Clock
    };
    return icons[type] || Info;
  };

  const getNotificationColor = (type) => {
    const colors = {
      warning: 'text-warning-600 bg-warning-50',
      info: 'text-primary-600 bg-primary-50',
      success: 'text-success-600 bg-success-50',
      reminder: 'text-gray-600 bg-gray-50'
    };
    return colors[type] || colors.info;
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    setSelectedNotification(notification);
    setShowModal(true);
  };

  const getNotificationDetails = (notification) => {
    // Giả lập dữ liệu chi tiết dựa trên loại thông báo
    if (notification.title.includes('nguy cơ')) {
      return {
        type: 'at_risk_students',
        students: [
          { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003', completionRate: 45, averageScore: 6.0, course: 'Nhập môn lập trình' },
          { id: 9, name: 'Lý Minh Tuấn', studentId: '122000009', completionRate: 38, averageScore: 5.5, course: 'Nhập môn lập trình' }
        ]
      };
    }
    return { type: 'general', details: notification.message };
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'priority') return notif.priority === 'high';
    return true;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Thông Báo</h3>
          {unreadCount > 0 && (
            <span className="bg-danger-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="unread">Chưa đọc</option>
            <option value="priority">Ưu tiên</option>
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không có thông báo nào</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            const colorClass = getNotificationColor(notification.type);
            
            return (
              <button
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`w-full p-4 rounded-lg border transition-all text-left ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                    : 'bg-white border-primary-200 shadow-sm hover:shadow-md'
                } cursor-pointer`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${
                          notification.read ? 'text-gray-700' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </p>
                        <p className={`text-sm mt-1 ${
                          notification.read ? 'text-gray-500' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {formatDistanceToNow(new Date(notification.timestamp), { 
                            addSuffix: true, 
                            locale: vi 
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Đánh dấu đã đọc"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                          title="Xóa thông báo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {filteredNotifications.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium">
            Xem tất cả thông báo
          </button>
        </div>
      )}

      {/* Modal chi tiết thông báo */}
      {showModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-full ${getNotificationColor(selectedNotification.type)}`}>
                  {React.createElement(getNotificationIcon(selectedNotification.type), { className: "h-6 w-6" })}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedNotification.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {formatDistanceToNow(new Date(selectedNotification.timestamp), { 
                      addSuffix: true, 
                      locale: vi 
                    })}
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
              <div className="mb-6">
                <p className="text-gray-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {/* Chi tiết dựa trên loại thông báo */}
              {(() => {
                const details = getNotificationDetails(selectedNotification);
                
                if (details.type === 'at_risk_students') {
                  return (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Danh sách sinh viên cần chú ý
                      </h4>
                      <div className="space-y-3">
                        {details.students.map((student, index) => (
                          <div 
                            key={student.id}
                            className="flex items-center justify-between p-4 bg-danger-50 rounded-lg border border-danger-200"
                          >
                            <div className="flex items-center space-x-4 flex-1">
                              <div className="flex-shrink-0 w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                                <span className="text-danger-600 font-semibold">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-600">{student.studentId} • {student.course}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-6">
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Điểm TB</p>
                                <p className="text-lg font-bold text-danger-600">{student.averageScore.toFixed(1)}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-gray-600">Hoàn thành</p>
                                <p className="text-lg font-bold text-warning-600">{student.completionRate}%</p>
                              </div>
                              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-danger-100 text-danger-700">
                                Có nguy cơ
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-warning-50 border border-warning-200 rounded-lg">
                        <p className="text-sm font-medium text-warning-800 mb-2">
                          💡 Đề xuất hành động
                        </p>
                        <ul className="text-sm text-warning-700 space-y-1 list-disc list-inside">
                          <li>Liên hệ trực tiếp với sinh viên để tìm hiểu nguyên nhân</li>
                          <li>Xem xét cung cấp tài liệu học tập bổ sung</li>
                          <li>Đề xuất lớp học phụ đạo hoặc hỗ trợ cá nhân</li>
                          <li>Theo dõi tiến độ hàng tuần</li>
                        </ul>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{details.details}</p>
                  </div>
                );
              })()}
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

export default NotificationPanel;