import React, { useState } from 'react';
import { Search, Filter, X, UserCheck, Calendar, AlertTriangle } from 'lucide-react';

const CourseFilters = ({ onFilterChange, onSearch, courses = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInstructor, setSelectedInstructor] = useState('all');
  const [selectedSemester, setSelectedSemester] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // Lấy danh sách giảng viên duy nhất
  const uniqueInstructors = [...new Set(courses.flatMap(c => c.instructorNames || []))];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    onFilterChange?.({ status: status === 'all' ? null : status, instructor: selectedInstructor, semester: selectedSemester, risk: selectedRisk });
  };

  const handleInstructorChange = (instructor) => {
    setSelectedInstructor(instructor);
    onFilterChange?.({ status: selectedStatus === 'all' ? null : selectedStatus, instructor: instructor === 'all' ? null : instructor, semester: selectedSemester, risk: selectedRisk });
  };

  const handleSemesterChange = (semester) => {
    setSelectedSemester(semester);
    onFilterChange?.({ status: selectedStatus === 'all' ? null : selectedStatus, instructor: selectedInstructor, semester: semester === 'all' ? null : semester, risk: selectedRisk });
  };

  const handleRiskChange = (risk) => {
    setSelectedRisk(risk);
    onFilterChange?.({ status: selectedStatus === 'all' ? null : selectedStatus, instructor: selectedInstructor, semester: selectedSemester, risk: risk === 'all' ? null : risk });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('all');
    setSelectedInstructor('all');
    setSelectedSemester('all');
    setSelectedRisk('all');
    onSearch?.('');
    onFilterChange?.({ status: null, instructor: null, semester: null, risk: null });
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
        <div className="space-y-4">
          {/* Tab phụ (bộ lọc sâu) */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Filter size={16} />
              Bộ lọc sâu:
            </span>
            
            {/* Theo giảng viên */}
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-gray-500" />
              <select
                value={selectedInstructor}
                onChange={(e) => handleInstructorChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Theo giảng viên</option>
                {uniqueInstructors.map(instructor => (
                  <option key={instructor} value={instructor}>{instructor}</option>
                ))}
              </select>
            </div>

            {/* Theo học kỳ */}
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-gray-500" />
              <select
                value={selectedSemester}
                onChange={(e) => handleSemesterChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Theo học kỳ</option>
                <option value="2024-1">Học kỳ 1 - 2024</option>
                <option value="2024-2">Học kỳ 2 - 2024</option>
                <option value="2025-1">Học kỳ 1 - 2025</option>
              </select>
            </div>

            {/* Theo rủi ro */}
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-gray-500" />
              <select
                value={selectedRisk}
                onChange={(e) => handleRiskChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Theo rủi ro</option>
                <option value="risk">Khóa có rủi ro</option>
                <option value="stable">Khóa ổn định</option>
                <option value="good">Khóa tốt</option>
              </select>
            </div>
          </div>

          {/* Trạng thái */}
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
              </button>
            ))}

            {/* Clear Filters */}
            {(searchTerm || selectedStatus !== 'all' || selectedInstructor !== 'all' || selectedSemester !== 'all' || selectedRisk !== 'all') && (
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
    </div>
  );
};

export default CourseFilters;

