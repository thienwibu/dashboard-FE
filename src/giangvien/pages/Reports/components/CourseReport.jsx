import { useState } from 'react';
import { BookOpen, TrendingUp, Users, Award, X, ChevronRight } from 'lucide-react';

const CourseReport = ({ courses }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  if (!courses || courses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Báo cáo khóa học</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Không có dữ liệu khóa học</p>
        </div>
      </div>
    );
  }

  const sortedCourses = [...courses].sort((a, b) => b.completionRate - a.completionRate);
  const totalEnrollments = courses.reduce((sum, c) => sum + c.enrolledStudents, 0);
  const avgCompletion = courses.reduce((sum, c) => sum + c.completionRate, 0) / courses.length;
  const avgScore = courses.reduce((sum, c) => sum + c.averageScore, 0) / courses.length;

  const getCompletionColor = (rate) => {
    if (rate >= 80) return { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50' };
    if (rate >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50' };
    return { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-50' };
  };

  const getScoreColor = (score) => {
    if (score >= 8.5) return 'text-green-600';
    if (score >= 7.0) return 'text-blue-600';
    if (score >= 6.0) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <BookOpen className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Báo cáo khóa học</h2>
          <p className="text-sm text-gray-600">So sánh hiệu suất các khóa học</p>
        </div>
      </div>

      {/* Overall Stats - Clickable */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <button 
          onClick={() => {
            setSelectedCourse({ type: 'all', data: courses });
            setShowDetailModal(true);
          }}
          className="bg-blue-50 rounded-lg p-4 text-center hover:bg-blue-100 transition-colors group"
        >
          <p className="text-sm text-blue-700 font-medium mb-2">Tổng khóa học</p>
          <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
          <div className="text-xs text-blue-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem danh sách →
          </div>
        </button>

        <button 
          onClick={() => {
            setSelectedCourse({ type: 'enrollment', data: courses });
            setShowDetailModal(true);
          }}
          className="bg-purple-50 rounded-lg p-4 text-center hover:bg-purple-100 transition-colors group"
        >
          <p className="text-sm text-purple-700 font-medium mb-2">Tổng ghi danh</p>
          <p className="text-3xl font-bold text-purple-600">{totalEnrollments}</p>
          <div className="text-xs text-purple-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem chi tiết →
          </div>
        </button>

        <button 
          onClick={() => {
            setSelectedCourse({ type: 'completion', data: courses });
            setShowDetailModal(true);
          }}
          className="bg-green-50 rounded-lg p-4 text-center hover:bg-green-100 transition-colors group"
        >
          <p className="text-sm text-green-700 font-medium mb-2">Hoàn thành TB</p>
          <p className="text-3xl font-bold text-green-600">{avgCompletion.toFixed(0)}%</p>
          <div className="text-xs text-green-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem phân tích →
          </div>
        </button>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Chi tiết khóa học</h3>
        
        {sortedCourses.map((course, index) => {
          const completionColors = getCompletionColor(course.completionRate);
          const scoreColor = getScoreColor(course.averageScore);
          
          return (
            <button
              key={index}
              onClick={() => {
                setSelectedCourse({ type: 'single', data: course });
                setShowDetailModal(true);
              }}
              className="w-full border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow text-left group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{course.name}</h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users size={14} />
                      {course.enrolledStudents} SV
                    </span>
                    <span>{course.duration}</span>
                  </div>
                </div>
                
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  course.status === 'active' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {course.status === 'active' ? 'Đang hoạt động' : 'Kết thúc'}
                </div>
              </div>

              {/* Completion Rate */}
              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600 flex items-center gap-1">
                    <TrendingUp size={14} />
                    Tỷ lệ hoàn thành
                  </span>
                  <span className={`font-semibold ${completionColors.text}`}>
                    {course.completionRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${completionColors.bg} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${course.completionRate}%` }}
                  />
                </div>
              </div>

              {/* Click hint */}
              <div className="mt-3 flex items-center text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Xem chi tiết khóa học</span>
                <ChevronRight className="h-3 w-3 ml-1" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Điểm trung bình toàn bộ khóa học</span>
          <span className="text-2xl font-bold text-blue-600">{avgScore.toFixed(1)}/10</span>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedCourse && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {selectedCourse.type === 'single' && `Chi tiết: ${selectedCourse.data.name}`}
                  {selectedCourse.type === 'all' && 'Danh sách tất cả khóa học'}
                  {selectedCourse.type === 'enrollment' && 'Phân tích ghi danh'}
                  {selectedCourse.type === 'completion' && 'Phân tích tỷ lệ hoàn thành'}
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Single Course Detail */}
              {selectedCourse.type === 'single' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{selectedCourse.data.name}</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Số sinh viên</div>
                        <div className="text-3xl font-bold text-blue-600">{selectedCourse.data.enrolledStudents}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Thời lượng</div>
                        <div className="text-3xl font-bold text-purple-600">{selectedCourse.data.duration}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Tỷ lệ hoàn thành</div>
                        <div className="text-3xl font-bold text-green-600">{selectedCourse.data.completionRate}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 mb-1">Điểm trung bình</div>
                        <div className="text-3xl font-bold text-orange-600">{selectedCourse.data.averageScore.toFixed(1)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="font-semibold text-gray-900 mb-3">Thông tin chi tiết</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Trạng thái:</span>
                        <span className={`font-medium ${selectedCourse.data.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                          {selectedCourse.data.status === 'active' ? 'Đang hoạt động' : 'Kết thúc'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mức độ hoàn thành:</span>
                        <span className={`font-medium ${
                          selectedCourse.data.completionRate >= 80 ? 'text-green-600' :
                          selectedCourse.data.completionRate >= 60 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {selectedCourse.data.completionRate >= 80 ? 'Tốt' :
                           selectedCourse.data.completionRate >= 60 ? 'Trung bình' : 'Cần cải thiện'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All Courses List */}
              {selectedCourse.type === 'all' && (
                <div className="space-y-3">
                  {selectedCourse.data.map((course, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-gray-900">{course.name}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          course.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {course.status === 'active' ? 'Đang hoạt động' : 'Kết thúc'}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Sinh viên</div>
                          <div className="font-bold text-gray-900">{course.enrolledStudents}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Hoàn thành</div>
                          <div className="font-bold text-green-600">{course.completionRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Điểm TB</div>
                          <div className="font-bold text-blue-600">{course.averageScore.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Thời lượng</div>
                          <div className="font-bold text-gray-900">{course.duration}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Enrollment Analysis */}
              {selectedCourse.type === 'enrollment' && (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-6 rounded-lg text-center">
                    <div className="text-5xl font-bold text-purple-600 mb-2">{totalEnrollments}</div>
                    <div className="text-gray-600">Tổng số sinh viên ghi danh</div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Phân bố theo khóa học:</h4>
                    {selectedCourse.data
                      .sort((a, b) => b.enrolledStudents - a.enrolledStudents)
                      .map((course, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900">{course.name}</div>
                            <div className="text-2xl font-bold text-purple-600">{course.enrolledStudents}</div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-purple-600 h-3 rounded-full"
                              style={{ width: `${(course.enrolledStudents / totalEnrollments) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {((course.enrolledStudents / totalEnrollments) * 100).toFixed(1)}% tổng số sinh viên
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Completion Analysis */}
              {selectedCourse.type === 'completion' && (
                <div className="space-y-4">
                  <div className="bg-green-50 p-6 rounded-lg text-center">
                    <div className="text-5xl font-bold text-green-600 mb-2">{avgCompletion.toFixed(1)}%</div>
                    <div className="text-gray-600">Tỷ lệ hoàn thành trung bình</div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Chi tiết theo khóa học:</h4>
                    {selectedCourse.data
                      .sort((a, b) => b.completionRate - a.completionRate)
                      .map((course, idx) => {
                        const colors = getCompletionColor(course.completionRate);
                        return (
                          <div key={idx} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-gray-900">{course.name}</div>
                              <div className={`text-2xl font-bold ${colors.text}`}>{course.completionRate}%</div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                              <div 
                                className={`${colors.bg} h-3 rounded-full`}
                                style={{ width: `${course.completionRate}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600">
                              {course.enrolledStudents} sinh viên • Điểm TB: {course.averageScore.toFixed(1)}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseReport;

