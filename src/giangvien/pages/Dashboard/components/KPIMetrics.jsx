import { useState } from 'react';
import { TrendingUp, TrendingDown, Users, BookOpen, Award, AlertTriangle, X, ChevronRight } from 'lucide-react';
import { mockStudentTrackingData } from '../../../data/mockData';

const KPIMetrics = ({ data }) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  if (!data) return null;

  const metrics = [
    {
      id: 'totalStudents',
      title: 'Tổng Sinh Viên',
      value: data.totalStudents,
      change: data.studentChange,
      changeType: data.studentChange > 0 ? 'increase' : 'decrease',
      icon: Users,
      color: 'primary',
      description: 'Tổng số sinh viên đang theo học các khóa học của bạn'
    },
    {
      id: 'activeCourses',
      title: 'Khóa Học Đang Diễn Ra',
      value: data.activeCourses,
      change: data.courseChange,
      changeType: data.courseChange > 0 ? 'increase' : 'decrease',
      icon: BookOpen,
      color: 'success',
      description: 'Số lượng khóa học đang được giảng dạy'
    },
    {
      id: 'averageCompletion',
      title: 'Tỷ Lệ Hoàn Thành Trung Bình',
      value: `${data.averageCompletion}%`,
      change: data.completionChange,
      changeType: data.completionChange > 0 ? 'increase' : 'decrease',
      icon: Award,
      color: 'warning',
      description: 'Tỷ lệ hoàn thành trung bình của tất cả sinh viên'
    },
    {
      id: 'atRiskStudents',
      title: 'Sinh Viên Có Nguy Cơ',
      value: data.atRiskStudents,
      change: data.riskChange,
      changeType: data.riskChange > 0 ? 'increase' : 'decrease',
      icon: AlertTriangle,
      color: 'danger',
      description: 'Sinh viên có nguy cơ bỏ học hoặc không đạt yêu cầu'
    }
  ];

  const getDetailData = (metricId) => {
    const students = mockStudentTrackingData?.students || [];
    
    switch (metricId) {
      case 'totalStudents':
        return students;
      case 'atRiskStudents':
        return students.filter(s => s.status === 'at_risk');
      case 'activeCourses':
        // Trả về danh sách khóa học thay vì sinh viên
        return [];
      case 'averageCompletion':
        return students.sort((a, b) => b.completionRate - a.completionRate);
      default:
        return students;
    }
  };

  const getActiveCourses = () => {
    // Lấy danh sách tất cả các khóa học từ sinh viên (gộp chung các lớp)
    const students = mockStudentTrackingData?.students || [];
    const coursesMap = new Map();
    
    students.forEach(student => {
      student.courses?.forEach(course => {
        if (!coursesMap.has(course.name)) {
          coursesMap.set(course.name, {
            name: course.name,
            classes: new Map(), // Lưu thông tin từng lớp
            totalStudents: 0,
            totalCompletionRate: 0,
            totalScore: 0,
            totalCount: 0
          });
        }
        const courseData = coursesMap.get(course.name);
        
        // Thêm thông tin lớp
        if (!courseData.classes.has(course.className)) {
          courseData.classes.set(course.className, {
            className: course.className,
            students: [],
            totalCompletionRate: 0,
            totalScore: 0
          });
        }
        const classData = courseData.classes.get(course.className);
        classData.students.push(student);
        classData.totalCompletionRate += student.completionRate; // Dùng completionRate của sinh viên
        classData.totalScore += course.score;
        
        // Cập nhật tổng
        courseData.totalStudents++;
        courseData.totalCompletionRate += student.completionRate; // Dùng completionRate của sinh viên
        courseData.totalScore += course.score;
        courseData.totalCount++;
      });
    });
    
    // Chuyển Map thành array và tính trung bình
    return Array.from(coursesMap.values()).map(course => ({
      name: course.name,
      studentCount: course.totalStudents,
      avgProgress: Math.round(course.totalCompletionRate / course.totalCount),
      avgScore: (course.totalScore / course.totalCount).toFixed(1),
      classes: Array.from(course.classes.values()).map(cls => ({
        className: cls.className,
        studentCount: cls.students.length,
        avgProgress: Math.round(cls.totalCompletionRate / cls.students.length),
        avgScore: (cls.totalScore / cls.students.length).toFixed(1)
      }))
    }));
  };

  const handleMetricClick = (metric) => {
    setSelectedMetric(metric);
    setSelectedCourse(null);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-50 text-primary-600',
      success: 'bg-success-50 text-success-600',
      warning: 'bg-warning-50 text-warning-600',
      danger: 'bg-danger-50 text-danger-600'
    };
    return colors[color] || colors.primary;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <button
            key={index}
            onClick={() => handleMetricClick(metric)}
            className="card p-6 hover:shadow-medium transition-all duration-200 text-left group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                
                <div 
                  className="flex items-center mt-2 px-2 py-1 bg-gray-50 rounded"
                  title={`${metric.changeType === 'increase' ? 'Tăng' : 'Giảm'} ${Math.abs(metric.change)}% so với tháng trước`}
                >
                  {metric.changeType === 'increase' ? (
                    <TrendingUp className="h-4 w-4 text-success-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-danger-600 mr-1" />
                  )}
                  <span className={`text-sm font-semibold ${
                    metric.changeType === 'increase' ? 'text-success-600' : 'text-danger-600'
                  }`}>
                    {metric.changeType === 'increase' ? '+' : ''}{metric.change}%
                  </span>
                  <span className="text-xs text-gray-600 ml-1.5">vs tháng trước</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                  <metric.icon className="h-6 w-6" />
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal chi tiết */}
      {showModal && selectedMetric && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${getColorClasses(selectedMetric.color)}`}>
                  <selectedMetric.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedMetric.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedMetric.description}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
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
                  <p className="text-2xl font-bold text-gray-900 mt-1">{selectedMetric.value}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Thay đổi so với tháng trước</p>
                  <div className="flex items-center">
                    {selectedMetric.changeType === 'increase' ? (
                      <TrendingUp className="h-5 w-5 text-success-600 mr-2" />
                    ) : selectedMetric.change === 0 ? (
                      <div className="h-5 w-5 mr-2"></div>
                    ) : (
                      <TrendingDown className="h-5 w-5 text-danger-600 mr-2" />
                    )}
                    <div>
                      <span className={`text-2xl font-bold ${
                        selectedMetric.changeType === 'increase' ? 'text-success-600' : 
                        selectedMetric.change === 0 ? 'text-gray-900' : 'text-danger-600'
                      }`}>
                        {selectedMetric.change === 0 ? '0' : `${selectedMetric.change > 0 ? '+' : ''}${selectedMetric.change}`}%
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {selectedMetric.changeType === 'increase' ? 'Tăng' : selectedMetric.change === 0 ? 'Không đổi' : 'Giảm'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {selectedMetric.id === 'activeCourses' ? 'Tổng sinh viên' : 'Số lượng'}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {selectedMetric.id === 'activeCourses' 
                      ? data?.totalStudents || 10  // Hiển thị tổng sinh viên thực tế
                      : getDetailData(selectedMetric.id).length
                    }
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedMetric.id === 'totalStudents' && 'Tổng số sinh viên'}
                    {selectedMetric.id === 'activeCourses' && `Học ${getDetailData(selectedMetric.id).length} khóa học`}
                    {selectedMetric.id === 'atRiskStudents' && 'Sinh viên có nguy cơ'}
                    {selectedMetric.id === 'averageCompletion' && 'Sinh viên'}
                  </p>
                </div>
              </div>

              {/* Danh sách khóa học hoặc sinh viên */}
              <div>
                {selectedMetric.id === 'activeCourses' ? (
                  selectedCourse ? (
                    // Hiển thị chi tiết các lớp của khóa học
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">
                          Chi tiết các lớp - {selectedCourse.name}
                        </h4>
                        <button
                          onClick={() => setSelectedCourse(null)}
                          className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                          ← Quay lại danh sách khóa học
                        </button>
                      </div>
                      <div className="space-y-3">
                        {selectedCourse.classes.map((classInfo, index) => (
                          <div 
                            key={index}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                  <span className="text-primary-600 font-semibold">{index + 1}</span>
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">Lớp {classInfo.className}</p>
                                  <p className="text-sm text-gray-600">{selectedCourse.name}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6">
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Sinh viên</p>
                                  <p className="text-lg font-bold text-gray-900">{classInfo.studentCount}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Tiến độ TB</p>
                                  <p className="text-lg font-bold text-gray-900">{classInfo.avgProgress}%</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Điểm TB</p>
                                  <p className="text-lg font-bold text-gray-900">{classInfo.avgScore}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    // Hiển thị danh sách khóa học
                    <>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Danh sách khóa học đang diễn ra
                      </h4>
                      <div className="space-y-3">
                        {getActiveCourses().map((course, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedCourse(course)}
                            className="w-full border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 flex-1">
                                <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                                  <BookOpen className="h-5 w-5 text-success-600" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{course.name}</p>
                                  <p className="text-sm text-gray-600">{course.classes.length} lớp học</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-6">
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Sinh viên</p>
                                  <p className="text-lg font-bold text-gray-900">{course.studentCount}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Tiến độ TB</p>
                                  <p className="text-lg font-bold text-gray-900">{course.avgProgress}%</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Điểm TB</p>
                                  <p className="text-lg font-bold text-gray-900">{course.avgScore}</p>
                                </div>
                                <ChevronRight className="h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )
                ) : (
                  // Hiển thị danh sách sinh viên cho các metric khác
                  <>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Danh sách sinh viên
                    </h4>
                    <div className="space-y-4">
                      {getDetailData(selectedMetric.id).map((student, index) => {
                        // Lọc các môn học có vấn đề (điểm < 6.5 hoặc tiến độ < 70%)
                        const problematicCourses = student.courses?.filter(course => 
                          course.score < 6.5 || course.progress < 70
                        ) || [];

                        return (
                          <div 
                            key={student.id}
                            className="border border-gray-200 rounded-lg overflow-hidden"
                          >
                            {/* Thông tin sinh viên */}
                            <div className="flex items-center justify-between p-4 bg-gray-50">
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
                                  <p className="text-sm text-gray-600">Điểm TB</p>
                                  <p className="text-lg font-bold text-gray-900">{student.averageScore.toFixed(1)}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm text-gray-600">Hoàn thành</p>
                                  <p className="text-lg font-bold text-gray-900">{student.completionRate}%</p>
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

                            {/* Các môn học có vấn đề - chỉ hiển thị cho sinh viên có nguy cơ */}
                            {selectedMetric.id === 'atRiskStudents' && problematicCourses.length > 0 && (
                              <div className="p-4 bg-white border-t border-gray-200">
                                <p className="text-sm font-medium text-danger-600 mb-3">
                                  ⚠️ Môn học cần chú ý ({problematicCourses.length})
                                </p>
                                <div className="space-y-2">
                                  {problematicCourses.map((course, idx) => (
                                    <div 
                                      key={idx}
                                      className="flex items-center justify-between p-3 bg-danger-50 rounded-lg"
                                    >
                                      <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{course.name}</p>
                                        <p className="text-xs text-gray-600">{course.className}</p>
                                      </div>
                                      <div className="flex items-center space-x-4">
                                        {course.score < 6.5 && (
                                          <div className="text-right">
                                            <p className="text-xs text-gray-600">Điểm</p>
                                            <p className="text-sm font-bold text-danger-600">
                                              {course.score.toFixed(1)}
                                            </p>
                                          </div>
                                        )}
                                        {course.progress < 70 && (
                                          <div className="text-right">
                                            <p className="text-xs text-gray-600">Tiến độ</p>
                                            <p className="text-sm font-bold text-warning-600">
                                              {course.progress}%
                                            </p>
                                          </div>
                                        )}
                                        <div className="flex flex-col space-y-1">
                                          {course.score < 6.5 && (
                                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-danger-100 text-danger-700">
                                              Điểm thấp
                                            </span>
                                          )}
                                          {course.progress < 70 && (
                                            <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded bg-warning-100 text-warning-700">
                                              Chậm tiến độ
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleCloseModal}
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

export default KPIMetrics;