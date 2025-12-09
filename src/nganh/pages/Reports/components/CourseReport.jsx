import { BookOpen, TrendingUp, Users, Award } from 'lucide-react';

const CourseReport = ({ courses }) => {
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

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-700 font-medium mb-2">Tổng khóa học</p>
          <p className="text-3xl font-bold text-blue-600">{courses.length}</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <p className="text-sm text-purple-700 font-medium mb-2">Tổng ghi danh</p>
          <p className="text-3xl font-bold text-purple-600">{totalEnrollments}</p>
        </div>

        <div className="bg-green-50 rounded-lg p-4 text-center">
          <p className="text-sm text-green-700 font-medium mb-2">Hoàn thành TB</p>
          <p className="text-3xl font-bold text-green-600">{avgCompletion.toFixed(0)}%</p>
        </div>
      </div>

      {/* Course List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Chi tiết khóa học</h3>
        
        {sortedCourses.map((course, index) => {
          const completionColors = getCompletionColor(course.completionRate);
          const scoreColor = getScoreColor(course.averageScore);
          
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
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

              <div className="grid grid-cols-2 gap-4">
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

                {/* Average Score */}
                <div className={`${completionColors.light} rounded-lg p-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                      <Award size={14} />
                      Điểm TB
                    </span>
                    <span className={`text-xl font-bold ${scoreColor}`}>
                      {course.averageScore.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default CourseReport;

