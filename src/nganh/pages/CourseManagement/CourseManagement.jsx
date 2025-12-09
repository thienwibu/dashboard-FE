import { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import CourseStats from './components/CourseStats';
import CourseFilters from './components/CourseFilters';
import CourseList from './components/CourseList';
import CourseSummaryChart from './components/CourseSummaryChart';
import { mockDashboardData, mockClassData } from '../../data/mockData';

const CourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: null, instructor: null, semester: null, risk: null });

  useEffect(() => {
    // Transform mockData to course format with class information
    const courseData = mockDashboardData.courseMonitoring.map(course => {
      // Get progress data for this course
      const progressData = mockDashboardData.progressOverview.all.find(
        p => p.course === course.name
      );

      // Map course names to courseId
      const courseIdMap = {
        'Nhập môn lập trình': 'intro-prog',
        'Kĩ thuật lập trình': 'prog-technique',
        'Lập trình hướng đối tượng': 'oop',
        'Cấu trúc dữ liệu và giải thuật': 'data-struct-algo'
      };
      const courseId = courseIdMap[course.name] || course.name.toLowerCase().replace(/\s+/g, '-');

      // Get classes for this course
      const courseClasses = mockClassData.classes.filter(c => c.courseId === courseId);
      
      // Calculate number of unique instructors
      const uniqueInstructors = new Set(courseClasses.map(c => c.instructor));
      const instructorCount = uniqueInstructors.size;
      
      // Get instructor names (abbreviated)
      const instructorNames = Array.from(uniqueInstructors).map(instructor => {
        const parts = instructor.split(' ');
        return parts.length > 2 ? `${parts[0]} ${parts[parts.length - 1]}` : instructor;
      });

      // Calculate average completion rate from classes
      const avgCompletionRate = courseClasses.length > 0
        ? Math.round(courseClasses.reduce((sum, c) => sum + (c.completionRate || 0), 0) / courseClasses.length)
        : course.completionRate;

      // Calculate classes with completion rates
      const classesWithProgress = courseClasses.map(c => ({
        name: c.name,
        completionRate: c.completionRate || 0
      }));

      // Mock last updated (3 days ago)
      const lastUpdated = '3 ngày trước';

      return {
        id: course.name.toLowerCase().replace(/\s+/g, '-'),
        name: course.name,
        enrolledStudents: course.enrolledStudents,
        duration: course.duration,
        status: course.status,
        completionRate: avgCompletionRate,
        averageScore: course.averageScore,
        completed: progressData?.completed || 0,
        inProgress: progressData?.inProgress || 0,
        notStarted: progressData?.notStarted || 0,
        classes: classesWithProgress,
        instructorCount,
        instructorNames,
        classCount: courseClasses.length,
        lastUpdated
      };
    });

    setCourses(courseData);
    setFilteredCourses(courseData);

    // Calculate stats
    const totalCourses = courseData.length;
    const activeCourses = courseData.filter(c => c.status === 'active').length;
    const totalStudents = courseData.reduce((sum, c) => sum + c.enrolledStudents, 0);
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

    // Apply instructor filter
    if (filters.instructor) {
      result = result.filter(course => 
        course.instructorNames && course.instructorNames.includes(filters.instructor)
      );
    }

    // Apply risk filter
    if (filters.risk) {
      if (filters.risk === 'risk') {
        result = result.filter(course => (course.completionRate || 0) < 70);
      } else if (filters.risk === 'stable') {
        result = result.filter(course => (course.completionRate || 0) >= 70 && (course.completionRate || 0) < 85);
      } else if (filters.risk === 'good') {
        result = result.filter(course => (course.completionRate || 0) >= 85);
      }
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
                <h1 className="text-3xl font-bold text-gray-900">Hiệu suất Khóa học</h1>
                <p className="text-gray-600 mt-1">
                  Phân tích tổng quan khóa trong ngành - nhiều giảng viên, nhiều lớp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <CourseStats stats={stats} courses={courses} />

        {/* Filters */}
        <CourseFilters 
          onSearch={handleSearch}
          onFilterChange={handleFilterChange}
          courses={courses}
        />

        {/* Summary Chart */}
        <CourseSummaryChart courses={filteredCourses} />

        {/* Course List */}
        <CourseList courses={filteredCourses} allCourses={courses} />
      </div>

    </div>
  );
};

export default CourseManagement;

