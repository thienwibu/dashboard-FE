import { useState } from 'react';
import { TrendingUp, TrendingDown, BookOpen, Users, Activity, X, ChevronRight } from 'lucide-react';
import { mockDashboardData } from '../../../data/mockData';

const CourseStats = ({ stats }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStat, setSelectedStat] = useState(null);
  const [showCourseDetail, setShowCourseDetail] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const statCards = [
    {
      id: 'totalCourses',
      title: 'Tổng khóa học',
      value: stats?.totalCourses || 0,
      change: stats?.courseChange || 0,
      icon: BookOpen,
      color: 'blue',
      description: 'Tổng số khóa học đang quản lý'
    },
    {
      id: 'activeCourses',
      title: 'Khóa đang hoạt động',
      value: stats?.activeCourses || 0,
      change: stats?.activeChange || 0,
      icon: Activity,
      color: 'green',
      description: 'Khóa học đang được giảng dạy'
    },
    {
      id: 'totalStudents',
      title: 'Tổng sinh viên',
      value: stats?.totalStudents || 0,
      change: stats?.studentChange || 0,
      icon: Users,
      color: 'purple',
      description: 'Tổng số sinh viên đang theo học'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      yellow: 'bg-yellow-50 text-yellow-600'
    };
    return colors[color] || colors.blue;
  };

  const renderChangeIndicator = (change) => {
    if (change === 0) {
      return (
        <div className="flex items-center gap-1 text-sm font-medium text-gray-500 px-2 py-1 bg-gray-50 rounded">
          <span>0%</span>
          <span className="text-xs">vs tháng trước</span>
        </div>
      );
    }

    const isPositive = change > 0;
    return (
      <div 
        className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded ${
          isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
        }`}
        title={`${isPositive ? 'Tăng' : 'Giảm'} ${Math.abs(change)}% so với tháng trước`}
      >
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{change > 0 ? '+' : ''}{change}%</span>
        <span className="text-xs opacity-75 ml-1">vs tháng trước</span>
      </div>
    );
  };

  const handleStatClick = (stat) => {
    setSelectedStat(stat);
    setShowModal(true);
  };

  const getDetailData = (statId) => {
    const courses = mockDashboardData?.courseMonitoring || [];
    
    switch (statId) {
      case 'totalCourses':
        return courses;
      case 'activeCourses':
        return courses.filter(c => c.status === 'active');
      case 'totalStudents':
        return courses.sort((a, b) => b.enrolledStudents - a.enrolledStudents);
      default:
        return courses;
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'bg-success-100 text-success-700', text: 'Đang hoạt động' },
      upcoming: { class: 'bg-primary-100 text-primary-700', text: 'Sắp diễn ra' },
      completed: { class: 'bg-gray-100 text-gray-700', text: 'Hoàn thành' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setShowCourseDetail(true);
  };

  const getStudentsInCourse = (courseName) => {
    // Giả lập dữ liệu sinh viên trong khóa học
    const allStudents = [
      { id: 1, name: 'Vũ Đức Thành', studentId: '122000005', email: 'thanh.vd@student.edu.vn', progress: 98, score: 9.2, status: 'active' },
      { id: 2, name: 'Nguyễn Văn Minh', studentId: '122000001', email: 'minh.nv@student.edu.vn', progress: 95, score: 8.9, status: 'active' },
      { id: 3, name: 'Trần Thị Hương', studentId: '122000002', email: 'huong.tt@student.edu.vn', progress: 88, score: 8.2, status: 'active' },
      { id: 4, name: 'Phạm Thị Lan', studentId: '122000004', email: 'lan.pt@student.edu.vn', progress: 82, score: 7.8, status: 'active' },
      { id: 5, name: 'Bùi Thị Ngọc', studentId: '122000008', email: 'ngoc.bt@student.edu.vn', progress: 86, score: 8.4, status: 'active' },
      { id: 6, name: 'Đặng Văn Hùng', studentId: '122000007', email: 'hung.dv@student.edu.vn', progress: 75, score: 7.2, status: 'active' },
      { id: 7, name: 'Lê Hoàng Nam', studentId: '122000003', email: 'nam.lh@student.edu.vn', progress: 48, score: 6.2, status: 'at_risk' },
      { id: 8, name: 'Lý Minh Tuấn', studentId: '122000009', email: 'tuan.lm@student.edu.vn', progress: 42, score: 5.8, status: 'at_risk' },
      { id: 9, name: 'Hoàng Thị Mai', studentId: '122000006', email: 'mai.ht@student.edu.vn', progress: 100, score: 9.3, status: 'completed' },
      { id: 10, name: 'Ngô Thị Thu', studentId: '122000010', email: 'thu.nt@student.edu.vn', progress: 94, score: 8.7, status: 'active' }
    ];
    return allStudents;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <button
              key={index}
              onClick={() => handleStatClick(stat)}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all text-left group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon size={24} />
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {renderChangeIndicator(stat.change)}
                  <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                {stat.suffix && (
                  <span className="text-lg text-gray-500">{stat.suffix}</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedStat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(selectedStat.color)}`}>
                  <selectedStat.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedStat.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedStat.description}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Giá trị hiện tại</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedStat.value}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Thay đổi so với tháng trước</p>
                  <div className="flex items-center">
                    {selectedStat.change > 0 ? (
                      <TrendingUp className="h-5 w-5 text-success-600 mr-2" />
                    ) : selectedStat.change < 0 ? (
                      <TrendingDown className="h-5 w-5 text-danger-600 mr-2" />
                    ) : (
                      <div className="h-5 w-5 mr-2"></div>
                    )}
                    <div>
                      <span className={`text-2xl font-bold ${
                        selectedStat.change > 0 ? 'text-success-600' : selectedStat.change < 0 ? 'text-danger-600' : 'text-gray-900'
                      }`}>
                        {selectedStat.change === 0 ? '0' : `${selectedStat.change > 0 ? '+' : ''}${selectedStat.change}`}%
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedStat.change > 0 ? 'Tăng' : selectedStat.change < 0 ? 'Giảm' : 'Không đổi'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {selectedStat.id === 'activeCourses' || selectedStat.id === 'totalCourses' ? 'Tổng sinh viên' : 'Số lượng'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedStat.id === 'activeCourses' || selectedStat.id === 'totalCourses'
                      ? stats?.totalStudents || 10  // Hiển thị tổng sinh viên thực tế
                      : selectedStat.id === 'totalStudents' 
                        ? stats?.totalStudents || 10  // Tổng sinh viên thực tế, không phải tổng enrolledStudents
                        : getDetailData(selectedStat.id).length
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedStat.id === 'activeCourses' || selectedStat.id === 'totalCourses'
                      ? `Học ${getDetailData(selectedStat.id).length} khóa học`
                      : selectedStat.id === 'totalStudents' 
                        ? `Trong ${getDetailData(selectedStat.id).length} khóa học`
                        : `${getDetailData(selectedStat.id).length} khóa học`
                    }
                  </p>
                </div>
              </div>

              {/* Danh sách khóa học */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách khóa học
                </h4>
                <div className="space-y-3">
                  {getDetailData(selectedStat.id).map((course, index) => (
                    <button
                      key={index}
                      onClick={() => handleCourseClick(course)}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-primary-50 hover:border-primary-200 border border-transparent transition-all cursor-pointer text-left"
                      title="Click để xem chi tiết khóa học"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{course.name}</p>
                          <p className="text-sm text-gray-600">{course.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Sinh viên</p>
                          <p className="text-lg font-bold text-gray-900">{course.enrolledStudents}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Điểm TB</p>
                          <p className="text-lg font-bold text-gray-900">{course.averageScore.toFixed(1)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Hoàn thành</p>
                          <p className="text-lg font-bold text-gray-900">{course.completionRate}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(course.status).class}`}>
                            {getStatusBadge(course.status).text}
                          </span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    💡 <strong>Mẹo:</strong> Click vào bất kỳ khóa học nào để xem danh sách sinh viên và thông tin chi tiết
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết khóa học */}
      {showCourseDetail && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedCourse.name}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-2">
                  <div className="flex items-center space-x-1">
                    <Users size={16} />
                    <span>{selectedCourse.enrolledStudents} sinh viên</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Activity size={16} />
                    <span>{selectedCourse.duration}</span>
                  </div>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedCourse.status).class}`}>
                    {getStatusBadge(selectedCourse.status).text}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowCourseDetail(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="mb-6 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tiến độ hoàn thành</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedCourse.completionRate}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Điểm trung bình</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedCourse.averageScore.toFixed(1)}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tổng sinh viên</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedCourse.enrolledStudents}</p>
                </div>
              </div>

              {/* Danh sách sinh viên */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Danh sách sinh viên trong khóa học
                </h4>
                <div className="space-y-3">
                  {getStudentsInCourse(selectedCourse.name).map((student, index) => (
                    <div 
                      key={student.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-600">{student.studentId} • {student.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Tiến độ</p>
                          <p className="text-lg font-bold text-gray-900">{student.progress}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Điểm</p>
                          <p className="text-lg font-bold text-gray-900">{student.score.toFixed(1)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Trạng thái</p>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            student.status === 'active' 
                              ? 'bg-success-100 text-success-700'
                              : student.status === 'at_risk'
                              ? 'bg-danger-100 text-danger-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {student.status === 'active' ? 'Đang học' : student.status === 'at_risk' ? 'Có nguy cơ' : 'Hoàn thành'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowCourseDetail(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseStats;
