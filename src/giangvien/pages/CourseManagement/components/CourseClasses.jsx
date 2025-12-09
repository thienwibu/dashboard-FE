import { Users, Award, TrendingUp, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CourseClasses = ({ classes }) => {
  const [teacherName, setTeacherName] = useState('');

  useEffect(() => {
    // Lấy tên giảng viên từ sessionStorage (đã lưu khi đăng nhập)
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setTeacherName(user?.full_name || 'Giảng viên');
    }
  }, []);

  const getCompletionColor = (rate) => {
    if (rate >= 80) return { bg: 'bg-green-100', text: 'text-green-700', bar: 'bg-green-500' };
    if (rate >= 60) return { bg: 'bg-yellow-100', text: 'text-yellow-700', bar: 'bg-yellow-500' };
    return { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' };
  };

  if (!classes || classes.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-gray-400 mb-3">
          <Users size={48} className="mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Chưa có lớp học</h3>
        <p className="text-gray-600">Khóa học này chưa có lớp học nào</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Danh sách lớp học</h2>
          <p className="text-sm text-gray-600 mt-1">{classes.length} lớp đang hoạt động</p>
        </div>
      </div>

      <div className="space-y-4">
        {classes.map((cls, index) => {
          const colors = getCompletionColor(cls.completionRate);
          
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {cls.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Giảng viên: {teacherName}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.text}`}>
                      {cls.status === 'active' ? 'Đang học' : cls.status}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600 flex items-center gap-2">
                        <TrendingUp size={16} />
                        Tiến độ hoàn thành
                      </span>
                      <span className="font-semibold text-gray-900">
                        {cls.completionRate}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`${colors.bar} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${cls.completionRate}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <Link
                  to={`/classes/${cls.id}`}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-700 hover:text-blue-600 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  <span>Xem chi tiết</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseClasses;

