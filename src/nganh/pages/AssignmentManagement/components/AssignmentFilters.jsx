import React from 'react';
import {
  Filter,
  ListFilter,
  BookOpen,
  GraduationCap,
  Clock3,
  Signal,
  Sparkles,
  Target,
  Timer
} from 'lucide-react';

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
    { value: 'prog-technique', label: 'Kỹ thuật lập trình' },
    { value: 'oop', label: 'Lập trình hướng đối tượng' },
    { value: 'data-struct-algo', label: 'Cấu trúc dữ liệu & giải thuật' }
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

  const difficultyOptions = [
    { value: 'all', label: 'Mức độ: tất cả' },
    { value: 'easy', label: 'Dễ' },
    { value: 'medium', label: 'Chuẩn' },
    { value: 'advanced', label: 'Nâng cao' }
  ];

  const skillOptions = [
    { value: 'all', label: 'Kỹ năng: tất cả' },
    { value: 'if-else', label: 'If-Else' },
    { value: 'loop', label: 'Loop' },
    { value: 'function', label: 'Function' },
    { value: 'array', label: 'Array' },
    { value: 'debug', label: 'Debug' },
    { value: 'string', label: 'String' }
  ];

  const goalOptions = [
    { value: 'all', label: 'Mục tiêu: tất cả' },
    { value: 'reinforce', label: 'Củng cố' },
    { value: 'practice', label: 'Luyện tập' },
    { value: 'challenge', label: 'Thử thách' },
    { value: 'exam', label: 'Ôn thi/kiểm tra' }
  ];

  const timeOptions = [
    { value: 'all', label: 'Thời lượng: tất cả' },
    { value: 'short', label: '≤ 5 phút' },
    { value: 'medium', label: '5–10 phút' },
    { value: 'long', label: '> 10 phút' }
  ];

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center space-x-2">
        <Filter className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-700 font-medium">Lọc:</span>
      </div>

      <div className="flex items-center gap-2">
        <ListFilter className="h-4 w-4 text-gray-500" />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-gray-500" />
        <select
          value={filters.course}
          onChange={(e) => handleFilterChange('course', e.target.value)}
          className="min-w-[170px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {courseOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <GraduationCap className="h-4 w-4 text-gray-500" />
        <select
          value={filters.class}
          onChange={(e) => handleFilterChange('class', e.target.value)}
          className="min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {classOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Clock3 className="h-4 w-4 text-gray-500" />
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {dateRangeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Signal className="h-4 w-4 text-gray-500" />
        <select
          value={filters.difficulty}
          onChange={(e) => handleFilterChange('difficulty', e.target.value)}
          className="min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {difficultyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-gray-500" />
        <select
          value={filters.skill}
          onChange={(e) => handleFilterChange('skill', e.target.value)}
          className="min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {skillOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-gray-500" />
        <select
          value={filters.goal}
          onChange={(e) => handleFilterChange('goal', e.target.value)}
          className="min-w-[160px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {goalOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <Timer className="h-4 w-4 text-gray-500" />
        <select
          value={filters.time}
          onChange={(e) => handleFilterChange('time', e.target.value)}
          className="min-w-[150px] border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AssignmentFilters;
