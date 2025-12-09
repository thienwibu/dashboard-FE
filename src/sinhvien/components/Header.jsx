import React, { useState, useEffect, useRef } from 'react';
import { studentInfo, availableCourses, courseExercises, projects } from '../data/data';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ currentPage, setCurrentPage, darkMode, setDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '📊' },
    { id: 'courses', label: 'Khóa học', icon: '📖' },
    { id: 'exercises', label: 'Bài tập', icon: '📚' },
    { id: 'feedback', label: 'Lỗi & Phản hồi', icon: '🐛' },
    { id: 'profile', label: 'Hồ sơ', icon: '👤' }
  ];

  // Lấy enrolled courses từ sessionStorage
  const getEnrolledCourses = () => {
    const saved = sessionStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  };

  // Tìm kiếm
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const results = [];

    // Tìm trong menu items (quick actions)
    menuItems.forEach(item => {
      if (item.label.toLowerCase().includes(query) || item.id.toLowerCase().includes(query)) {
        results.push({
          type: 'action',
          label: item.label,
          icon: item.icon,
          id: item.id,
          action: () => setCurrentPage(item.id)
        });
      }
    });

    // Tìm trong courses
    availableCourses.forEach(course => {
      if (course.name.toLowerCase().includes(query) || 
          course.code.toLowerCase().includes(query) ||
          course.instructor.toLowerCase().includes(query)) {
        results.push({
          type: 'course',
          label: course.name,
          subtitle: course.code,
          icon: course.thumbnail,
          id: course.id,
          action: () => {
            setCurrentPage('courses');
            // Có thể scroll đến course sau khi chuyển trang
          }
        });
      }
    });

    // Tìm trong exercises (từ enrolled courses)
    const enrolledCourses = getEnrolledCourses();
    enrolledCourses.forEach(course => {
      const exercises = courseExercises[course.id] || [];
      exercises.forEach(exercise => {
        if (exercise.title.toLowerCase().includes(query) ||
            exercise.description.toLowerCase().includes(query)) {
          results.push({
            type: 'exercise',
            label: exercise.title,
            subtitle: course.name,
            icon: '📝',
            id: exercise.id,
            action: () => {
              setCurrentPage('exercises');
            }
          });
        }
      });
    });

    // Tìm trong projects
    projects.forEach(project => {
      if (project.name.toLowerCase().includes(query)) {
        results.push({
          type: 'project',
          label: project.name,
          subtitle: project.role,
          icon: '💼',
          id: project.id,
          action: () => {
            setCurrentPage('profile');
          }
        });
      }
    });

    setSearchResults(results.slice(0, 8)); // Giới hạn 8 kết quả
    setShowSearchDropdown(results.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Keyboard navigation
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
          setSearchQuery('');
          setShowSearchDropdown(false);
        }
      } else if (e.key === 'Escape') {
        setShowSearchDropdown(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSearchDropdown, selectedIndex, searchResults]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResultClick = (result) => {
    if (result.action) {
      result.action();
      setSearchQuery('');
      setShowSearchDropdown(false);
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      'action': 'Chức năng',
      'course': 'Khóa học',
      'exercise': 'Bài tập',
      'project': 'Đề tài'
    };
    return labels[type] || '';
  };

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Beginner':
        return 'bg-blue-100 text-blue-800';
      case 'Intermediate':
        return 'bg-purple-100 text-purple-800';
      case 'Advanced':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      {/* Header chính */}
      <header className="header-gradient sticky top-0 z-40 transition-all duration-300">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Badges & Dark Mode - Bên trái */}
            <div className="flex items-center space-x-3">
              <div className={`badge ${getLevelColor(studentInfo.level)}`}>
                {studentInfo.level}
              </div>
              <div className={`badge border ${getRiskLevelColor(studentInfo.riskLevel)}`}>
                Nguy cơ: {studentInfo.riskLevel}
              </div>
              <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>

            {/* Thanh Tìm kiếm - Ở giữa */}
            <div className="flex-1 max-w-2xl mx-4 relative" ref={searchRef}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowSearchDropdown(true)}
                  placeholder="Tìm kiếm chức năng, khóa học, bài tập..."
                  className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-800"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </span>
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
              </div>

              {/* Dropdown Results */}
              {showSearchDropdown && searchResults.length > 0 && (
                <div
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
                >
                  {searchResults.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
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
                  ref={dropdownRef}
                  className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50"
                >
                  <p className="text-gray-600 text-center">Không tìm thấy kết quả</p>
                </div>
              )}
            </div>

            {/* Thông tin sinh viên - Bên phải */}
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <h2 className="text-lg font-bold text-gray-800">{studentInfo.name}</h2>
                <div className="flex items-center justify-end space-x-2 text-sm text-gray-600">
                  <span>{studentInfo.class}</span>
                  <span>•</span>
                  <span>{studentInfo.course}</span>
                </div>
              </div>
              <img
                src={studentInfo.avatar}
                alt={studentInfo.name}
                className="w-12 h-12 rounded-full border-2 border-primary-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden mobile-nav-gradient sticky top-[73px] z-30 transition-all duration-300">
        <div className="flex overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'text-primary-500 dark:text-primary-400 border-b-2 border-primary-500 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;

