import React from 'react';
import { Filter, Download, RefreshCw } from 'lucide-react';

const DashboardHeader = ({ filters, onFilterChange }) => {
  const courseOptions = [
    { value: 'all', label: 'Tất cả khóa học' },
    { value: 'intro-prog', label: 'Nhập môn lập trình' },
    { value: 'prog-technique', label: 'Kĩ thuật lập trình' },
    { value: 'oop', label: 'Lập trình hướng đối tượng' },
    { value: 'data-struct-algo', label: 'Cấu trúc dữ liệu và giải thuật' }
  ];

  const classOptions = [
    { value: 'all', label: 'Tất cả lớp' },
    { value: '22CT111', label: '22CT111' },
    { value: '22CT112', label: '22CT112' },
    { value: '22CT113', label: '22CT113' }
  ];

  const performanceOptions = [
    { value: 'all', label: 'Tất cả mức độ' },
    { value: 'excellent', label: 'Xuất sắc' },
    { value: 'good', label: 'Tốt' },
    { value: 'average', label: 'Trung bình' },
    { value: 'poor', label: 'Yếu' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang học' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'at-risk', label: 'Có nguy cơ' }
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản Lý Tiến Độ</h1>
        <p className="text-gray-600 mt-1">Theo dõi và quản lý tiến độ học lập trình của sinh viên</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            value={filters.course}
            onChange={(e) => onFilterChange('course', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {courseOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>

        <select
          value={filters.class}
          onChange={(e) => onFilterChange('class', e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {classOptions.map(option => (
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

        <div className="flex items-center space-x-2">
          <button className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Làm mới</span>
          </button>
          
          <button className="btn-primary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;