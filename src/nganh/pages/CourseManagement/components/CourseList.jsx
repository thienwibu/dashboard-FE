import React, { useState } from 'react';
import CourseCard from './CourseCard';
import { Grid3x3, List, SortAsc, SortDesc } from 'lucide-react';

const CourseList = ({ courses = [], allCourses = [] }) => {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('name'); // 'name', 'students', 'completion', 'score'
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'

  const sortCourses = (coursesToSort) => {
    return [...coursesToSort].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'students':
          aValue = a.enrolledStudents || 0;
          bValue = b.enrolledStudents || 0;
          break;
        case 'completion':
          aValue = a.completionRate || 0;
          bValue = b.completionRate || 0;
          break;
        case 'score':
          aValue = a.averageScore || 0;
          bValue = b.averageScore || 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string') {
        return sortOrder === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const sortedCourses = sortCourses(courses);

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const sortOptions = [
    { value: 'name', label: 'Tên khóa học' },
    { value: 'students', label: 'Số sinh viên' },
    { value: 'completion', label: 'Tỷ lệ hoàn thành' },
    { value: 'score', label: 'Điểm trung bình' }
  ];

  return (
    <div>
      {/* Toolbar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Hiển thị {sortedCourses.length} khóa học
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 hidden sm:block">Sắp xếp:</span>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                title={sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
              >
                {sortOrder === 'asc' ? <SortAsc size={18} /> : <SortDesc size={18} />}
              </button>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Xem dạng lưới"
              >
                <Grid3x3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Xem dạng danh sách"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Cards */}
      {sortedCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Grid3x3 size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy khóa học
          </h3>
          <p className="text-gray-600">
            Không có khóa học nào phù hợp với bộ lọc của bạn
          </p>
        </div>
      ) : (
        <div className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'flex flex-col gap-4'
        }>
          {sortedCourses.map((course) => (
            <CourseCard 
              key={course.id} 
              course={course}
              courses={allCourses.length > 0 ? allCourses : courses}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;

