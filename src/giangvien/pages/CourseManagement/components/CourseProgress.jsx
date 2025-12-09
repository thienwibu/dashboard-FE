import { TrendingUp, Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const CourseProgress = ({ course }) => {
  const totalStudents = course?.enrolledStudents || 0;
  const completed = course?.completed || 0;
  const inProgress = course?.inProgress || 0;
  const notStarted = course?.notStarted || 0;

  // Tính toán tỷ lệ hoàn thành - CHỈ dựa vào số lượng sinh viên hoàn thành 100%
  const calculatedCompletionRate = totalStudents > 0 
    ? ((completed / totalStudents) * 100).toFixed(0)
    : 0;
  
  // Hiển thị tỷ lệ hoàn thành
  const displayCompletionRate = calculatedCompletionRate;

  const progressData = [
    {
      label: 'Đã hoàn thành khóa học',
      description: 'Sinh viên đã hoàn thành 100% nội dung',
      value: completed,
      total: totalStudents,
      icon: CheckCircle,
      color: 'green'
    },
    {
      label: 'Đang học',
      description: 'Sinh viên đang trong quá trình học (1-99%)',
      value: inProgress,
      total: totalStudents,
      icon: Clock,
      color: 'blue'
    },
    {
      label: 'Chưa bắt đầu',
      description: 'Sinh viên chưa bắt đầu học (0%)',
      value: notStarted,
      total: totalStudents,
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
                  <div>
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-gray-900">{item.value}</span>
                  <span className="text-sm text-gray-600"> / {item.total} SV</span>
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
        <div className={`rounded-lg p-4 ${
          displayCompletionRate < 90 ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-lg font-semibold text-gray-900">Tỷ lệ hoàn thành trung bình</div>
              <div className="text-xs text-gray-600 mt-1">
                Trung bình tiến độ học tập của tất cả sinh viên trong khóa
              </div>
            </div>
            <span className={`text-4xl font-bold ${
              displayCompletionRate < 90 ? 'text-red-600' : 'text-green-600'
            }`}>
              {displayCompletionRate}%
            </span>
          </div>
          <div className="text-xs text-gray-600 mt-3 bg-white rounded p-2">
            <strong>Cách tính:</strong> Tỷ lệ này được tính dựa trên số lượng sinh viên đã hoàn thành 100% khóa học.<br/>
            <strong>Ví dụ với khóa này:</strong> {completed} SV hoàn thành / {totalStudents} SV tổng = <strong>{calculatedCompletionRate}%</strong><br/>
            <em>Lưu ý: Chỉ tính sinh viên hoàn thành 100%, không tính sinh viên đang học.</em>
          </div>
        </div>

        {/* Warning Alert */}
        {displayCompletionRate < 90 && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-500 p-4 rounded">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-red-800 mb-1">
                  ⚠️ CẢNH BÁO: Tỷ lệ hoàn thành chưa đạt mục tiêu!
                </h4>
                <p className="text-sm text-red-700 mb-2">
                  Chỉ có <strong>{completed}/{totalStudents} sinh viên ({displayCompletionRate}%)</strong> hoàn thành khóa học. 
                  Tỷ lệ này thấp hơn mục tiêu (90%).
                </p>
                <div className="text-xs text-red-600 bg-white rounded p-2 mt-2">
                  <strong>Đề xuất hành động:</strong>
                  <ul className="list-disc ml-4 mt-1 space-y-1">
                    <li>Liên hệ và nhắc nhở {inProgress + notStarted} sinh viên chưa hoàn thành</li>
                    <li>Kiểm tra nguyên nhân: Nội dung khó? Thiếu động lực? Vấn đề cá nhân?</li>
                    <li>Tổ chức buổi hỗ trợ/tư vấn cho sinh viên đang gặp khó khăn</li>
                    <li>Xem xét điều chỉnh deadline hoặc nội dung khóa học nếu cần</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success message */}
        {displayCompletionRate >= 90 && (
          <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-semibold text-green-800 mb-1">
                  ✅ XUẤT SẮC: Tỷ lệ hoàn thành cao!
                </h4>
                <p className="text-sm text-green-700">
                  Có <strong>{completed}/{totalStudents} sinh viên ({displayCompletionRate}%)</strong> đã hoàn thành khóa học. 
                  Đây là kết quả xuất sắc! {inProgress + notStarted > 0 ? `Tiếp tục hỗ trợ ${inProgress + notStarted} sinh viên còn lại.` : 'Tất cả sinh viên đã hoàn thành!'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseProgress;

