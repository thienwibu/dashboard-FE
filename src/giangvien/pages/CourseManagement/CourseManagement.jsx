import { useState, useEffect } from 'react';
import { BookOpen, Plus } from 'lucide-react';
import CourseStats from './components/CourseStats';
import CourseFilters from './components/CourseFilters';
import CourseList from './components/CourseList';
import AddCourseModal from './components/AddCourseModal';
import { mockDashboardData } from '../../data/mockData';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: null });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    // Transform mockData to course format with class information
    const courseData = mockDashboardData.courseMonitoring.map(course => {
      // Get progress data for this course
      const progressData = mockDashboardData.progressOverview.all.find(
        p => p.course === course.name
      );

      return {
        id: course.name.toLowerCase().replace(/\s+/g, '-'),
        name: course.name,
        enrolledStudents: course.enrolledStudents,
        duration: course.duration,
        status: course.status,
        completionRate: course.completionRate,
        averageScore: course.averageScore,
        completed: progressData?.completed || 0,
        inProgress: progressData?.inProgress || 0,
        notStarted: progressData?.notStarted || 0,
        classes: [
          { name: '22CT111', completionRate: 83 },
          { name: '22CT112', completionRate: 90 },
          { name: '22CT113', completionRate: 66 }
        ]
      };
    });

    setCourses(courseData);
    setFilteredCourses(courseData);

    // Calculate stats
    const totalCourses = courseData.length;
    const activeCourses = courseData.filter(c => c.status === 'active').length;
    // Tổng sinh viên thực tế trong lớp (không phải tổng enrolledStudents vì sinh viên học nhiều môn)
    const totalStudents = mockDashboardData.kpiMetrics.totalStudents || 10;
    const avgScore = courseData.reduce((sum, c) => sum + c.averageScore, 0) / totalCourses;

    setStats({
      totalCourses,
      courseChange: 0,
      activeCourses,
      activeChange: 0,
      totalStudents,
      studentChange: mockDashboardData.kpiMetrics.studentChange,
      averageScore: avgScore,
      scoreChange: mockDashboardData.kpiMetrics.completionChange
    });
  }, []);

  useEffect(() => {
    let result = [...courses];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status) {
      result = result.filter(course => course.status === filters.status);
    }

    setFilteredCourses(result);
  }, [searchTerm, filters, courses]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleAddCourse = (courseData) => {
    console.log('Khóa học mới:', courseData);
    alert('Đã thêm khóa học: ' + courseData.name);
    // In real app, call API to create course
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <BookOpen className="text-blue-600" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý Khóa học</h1>
                <p className="text-gray-600 mt-1">
                  Quản lý và theo dõi tất cả các khóa học
                </p>
              </div>
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-sm"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Thêm khóa học</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <CourseStats stats={stats} />

        {/* Filters */}
        <CourseFilters 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
        />

        {/* Course List */}
        <CourseList courses={filteredCourses} />
      </div>

      {/* Add Course Modal */}
      <AddCourseModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddCourse}
      />
    </div>
  );
};

export default CourseManagement;

