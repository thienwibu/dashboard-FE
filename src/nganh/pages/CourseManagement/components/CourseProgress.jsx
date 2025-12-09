import { TrendingUp, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const CourseProgress = ({ course }) => {
  const progressData = [
    {
      label: 'Đã hoàn thành',
      value: course?.completed || 0,
      total: course?.enrolledStudents || 0,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Đang học',
      value: course?.inProgress || 0,
      total: course?.enrolledStudents || 0,
      icon: Clock,
      color: 'blue'
    },
    {
      label: 'Chưa bắt đầu',
      value: course?.notStarted || 0,
      total: course?.enrolledStudents || 0,
      icon: AlertCircle,
      color: 'gray'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', bar: 'bg-blue-500' },
      gray: { bg: 'bg-gray-50', text: 'text-gray-600', bar: 'bg-gray-400' }
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <TrendingUp className="text-blue-600" size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Tiến độ học tập</h2>
          <p className="text-sm text-gray-600">Tổng quan về tiến độ sinh viên</p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-6">
        {progressData.map((item, index) => {
          const Icon = item.icon;
          const colors = getColorClasses(item.color);
          const percentage = item.total > 0 ? (item.value / item.total) * 100 : 0;

          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${colors.bg} rounded-lg`}>
                    <Icon className={colors.text} size={20} />
                  </div>
                  <span className="font-medium text-gray-900">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  <span className="text-sm text-gray-600"> / {item.total}</span>
                  <span className="ml-2 text-sm font-medium text-gray-600">
                    ({percentage.toFixed(0)}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className={`${colors.bar} h-full rounded-full transition-all duration-500`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Overall Completion */}
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Tổng tỷ lệ hoàn thành</span>
          <span className="text-3xl font-bold text-blue-600">
            {course?.completionRate || 0}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;

