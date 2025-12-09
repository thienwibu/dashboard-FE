import React, { useState } from 'react';
import { Filter, RotateCcw, Eye } from 'lucide-react';

const AdvancedStudentFilters = ({ onFilterChange, onViewGroupDetails }) => {
  const [filters, setFilters] = useState({
    course: 'all',
    class: 'all',
    semester: 'all',
    riskLevel: 'all',
    academicYear: 'all'
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      course: 'all',
      class: 'all',
      semester: 'all',
      riskLevel: 'all',
      academicYear: 'all'
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc nâng cao</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewGroupDetails?.(filters)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Eye className="h-4 w-4" />
            <span>Xem nhóm chi tiết</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
            <span>Đặt lại</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Khóa học
          </label>
          <select
            value={filters.course}
            onChange={(e) => handleFilterChange('course', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="intro-prog">Nhập môn lập trình</option>
            <option value="prog-technique">Kĩ thuật lập trình</option>
            <option value="oop">Lập trình hướng đối tượng</option>
            <option value="data-struct-algo">CTDL&GT</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Lớp
          </label>
          <select
            value={filters.class}
            onChange={(e) => handleFilterChange('class', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="22CT111">22CT111</option>
            <option value="22CT112">22CT112</option>
            <option value="22CT113">22CT113</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Học kỳ
          </label>
          <select
            value={filters.semester}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="2024-1">Học kỳ 1 - 2024</option>
            <option value="2024-2">Học kỳ 2 - 2024</option>
            <option value="2025-1">Học kỳ 1 - 2025</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mức rủi ro
          </label>
          <select
            value={filters.riskLevel}
            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Năm học
          </label>
          <select
            value={filters.academicYear}
            onChange={(e) => handleFilterChange('academicYear', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="1">Năm 1</option>
            <option value="2">Năm 2</option>
            <option value="3">Năm 3</option>
            <option value="4">Năm 4</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdvancedStudentFilters;

