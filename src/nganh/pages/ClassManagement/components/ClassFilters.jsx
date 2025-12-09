import React from 'react';
import { Filter } from 'lucide-react';

const ClassFilters = ({ filters, onFilterChange, totalClasses }) => {
  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang diễn ra' },
    { value: 'upcoming', label: 'Sắp diễn ra' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const courseOptions = [
    { value: 'all', label: 'Tất cả khóa học' },
    { value: 'intro-prog', label: 'Nhập môn lập trình' },
    { value: 'prog-technique', label: 'Kĩ thuật lập trình' },
    { value: 'oop', label: 'Lập trình hướng đối tượng' },
    { value: 'data-struct-algo', label: 'Cấu trúc dữ liệu và giải thuật' }
  ];

  const scheduleOptions = [
    { value: 'all', label: 'Tất cả lịch học' },
    { value: 'morning', label: 'Buổi sáng' },
    { value: 'afternoon', label: 'Buổi chiều' },
    { value: 'evening', label: 'Buổi tối' },
    { value: 'weekend', label: 'Cuối tuần' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'Tất cả mức độ' },
    { value: 'excellent', label: 'Xuất sắc (≥85%)' },
    { value: 'good', label: 'Tốt (75-84%)' },
    { value: 'average', label: 'Trung bình (65-74%)' },
    { value: 'poor', label: 'Yếu (<65%)' }
  ];

  return (
    <div className="card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900">Bộ lọc</h3>
          <span className="text-sm text-gray-500">
            ({totalClasses} lớp học)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.course}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {courseOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.schedule}
            onChange={(e) => onFilterChange('schedule', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {scheduleOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            value={filters.performance}
            onChange={(e) => onFilterChange('performance', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {performanceOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <button
            onClick={() => onFilterChange('reset', null)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassFilters;