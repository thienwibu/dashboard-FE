import React, { useState } from 'react';
import { Filter, BarChart3, FileText, Search } from 'lucide-react';
import { useTheme } from '../../../contexts/ThemeContext';

const IndustryFilters = ({ onFilterChange, onAnalyze, onExport, onSearchChange, onCompletionRangeChange }) => {
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState({
    semester: 'all',
    subject: 'all',
    lecturer: 'all',
    status: 'all'
  });
  const [searchText, setSearchText] = useState('');
  const [completionRange, setCompletionRange] = useState('all');

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearchChange = (value) => {
    setSearchText(value);
    onSearchChange?.(value);
  };

  const handleCompletionRangeChange = (value) => {
    setCompletionRange(value);
    onCompletionRangeChange?.(value);
  };

  const completionRangeOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: '85-100', label: '85% - 100% (Xuất sắc)' },
    { value: '70-85', label: '70% - 85% (Tốt)' },
    { value: '50-70', label: '50% - 70% (Trung bình)' },
    { value: '0-50', label: '0% - 50% (Cần cải thiện)' }
  ];

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      {/* Thanh tìm kiếm sinh viên */}
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Ô tìm kiếm mã/tên sinh viên */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Tìm theo mã SV hoặc tên sinh viên..."
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            />
          </div>
          
          {/* Ô lọc theo tiến độ hoàn thành */}
          <div>
            <select
              value={completionRange}
              onChange={(e) => handleCompletionRangeChange(e.target.value)}
              className={`w-full px-4 py-2 rounded-lg border ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500' 
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {completionRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Bộ lọc */}
        <div className="flex flex-wrap items-center gap-3">
          <Filter className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <select
            value={filters.semester}
            onChange={(e) => handleFilterChange('semester', e.target.value)}
            className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Học kỳ</option>
            <option value="2024-1">Học kỳ 1 - 2024</option>
            <option value="2024-2">Học kỳ 2 - 2024</option>
            <option value="2025-1">Học kỳ 1 - 2025</option>
          </select>

          <select
            value={filters.subject}
            onChange={(e) => handleFilterChange('subject', e.target.value)}
            className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Môn</option>
            <option value="intro-prog">Nhập môn lập trình</option>
            <option value="prog-technique">Kĩ thuật lập trình</option>
            <option value="oop">Lập trình hướng đối tượng</option>
            <option value="data-struct-algo">Cấu trúc dữ liệu và giải thuật</option>
          </select>

          <select
            value={filters.lecturer}
            onChange={(e) => handleFilterChange('lecturer', e.target.value)}
            className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Giảng viên</option>
            <option value="TS. Nguyễn Văn An">TS. Nguyễn Văn An</option>
            <option value="TS. Trần Thị Bình">TS. Trần Thị Bình</option>
            <option value="TS. Lê Văn Cường">TS. Lê Văn Cường</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className={`border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="all">Tình trạng môn</option>
            <option value="risk">Nguy cơ</option>
            <option value="stable">Ổn định</option>
            <option value="completed">Hoàn thành</option>
          </select>
        </div>

        {/* Các nút tương tác */}
        <div className="flex items-center gap-3">
          <button
            onClick={onAnalyze}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <BarChart3 className="h-4 w-4" />
            Phân tích chi tiết ngành
          </button>
          
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <FileText className="h-4 w-4" />
            Xuất báo cáo ngành
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndustryFilters;

