import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CourseDetailHeader from './components/CourseDetailHeader';
import CourseProgress from './components/CourseProgress';
import CourseClasses from './components/CourseClasses';
import EditCourseModal from './components/EditCourseModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { mockDashboardData, mockClassData } from '../../data/mockData';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    // Find course from mockData
    const courseData = mockDashboardData.courseMonitoring.find(
      c => c.name.toLowerCase().replace(/\s+/g, '-') === id
    );

    if (courseData) {
      // Get progress data
      const progressData = mockDashboardData.progressOverview.all.find(
        p => p.course === courseData.name
      );

      // Map course ID to find matching classes
      const courseIdMap = {
        'nhập-môn-lập-trình': 'intro-prog',
        'kĩ-thuật-lập-trình': 'prog-technique',
        'lập-trình-hướng-đối-tượng': 'oop',
        'cấu-trúc-dữ-liệu-và-giải-thuật': 'data-struct-algo'
      };

      const courseId = courseIdMap[id];

      // Get classes for this course
      const courseClasses = mockClassData.classes.filter(
        cls => cls.courseId === courseId
      );

      setCourse({
        id,
        name: courseData.name,
        enrolledStudents: courseData.enrolledStudents,
        duration: courseData.duration,
        status: courseData.status,
        completionRate: courseData.completionRate,
        averageScore: courseData.averageScore,
        completed: progressData?.completed || 0,
        inProgress: progressData?.inProgress || 0,
        notStarted: progressData?.notStarted || 0
      });

      setClasses(courseClasses);
    }

    setLoading(false);
  }, [id]);

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (courseData) => {
    console.log('Cập nhật khóa học:', courseData);
    alert('Đã cập nhật khóa học: ' + courseData.name);
    // In real app, call API to update course
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    console.log('Xóa khóa học:', course?.name);
    alert('Đã xóa khóa học: ' + course?.name);
    // In real app, call API to delete course then redirect
    navigate('/courses');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy khóa học</h2>
          <p className="text-gray-600 mb-4">Khóa học bạn đang tìm kiếm không tồn tại</p>
          <a
            href="#/courses"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Quay lại danh sách
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CourseDetailHeader 
        course={course} 
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Progress */}
          <div className="lg:col-span-1">
            <CourseProgress course={course} />
          </div>

          {/* Right Column - Classes */}
          <div className="lg:col-span-2">
            <CourseClasses classes={classes} />
          </div>
        </div>
      </div>

      {/* Edit Course Modal */}
      <EditCourseModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveEdit}
        course={course}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        courseName={course?.name}
      />
    </div>
  );
};

export default CourseDetail;

