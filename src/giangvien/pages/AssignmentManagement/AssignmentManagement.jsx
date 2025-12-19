import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Filter, Calendar, Users, Clock, CheckCircle, AlertTriangle, FileText, Eye, Edit, Trash2 } from 'lucide-react';
import AssignmentStats from './components/AssignmentStats';
import AssignmentFilters from './components/AssignmentFilters';
import AssignmentList from './components/AssignmentList';
import SmartSearchInput from '../../components/SmartSearchInput';
import { mockAssignmentData } from '../../data/mockData';

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    course: 'all',
    dateRange: 'all'
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      setAssignments(mockAssignmentData.assignments);
    } catch (error) {
      console.error('Error loading assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      try {
        setAssignments(prev => prev.filter(assignment => assignment.id !== assignmentId));
        // Here you would make an API call to delete the assignment
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || assignment.status === filters.status;
    const matchesCourse = filters.course === 'all' || assignment.courseId === filters.course;
    
    return matchesSearch && matchesStatus && matchesCourse;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="card p-6 mb-6">
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="card p-6">
                <div className="h-24 bg-gray-200 rounded"></div>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Quản Lý Bài Tập</h1>
          <p className="text-gray-600 mt-1">
            Tạo, chỉnh sửa và theo dõi tiến độ bài tập của sinh viên
          </p>
        </div>
        <Link
          to="/assignments/create"
          className="btn-primary flex items-center space-x-2 !text-white"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo Bài Tập Mới</span>
        </Link>
      </div>

      {/* Stats */}
      <AssignmentStats data={mockAssignmentData.stats} />

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <SmartSearchInput
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Tìm kiếm bài tập..."
              className="w-80"
            />
          </div>
          
          <AssignmentFilters 
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Assignment List */}
      <AssignmentList 
        assignments={filteredAssignments}
        onDelete={handleDeleteAssignment}
      />

      {filteredAssignments.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Không tìm thấy bài tập nào
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some(f => f !== 'all') 
              ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm'
              : 'Bắt đầu bằng cách tạo bài tập đầu tiên'
            }
          </p>
          {!searchTerm && Object.values(filters).every(f => f === 'all') && (
            <Link to="/assignments/create" className="btn-primary">
              Tạo Bài Tập Đầu Tiên
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignmentManagement;