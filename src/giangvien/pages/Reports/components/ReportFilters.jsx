import { Calendar, Filter, RotateCcw } from 'lucide-react';
import { useState } from 'react';

const ReportFilters = ({ onFilterChange }) => {
  const [dateRange, setDateRange] = useState('week');
  const [reportType, setReportType] = useState('all');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    onFilterChange?.({ dateRange: range, reportType });
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    onFilterChange?.({ dateRange, reportType: type });
  };

  const handleReset = () => {
    setDateRange('week');
    setReportType('all');
    onFilterChange?.({ dateRange: 'week', reportType: 'all' });
  };

  const dateRangeOptions = [
    { value: 'today', label: 'Hôm nay' },
    { value: 'week', label: 'Tuần này' },
    { value: 'month', label: 'Tháng này' },
    { value: 'quarter', label: 'Quý này' },
    { value: 'year', label: 'Năm này' },
    { value: 'custom', label: 'Tùy chỉnh' }
  ];

  const reportTypes = [
    { value: 'all', label: 'Tất cả' },
    { value: 'performance', label: 'Hiệu suất' },
    { value: 'students', label: 'Sinh viên' },
    { value: 'courses', label: 'Khóa học' },
    { value: 'assignments', label: 'Bài tập' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="text-gray-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc báo cáo</h3>
        </div>
        
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200 hover:shadow-sm"
        >
          <RotateCcw size={16} className="transition-transform hover:rotate-180 duration-500" />
          <span>Đặt lại</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Range Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Calendar size={16} />
            Khoảng thời gian
          </label>
          <div className="grid grid-cols-3 gap-2">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleDateRangeChange(option.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  dateRange === option.value
                    ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Report Type Filter */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Filter size={16} />
            Loại báo cáo
          </label>
          <div className="grid grid-cols-3 gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => handleReportTypeChange(type.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                  reportType === type.value
                    ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-200'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Date Range (shown when custom is selected) */}
      {dateRange === 'custom' && (
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Từ ngày
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đến ngày
              </label>
              <input
                type="date"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Advanced Filters Toggle */}
      <div className="mt-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          {showAdvanced ? '− Ẩn bộ lọc nâng cao' : '+ Hiển thị bộ lọc nâng cao'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Khóa học
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 cursor-pointer"
                onChange={(e) => onFilterChange?.({ course: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="intro-prog">Nhập môn lập trình</option>
                <option value="prog-technique">Kĩ thuật lập trình</option>
                <option value="oop">Lập trình hướng đối tượng</option>
                <option value="data-struct-algo">CTDL&GT</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lớp học
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 cursor-pointer"
                onChange={(e) => onFilterChange?.({ class: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="22CT111">22CT111</option>
                <option value="22CT112">22CT112</option>
                <option value="22CT113">22CT113</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức độ rủi ro
              </label>
              <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-blue-300 cursor-pointer"
                onChange={(e) => onFilterChange?.({ riskLevel: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportFilters;

