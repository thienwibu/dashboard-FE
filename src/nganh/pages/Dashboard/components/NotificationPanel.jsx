import React, { useState } from 'react';
import { Bell, X, AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const NotificationPanel = ({ data }) => {
  // Thông báo ngành mặc định
  const defaultIndustryNotifications = [
    {
      id: 'ind-1',
      type: 'warning',
      title: 'Cảnh báo khóa học',
      message: '3 môn có tỷ lệ hoàn thành < 70% cần được hỗ trợ và theo dõi.',
      timestamp: new Date(),
      read: false,
      priority: 'high'
    },
    {
      id: 'ind-2',
      type: 'warning',
      title: 'Điểm TB ngành giảm',
      message: 'Tỷ lệ điểm TB ngành giảm 3% so với tháng trước.',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      read: false,
      priority: 'high'
    },
    {
      id: 'ind-3',
      type: 'reminder',
      title: 'Cập nhật tiến độ',
      message: '2 giảng viên chưa cập nhật tiến độ môn trong 7 ngày.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    },
    {
      id: 'ind-4',
      type: 'info',
      title: 'Tiến độ học tập',
      message: '85% sinh viên năm 3 đã hoàn thành tối thiểu 3/5 học phần chính.',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: false,
      priority: 'medium'
    }
  ];

  const [notifications, setNotifications] = useState(
    data && data.length > 0 ? data : defaultIndustryNotifications
  );
  const [filter, setFilter] = useState('all');

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
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-primary-200 shadow-sm'
                }`}
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
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                            title="Đánh dấu đã đọc"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-danger-600 transition-colors"
                          title="Xóa thông báo"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
    </div>
  );
};

export default NotificationPanel;