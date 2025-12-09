import React, { useState, useEffect, useRef } from 'react';
import { Search, User, BookOpen, Users, GraduationCap, FileText, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { mockStudentTrackingData, mockDepartmentData, mockClassData, mockAssignmentData } from '../../data/mockData';
import { coursePerformanceData } from '../../data/coursePerformanceData';
import { useNavigate } from 'react-router-dom';

const GlobalSearch = () => {
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  // Tìm kiếm trong tất cả dữ liệu
  const performSearch = (query) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const queryLower = query.toLowerCase().trim();
    const searchResults = [];

    // Tìm kiếm sinh viên
    const students = coursePerformanceData.students || [];
    students.forEach(student => {
      const nameMatch = student.name.toLowerCase().includes(queryLower);
      const idMatch = student.studentId?.toLowerCase().includes(queryLower);
      
      if (nameMatch || idMatch) {
        searchResults.push({
          type: 'student',
          id: student.id,
          title: student.name,
          subtitle: student.studentId || `Sinh viên`,
          icon: User,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          onClick: () => {
            navigate(`/student-tracking`);
            setShowResults(false);
            setSearchQuery('');
          }
        });
      }
    });

    // Tìm kiếm giảng viên
    const teachers = mockDepartmentData.teachers || [];
    teachers.forEach(teacher => {
      const nameMatch = teacher.name.toLowerCase().includes(queryLower);
      const emailMatch = teacher.email?.toLowerCase().includes(queryLower);
      
      if (nameMatch || emailMatch) {
        searchResults.push({
          type: 'teacher',
          id: teacher.id,
          title: teacher.name,
          subtitle: teacher.position || 'Giảng viên',
          icon: GraduationCap,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          onClick: () => {
            navigate(`/teacher-management`);
            setShowResults(false);
            setSearchQuery('');
          }
        });
      }
    });

    // Tìm kiếm khóa học
    const courseNames = ['Nhập môn lập trình', 'Kỹ thuật lập trình', 'Cấu trúc dữ liệu & GT', 'Lập trình HĐT'];
    courseNames.forEach(courseName => {
      if (courseName.toLowerCase().includes(queryLower)) {
        searchResults.push({
          type: 'course',
          id: courseName,
          title: courseName,
          subtitle: 'Khóa học',
          icon: BookOpen,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          onClick: () => {
            navigate(`/course-management`);
            setShowResults(false);
            setSearchQuery('');
          }
        });
      }
    });

    // Tìm kiếm lớp học
    const classes = mockClassData.classes || [];
    classes.forEach(classItem => {
      const nameMatch = classItem.name?.toLowerCase().includes(queryLower);
      const courseMatch = classItem.course?.toLowerCase().includes(queryLower);
      
      if (nameMatch || courseMatch) {
        searchResults.push({
          type: 'class',
          id: classItem.id,
          title: `${classItem.name} - ${classItem.course}`,
          subtitle: `Lớp học | ${classItem.instructor || ''}`,
          icon: Users,
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          onClick: () => {
            navigate(`/class-management`);
            setShowResults(false);
            setSearchQuery('');
          }
        });
      }
    });

    // Tìm kiếm bài tập
    const assignments = mockAssignmentData.assignments || [];
    assignments.forEach(assignment => {
      const titleMatch = assignment.title?.toLowerCase().includes(queryLower);
      const courseMatch = assignment.course?.toLowerCase().includes(queryLower);
      
      if (titleMatch || courseMatch) {
        searchResults.push({
          type: 'assignment',
          id: assignment.id,
          title: assignment.title,
          subtitle: `${assignment.course || ''} | ${assignment.className || ''}`,
          icon: FileText,
          color: 'text-indigo-600',
          bgColor: 'bg-indigo-50',
          onClick: () => {
            navigate(`/assignment-management`);
            setShowResults(false);
            setSearchQuery('');
          }
        });
      }
    });

    // Giới hạn số lượng kết quả
    setResults(searchResults.slice(0, 8));
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Xử lý keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < results.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      results[selectedIndex].onClick();
    } else if (e.key === 'Escape') {
      setShowResults(false);
      setSearchQuery('');
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowResults(true);
    setSelectedIndex(-1);
  };

  const handleClear = () => {
    setSearchQuery('');
    setResults([]);
    setShowResults(false);
  };

  const getTypeLabel = (type) => {
    const labels = {
      student: 'Sinh viên',
      teacher: 'Giảng viên',
      course: 'Khóa học',
      class: 'Lớp học',
      assignment: 'Bài tập'
    };
    return labels[type] || type;
  };

  // Highlight từ khóa tìm kiếm trong text
  const highlightText = (text, query) => {
    if (!query || !text) return text;
    
    // Escape special regex characters
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return parts.map((part, index) => 
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className={`${isDarkMode ? 'bg-yellow-600 text-yellow-100' : 'bg-yellow-200 text-yellow-900'} px-0.5 rounded`}>
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Tìm kiếm sinh viên, khóa học..."
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowResults(true)}
          className={`pl-10 pr-10 py-2 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-80 border ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
              : 'border-gray-300'
          }`}
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
          >
            <X className={`h-3 w-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        )}
      </div>

      {/* Dropdown kết quả */}
      {showResults && results.length > 0 && (
        <div
          ref={resultsRef}
          className={`absolute top-full left-0 mt-2 w-96 rounded-lg shadow-lg border z-50 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="max-h-96 overflow-y-auto">
            {results.map((result, index) => {
              const Icon = result.icon;
              const isSelected = index === selectedIndex;
              
              return (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={result.onClick}
                  className={`w-full text-left px-4 py-3 flex items-start space-x-3 transition-colors ${
                    isSelected
                      ? isDarkMode
                        ? 'bg-gray-700'
                        : 'bg-gray-50'
                      : isDarkMode
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <div className={`flex-shrink-0 mt-1 ${result.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                      {highlightText(result.title, searchQuery)}
                    </div>
                    <div className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {highlightText(result.subtitle, searchQuery)}
                    </div>
                    <div className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                      isDarkMode 
                        ? `${result.bgColor} ${result.color}`
                        : `${result.bgColor} ${result.color}`
                    }`}>
                      {getTypeLabel(result.type)}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Hiển thị "Không tìm thấy" */}
      {showResults && searchQuery.length >= 2 && results.length === 0 && (
        <div
          ref={resultsRef}
          className={`absolute top-full left-0 mt-2 w-96 rounded-lg shadow-lg border z-50 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="px-4 py-8 text-center">
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Không tìm thấy kết quả cho "{searchQuery}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;

