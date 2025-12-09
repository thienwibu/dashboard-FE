import React, { useState, useRef, useEffect } from 'react';
import { authAPI, clearAccessToken } from '../../services/api';
import { availableCourses, studyGroups, groupAssignments, courseLessons } from '../data/data';

const X = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Menu = () => (
  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const Bell = () => (
  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const Search = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const User = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LogOut = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const Settings = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const HeaderNew = ({ onMenuClick, setCurrentPage }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const [user, setUser] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const notificationRef = useRef(null);
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const searchDropdownRef = useRef(null);

  // Menu items for function search
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
    { id: 'courses', label: 'Khóa học', icon: '📖' },
    { id: 'exercises', label: 'Bài tập', icon: '📚' },
    { id: 'feedback', label: 'Lỗi & Phản hồi', icon: '🐛' },
    { id: 'profile', label: 'Hồ sơ', icon: '👤' }
  ];

  // Fetch user info from API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Try to get from sessionStorage first
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Then fetch from API for latest data
        const response = await authAPI.getCurrentUser();
        if (response.success && response.data && response.data.user) {
          setUser(response.data.user);
          // Update sessionStorage
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('❌ Error fetching user info:', error);
        // Fallback to sessionStorage if API fails
        const savedUser = sessionStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      }
    };

    fetchUserInfo();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Dữ liệu thông báo học tập mẫu
  const notifications = [
    {
      id: 1,
      type: 'deadline',
      title: 'Bài tập sắp đến hạn',
      message: 'Bài tập "Xây dựng ứng dụng Quản lý Thư viện" sẽ hết hạn sau 2 ngày',
      time: '5 phút trước',
      icon: '⏰',
      course: 'Nhập môn Lập trình',
      unread: true
    },
    {
      id: 2,
      type: 'grade',
      title: 'Đã có điểm mới',
      message: 'Bạn đã nhận được điểm 9.5 cho bài tập "React Components"',
      time: '1 giờ trước',
      icon: '📊',
      course: 'Kỹ thuật Lập trình',
      unread: true
    },
    {
      id: 3,
      type: 'lesson',
      title: 'Bài học mới đã được thêm',
      message: 'Bài 5: "Hàm và Thủ tục" đã được mở cho khóa học "Nhập môn Lập trình"',
      time: '3 giờ trước',
      icon: '📚',
      course: 'Nhập môn Lập trình',
      unread: true
    },
    {
      id: 4,
      type: 'group',
      title: 'Thông báo từ nhóm học tập',
      message: 'Nhóm "Lập trình Cơ bản" có cuộc họp mới vào ngày 25/11/2025 lúc 14:00',
      time: '1 ngày trước',
      icon: '👥',
      course: 'Nhập môn Lập trình',
      unread: false
    },
    {
      id: 5,
      type: 'achievement',
      title: 'Hoàn thành khóa học',
      message: 'Chúc mừng! Bạn đã hoàn thành 20% khóa học "Nhập môn Lập trình"',
      time: '2 ngày trước',
      icon: '🎉',
      course: 'Nhập môn Lập trình',
      unread: false
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Nhắc nhở học tập',
      message: 'Bạn đã không học bài trong 3 ngày. Hãy tiếp tục học để đạt mục tiêu!',
      time: '3 ngày trước',
      icon: '💡',
      course: null,
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  // Search functionality
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = [];

    // 1. Tìm kiếm chức năng (menu items)
    menuItems.forEach(item => {
      if (item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)) {
        results.push({
          type: 'action',
          label: item.label,
          icon: item.icon,
          id: item.id,
          action: () => {
            if (setCurrentPage) setCurrentPage(item.id);
            setSearchQuery('');
            setShowSearchDropdown(false);
          }
        });
      }
    });

    // 2. Tìm kiếm khóa học
    availableCourses.forEach(course => {
      if (course.name.toLowerCase().includes(query) || 
          course.code.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query)) {
        results.push({
          type: 'course',
          label: course.name,
          subtitle: `${course.code} - ${course.instructor}`,
          icon: course.thumbnail || '📖',
          id: course.id,
          action: () => {
            if (setCurrentPage) setCurrentPage('courses');
            setSearchQuery('');
            setShowSearchDropdown(false);
          }
        });
      }
    });

    // 3. Tìm kiếm nhóm học tập
    studyGroups.forEach(group => {
      if (group.name.toLowerCase().includes(query) ||
          group.courseName.toLowerCase().includes(query)) {
        results.push({
          type: 'group',
          label: group.name,
          subtitle: group.courseName,
          icon: '👥',
          id: group.id,
          action: () => {
            if (setCurrentPage) setCurrentPage('courses');
            setSearchQuery('');
            setShowSearchDropdown(false);
          }
        });
      }
    });

    // 4. Tìm kiếm bài tập nhóm
    Object.values(groupAssignments).flat().forEach(assignment => {
      if (assignment.title.toLowerCase().includes(query) ||
          assignment.description.toLowerCase().includes(query) ||
          assignment.groupName.toLowerCase().includes(query)) {
        results.push({
          type: 'assignment',
          label: assignment.title,
          subtitle: `${assignment.groupName} - ${assignment.courseName}`,
          icon: '📝',
          id: assignment.id,
          action: () => {
            if (setCurrentPage) setCurrentPage('courses');
            setSearchQuery('');
            setShowSearchDropdown(false);
          }
        });
      }
    });

    // 5. Tìm kiếm bài học
    Object.entries(courseLessons).forEach(([courseId, lessons]) => {
      lessons.forEach(lesson => {
        if (lesson.title.toLowerCase().includes(query) ||
            lesson.description.toLowerCase().includes(query)) {
          const course = availableCourses.find(c => c.id === parseInt(courseId));
          results.push({
            type: 'lesson',
            label: lesson.title,
            subtitle: course ? course.name : 'Bài học',
            icon: '📚',
            id: lesson.id,
            action: () => {
              if (setCurrentPage) setCurrentPage('courses');
              setSearchQuery('');
              setShowSearchDropdown(false);
            }
          });
        }
      });
    });

    setSearchResults(results.slice(0, 10)); // Giới hạn 10 kết quả
    setShowSearchDropdown(results.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery, setCurrentPage]);

  // Keyboard navigation for search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSearchDropdown) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        const result = searchResults[selectedIndex];
        if (result && result.action) {
          result.action();
        }
      } else if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchDropdown, selectedIndex, searchResults]);

  const getTypeLabel = (type) => {
    const labels = {
      'action': 'Chức năng',
      'course': 'Khóa học',
      'group': 'Nhóm học tập',
      'assignment': 'Bài tập',
      'lesson': 'Bài học'
    };
    return labels[type] || '';
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear all data
      clearAccessToken();
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('dashboardType');
      
      // Redirect to login
      window.location.href = '/login';
    }
  };

  const handleProfileClick = async () => {
    setUserMenuOpen(false);
    setLoadingProfile(true);
    setProfileModalOpen(true);
    
    try {
      const response = await authAPI.getCurrentUser();
      setProfileData(response.data.user);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          >
            <Menu />
          </button>
          
          {/* Search bar */}
          <div className="hidden md:flex items-center">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery && setShowSearchDropdown(true)}
                placeholder="Tìm kiếm chức năng, khóa học, bài tập..."
                className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              )}
              
              {/* Search Dropdown Results */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div
                  ref={searchDropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                >
                  {searchResults.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => result.action && result.action()}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        index === selectedIndex ? 'bg-primary-50' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{result.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-800 truncate">{result.label}</p>
                            <span className="text-xs text-gray-500 ml-2">{getTypeLabel(result.type)}</span>
                          </div>
                          {result.subtitle && (
                            <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {showSearchDropdown && searchQuery && searchResults.length === 0 && (
                <div
                  ref={searchDropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
                >
                  <p className="text-gray-600 text-center">Không tìm thấy kết quả</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notification button */}
          <div className="relative" ref={notificationRef}>
            <button 
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
            <Bell />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 bg-danger-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {notificationOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Thông báo</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => {
                        // Mark all as read
                        notifications.forEach(n => n.unread = false);
                        setNotificationOpen(false);
                      }}
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>

                {/* Notifications List */}
                <div className="overflow-y-auto flex-1">
                  {notifications.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <button
                          key={notification.id}
                          onClick={() => {
                            // Mark as read
                            notification.unread = false;
                            setNotificationOpen(false);
                            // Navigate if needed
                            if (notification.type === 'deadline' || notification.type === 'lesson') {
                              if (setCurrentPage) setCurrentPage('courses');
                            }
                          }}
                          className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                            notification.unread ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <span className="text-2xl flex-shrink-0">{notification.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <p className={`font-medium text-sm ${notification.unread ? 'text-gray-900' : 'text-gray-700'}`}>
                                  {notification.title}
                                </p>
                                {notification.unread && (
                                  <span className="h-2 w-2 bg-primary-500 rounded-full flex-shrink-0 mt-1.5 ml-2"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              {notification.course && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {notification.course}
                                </p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                          </div>
          </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <p>Không có thông báo mới</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* User profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center space-x-3 pl-3 border-l border-gray-200 hover:opacity-80 transition-opacity"
            >
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">{user?.full_name || 'Người dùng'}</p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'sinh_vien' ? 'Sinh viên' : 
                   user?.role === 'giang_vien' ? 'Giảng viên' : 
                   user?.role === 'manage_nghanh' ? 'Quản lý Ngành' : 'User'}
                </p>
              </div>
              <div className="h-9 w-9 bg-primary-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </button>

            {/* User Dropdown Menu */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-bold text-gray-900">{user?.full_name || 'Người dùng'}</p>
                  <p className="text-xs text-gray-600 mt-1">{user?.email || 'Chưa có email'}</p>
                  <div className="flex items-center gap-2 mt-2">
                    {user?.mssv && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-semibold">
                        MSSV: {user.mssv}
                      </span>
                    )}
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-semibold">
                      {user?.role === 'sinh_vien' ? 'Sinh viên' : 
                       user?.role === 'giang_vien' ? 'Giảng viên' : 
                       user?.role === 'manage_nghanh' ? 'Quản lý Ngành' : 'User'}
                    </span>
                  </div>
                </div>
                
                <div className="py-1">
                  <button 
                    onClick={handleProfileClick}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Hồ sơ của tôi</span>
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (setCurrentPage) setCurrentPage('profile');
                      setUserMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 mr-3 text-gray-400" />
                    <span>Cài đặt</span>
                  </button>
                </div>
                
                <div className="border-t border-gray-100 py-1">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-danger-600 hover:bg-danger-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Hồ sơ của tôi</h2>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {loadingProfile ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : profileData ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-900">{profileData.full_name}</div>
                  </div>

                  {profileData.mssv && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">MSSV</label>
                      <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-900">{profileData.mssv}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-900">{profileData.email}</div>
                  </div>

                  {profileData.class && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Lớp</label>
                      <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-900">{profileData.class}</div>
                    </div>
                  )}

                  {profileData.address && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                      <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-900">{profileData.address}</div>
                    </div>
                  )}

                  {profileData.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                      <div className="bg-gray-50 rounded-lg px-4 py-2 text-gray-900">{profileData.phone}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">Không thể tải thông tin hồ sơ</div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setProfileModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderNew;
