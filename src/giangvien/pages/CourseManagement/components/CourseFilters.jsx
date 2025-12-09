import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

const CourseFilters = ({ onFilterChange, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilterChange?.({ status: status === 'all' ? null : status });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    onSearch?.('');
    onFilterChange?.({ status: null });
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả', count: null },
    { value: 'active', label: 'Đang hoạt động', count: null },
    { value: 'completed', label: 'Đã hoàn thành', count: null },
    { value: 'upcoming', label: 'Sắp diễn ra', count: null }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Bar */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm khóa học theo tên..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg font-medium transition-colors"
        >
          <Filter size={18} />
          <span>Bộ lọc</span>
        </button>
      </div>

      {/* Filters - Desktop always shown, Mobile toggleable */}
      <div className={`${showFilters ? 'block' : 'hidden'} lg:block mt-4`}>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === option.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {option.label}
              {option.count !== null && (
                <span className="ml-2 text-xs opacity-75">({option.count})</span>
              )}
            </button>
          ))}

          {/* Clear Filters */}
          {(searchTerm || selectedStatus !== 'all') && (
            <button
              onClick={clearFilters}
              className="ml-auto flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X size={16} />
              <span>Xóa bộ lọc</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseFilters;

