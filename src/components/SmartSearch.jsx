import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, BookOpen, FileText, Users, Clock, Loader2 } from 'lucide-react';
import { searchService } from '../services/searchService';

const SmartSearch = ({ userRole = 'teacher' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const debounceTimer = useRef(null);

  // Mock data - Thay bằng API call thực tế
  const mockData = {
    pages: [
      { type: 'page', name: 'Dashboard', path: '/dashboard', icon: 'home' },
      { type: 'page', name: 'Quản lý Khóa học', path: '/courses', icon: 'book' },
      { type: 'page', name: 'Quản lý Lớp học', path: '/classes', icon: 'users' },
      { type: 'page', name: 'Quản lý Bài tập', path: '/assignments', icon: 'file' },
      { type: 'page', name: 'Theo dõi Sinh viên', path: '/students', icon: 'user' },
      { type: 'page', name: 'Báo cáo', path: '/reports', icon: 'chart' },
      { type: 'page', name: 'Cài đặt', path: '/settings', icon: 'settings' },
    ],
    courses: [
      { type: 'course', id: 1, name: 'Lập trình Web', code: 'CS101', students: 45 },
      { type: 'course', id: 2, name: 'Cấu trúc dữ liệu', code: 'CS102', students: 38 },
      { type: 'course', id: 3, name: 'Cơ sở dữ liệu', code: 'CS201', students: 42 },
    ],
    classes: [
      { type: 'class', id: 1, name: 'Lớp Web K18', code: 'WEB-K18', students: 30 },
      { type: 'class', id: 2, name: 'Lớp CTDL K18', code: 'CTDL-K18', students: 28 },
    ],
    students: [
      { type: 'student', mssv: '2051120001', name: 'Nguyễn Văn A', class: 'K18-CNTT1', email: 'nva@student.edu.vn' },
      { type: 'student', mssv: '2051120002', name: 'Trần Thị B', class: 'K18-CNTT1', email: 'ttb@student.edu.vn' },
      { type: 'student', mssv: '2051120003', name: 'Lê Văn C', class: 'K18-CNTT2', email: 'lvc@student.edu.vn' },
      { type: 'student', mssv: '2051120004', name: 'Phạm Thị D', class: 'K18-CNTT2', email: 'ptd@student.edu.vn' },
    ],
    assignments: [
      { type: 'assignment', id: 1, name: 'Bài tập HTML/CSS', course: 'Lập trình Web', deadline: '2024-12-30' },
      { type: 'assignment', id: 2, name: 'Bài tập JavaScript', course: 'Lập trình Web', deadline: '2024-12-25' },
    ]
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tìm kiếm với API thực tế
  const searchAll = async (searchQuery) => {
    if (!searchQuery.trim()) return [];

    const lowerQuery = searchQuery.toLowerCase();
    const results = [];

    // Tìm trang (local search)
    mockData.pages.forEach(page => {
      if (page.name.toLowerCase().includes(lowerQuery)) {
        results.push(page);
      }
    });

    try {
      // Gọi API tìm kiếm (có thể thay bằng searchService.searchAll)
      // Tạm thời dùng mock data, sau này thay bằng:
      // const apiResults = await searchService.searchAll(searchQuery);
      
      // Tìm khóa học
      mockData.courses.forEach(course => {
        if (course.name.toLowerCase().includes(lowerQuery) || 
            course.code.toLowerCase().includes(lowerQuery)) {
          results.push(course);
        }
      });

      // Tìm lớp học
      mockData.classes.forEach(cls => {
        if (cls.name.toLowerCase().includes(lowerQuery) || 
            cls.code.toLowerCase().includes(lowerQuery)) {
          results.push(cls);
        }
      });

      // Tìm sinh viên (theo MSSV hoặc tên)
      mockData.students.forEach(student => {
        if (student.mssv.includes(searchQuery) || 
            student.name.toLowerCase().includes(lowerQuery)) {
          results.push(student);
        }
      });

      // Tìm bài tập
      mockData.assignments.forEach(assignment => {
        if (assignment.name.toLowerCase().includes(lowerQuery)) {
          results.push(assignment);
        }
      });
    } catch (error) {
      console.error('Search error:', error);
    }

    return results.slice(0, 8); // Giới hạn 8 kết quả
  };

  // Debounce search
  const debouncedSearch = useCallback((searchQuery) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      if (searchQuery.trim()) {
        setLoading(true);
        const results = await searchAll(searchQuery);
        setSuggestions(results);
        setShowSuggestions(true);
        setSelectedIndex(-1);
        setLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setLoading(false);
      }
    }, 300); // Đợi 300ms sau khi người dùng ngừng gõ
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < suggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (item) => {
    setQuery('');
    setShowSuggestions(false);
    setSuggestions([]);

    try {
      switch (item.type) {
        case 'page':
          if (item.path) navigate(item.path);
          break;
        case 'course':
          if (item.id) navigate(`/courses/${item.id}`);
          break;
        case 'class':
          if (item.id) navigate(`/classes/${item.id}`);
          break;
        case 'assignment':
          if (item.id) navigate(`/assignments/${item.id}`);
          break;
        case 'student':
          // Hiển thị modal thông tin sinh viên
          showStudentInfo(item);
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  const showStudentInfo = (student) => {
    // Tạo modal hiển thị thông tin sinh viên
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Thông tin sinh viên</h3>
          <button onclick="this.closest('.fixed').remove()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">MSSV</label>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100">${student.mssv}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Họ và tên</label>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100">${student.name}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Lớp</label>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100">${student.class}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <div class="bg-gray-50 dark:bg-gray-700 rounded-lg px-4 py-2 text-gray-900 dark:text-gray-100">${student.email}</div>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button onclick="this.closest('.fixed').remove()" class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">
            Đóng
          </button>
          <button onclick="window.location.href='/students?mssv=${student.mssv}'" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Xem chi tiết
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'page':
        return <Search className="w-4 h-4" />;
      case 'course':
        return <BookOpen className="w-4 h-4" />;
      case 'class':
        return <Users className="w-4 h-4" />;
      case 'student':
        return <User className="w-4 h-4" />;
      case 'assignment':
        return <FileText className="w-4 h-4" />;
      default:
        return <Search className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      page: 'Trang',
      course: 'Khóa học',
      class: 'Lớp học',
      student: 'Sinh viên',
      assignment: 'Bài tập'
    };
    return labels[type] || type;
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 dark:bg-yellow-600 text-gray-900 dark:text-gray-100">{part}</mark>
        : part
    );
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setShowSuggestions(true)}
          placeholder="Tìm kiếm trang, khóa học, sinh viên, MSSV..."
          className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setShowSuggestions(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
          {suggestions.map((item, index) => (
            <button
              key={`${item.type}-${item.id || item.mssv || item.path}-${index}`}
              onClick={() => handleSelectSuggestion(item)}
              className={`w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
                selectedIndex === index ? 'bg-gray-50 dark:bg-gray-700' : ''
              }`}
            >
              <div className="mt-1 text-gray-400 dark:text-gray-500">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {highlightMatch(item.name, query)}
                  </span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                    {getTypeLabel(item.type)}
                  </span>
                </div>
                {item.type === 'student' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    MSSV: {highlightMatch(item.mssv, query)} • {item.class}
                  </div>
                )}
                {item.type === 'course' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mã: {item.code} • {item.students} sinh viên
                  </div>
                )}
                {item.type === 'class' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Mã: {item.code} • {item.students} sinh viên
                  </div>
                )}
                {item.type === 'assignment' && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {item.course} • Hạn: {item.deadline}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results */}
      {showSuggestions && query && suggestions.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Không tìm thấy kết quả cho "{query}"
          </p>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;
