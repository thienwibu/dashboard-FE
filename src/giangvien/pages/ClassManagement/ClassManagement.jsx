import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Grid, List, Download, RefreshCw } from 'lucide-react';
import ClassCard from './components/ClassCard';
import ClassList from './components/ClassList';
import ClassFilters from './components/ClassFilters';
import ClassStats from './components/ClassStats';
import StudentPerformanceDistribution from './components/StudentPerformanceDistribution';
import { mockClassData } from '../../data/mockData';

const ClassManagement = () => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    course: 'all',
    schedule: 'all',
    performance: 'all'
  });

  useEffect(() => {
    loadClassData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [classes, searchTerm, filters]);

  const loadClassData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setClasses(mockClassData.classes);
    } catch (error) {
      console.error('Error loading class data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = classes.filter(classItem => {
      const matchesSearch = classItem.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        classItem.course.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filters.status === 'all' || classItem.status === filters.status;
      const matchesCourse = filters.course === 'all' || classItem.courseId === filters.course;

      // Lọc theo tiến độ hoàn thành (%)
      let matchesCompletion = true;
      if (filters.performance !== 'all') {
        const completion = classItem.completionRate;
        switch (filters.performance) {
          case 'excellent':
            matchesCompletion = completion >= 85;
            break;
          case 'good':
            matchesCompletion = completion >= 75 && completion < 85;
            break;
          case 'average':
            matchesCompletion = completion >= 65 && completion < 75;
            break;
          case 'poor':
            matchesCompletion = completion < 65;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesCourse && matchesCompletion;
    });

    setFilteredClasses(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleRefresh = () => {
    loadClassData();
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting class data...');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Lớp Học</h1>
          <p className="text-gray-600 mt-1">
            Theo dõi và quản lý tất cả các lớp học được phân công
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm lớp học..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <Grid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="btn-secondary flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Làm mới</span>
            </button>

            <button
              onClick={handleExport}
              className="btn-primary flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Xuất báo cáo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <ClassStats data={mockClassData.stats} />

      {/* Student Performance Distribution */}
      <StudentPerformanceDistribution classDetails={mockClassData.classDetails} />

      {/* Filters */}
      <ClassFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        totalClasses={filteredClasses.length}
      />

      {/* Classes Display */}
      <div className="space-y-6">
        {filteredClasses.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy lớp học nào
            </h3>
            <p className="text-gray-500">
              Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
            </p>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClasses.map((classItem) => (
                  <ClassCard key={classItem.id} classData={classItem} />
                ))}
              </div>
            ) : (
              <ClassList classes={filteredClasses} />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ClassManagement;