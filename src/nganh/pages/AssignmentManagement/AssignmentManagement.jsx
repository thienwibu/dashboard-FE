import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, FileText } from 'lucide-react';
import AssignmentStats from './components/AssignmentStats';
import AssignmentFilters from './components/AssignmentFilters';
import AssignmentList from './components/AssignmentList';
import { mockAssignmentData } from '../../data/mockData';

const normalizeDifficulty = (difficulty) => {
  const key = (difficulty || '').toLowerCase();
  if (key === 'easy' || key === 'dễ') return 'easy';
  if (key === 'medium' || key === 'chuẩn' || key === 'chuan') return 'medium';
  if (['hard', 'advanced', 'nâng cao'].includes(key)) return 'advanced';
  return 'medium';
};

const AssignmentManagement = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    course: 'all',
    class: 'all',
    dateRange: 'all',
    difficulty: 'all',
    skill: 'all',
    goal: 'all',
    type: 'all',
    grade: 'all',
    time: 'all'
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 800));
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
        setAssignments((prev) => prev.filter((assignment) => assignment.id !== assignmentId));
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.course || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filters.status === 'all' || assignment.status === filters.status;
    const matchesCourse = filters.course === 'all' || assignment.courseId === filters.course;
    const matchesClass = filters.class === 'all' || assignment.classId === filters.class;
    const matchesDifficulty =
      filters.difficulty === 'all' || normalizeDifficulty(assignment.difficulty) === filters.difficulty;
    const matchesType = filters.type === 'all' || (assignment.type || '').toLowerCase() === filters.type;
    const matchesGrade = filters.grade === 'all' || (assignment.gradeLevel || '').toLowerCase() === filters.grade;
    const matchesSkill =
      filters.skill === 'all' || (assignment.skills || []).some((s) => s.toLowerCase() === filters.skill);
    const matchesGoal = filters.goal === 'all' || (assignment.goal || '').toLowerCase() === filters.goal;
    const matchesTime =
      filters.time === 'all' ||
      (() => {
        const t = assignment.timeLimitMinutes || 0;
        if (filters.time === 'short') return t > 0 && t <= 20;
        if (filters.time === 'medium') return t > 20 && t <= 45;
        if (filters.time === 'long') return t > 45;
        return true;
      })();

    return (
      matchesSearch &&
      matchesStatus &&
      matchesCourse &&
      matchesClass &&
      matchesDifficulty &&
      matchesType &&
      matchesGrade &&
      matchesSkill &&
      matchesGoal &&
      matchesTime
    );
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
          <h1 className="text-2xl font-bold text-gray-900">Ngân Hàng Bài Tập</h1>
          <p className="text-gray-600 mt-1">Tạo, chỉnh sửa và theo dõi tiến độ bài tập của sinh viên</p>
        </div>
        <Link to="/assignments/create" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Tạo Bài Tập Mới</span>
        </Link>
      </div>

      {/* Stats */}
      <AssignmentStats data={mockAssignmentData.stats} />

      {/* Search and Filters */}
      <div className="card p-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm bài tập..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
          </div>

          <AssignmentFilters filters={filters} onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* Assignment List */}
      <AssignmentList assignments={filteredAssignments} onDelete={handleDeleteAssignment} />

      {filteredAssignments.length === 0 && !loading && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy bài tập nào</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some((f) => f !== 'all')
              ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm'
              : 'Bắt đầu bằng cách tạo bài tập đầu tiên'}
          </p>
          {!searchTerm && Object.values(filters).every((f) => f === 'all') && (
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
