import React from 'react';
import { Filter, Calendar } from 'lucide-react';

const AssignmentFilters = ({ filters, onFilterChange }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'draft', label: 'Bản nháp' },
    { value: 'active', label: 'Đang mở' },
    { value: 'upcoming', label: 'Sắp mở' },
    { value: 'completed', label: 'Đã đóng' },
    { value: 'overdue', label: 'Quá hạn' }
  ];

  const courseOptions = [
    { value: 'all', label: 'Tất cả khóa học' },
    { value: 'intro-prog', label: 'Nhập môn lập trình' },
    { value: 'prog-technique', label: 'Kĩ thuật lập trình' },
    { value: 'oop', label: 'Lập trình hướng đối tượng' },
    { value: 'data-struct-algo', label: 'Cấu trúc dữ liệu và giải thuật' }
  ];

  const classOptions = [
    { value: 'all', label: 'Tất cả lớp học' },
    { value: '22CT111', label: '22CT111' },
    { value: '22CT112', label: '22CT112' },
    { value: '22CT113', label: '22CT113' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'Tất cả thời gian' },
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'quarter', label: 'Quý này' }
  ];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700 font-medium">Lọc:</span>
      </div>
      
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {statusOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.course}
        onChange={(e) => handleFilterChange('course', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {courseOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.class}
        onChange={(e) => handleFilterChange('class', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {classOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={filters.dateRange}
        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {dateRangeOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AssignmentFilters;