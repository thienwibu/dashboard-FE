import React from 'react';
import { Lightbulb, TrendingUp, AlertTriangle, CheckCircle, Target, BarChart3 } from 'lucide-react';

const InsightsPanel = ({ stats, courses = [] }) => {
  const insights = [
    {
      type: 'positive',
      icon: TrendingUp,
      title: 'Xu hướng tích cực',
      message: 'Tỷ lệ hoàn thành ngành tăng 3.2% so với tháng trước, cho thấy cải thiện đáng kể.',
      color: 'green'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Cần chú ý',
      message: `${stats?.atRiskCourses || 0} khóa học có tiến độ dưới 70% cần được hỗ trợ và theo dõi sát.`,
      color: 'amber'
    },
    {
      type: 'info',
      icon: Target,
      title: 'Mục tiêu',
      message: `Điểm trung bình toàn ngành đạt ${stats?.averageScore?.toFixed(1) || '0.0'}/10, đang tiến gần mục tiêu 8.0/10.`,
      color: 'blue'
    },
    {
      type: 'achievement',
      icon: CheckCircle,
      title: 'Thành tích',
      message: `${stats?.totalStudents || 0} sinh viên đang theo học với ${stats?.totalTeachers || 0} giảng viên, tỷ lệ 1:${Math.round((stats?.totalStudents || 0) / (stats?.totalTeachers || 1))} khá tốt.`,
      color: 'purple'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', text: 'text-green-700' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-600', text: 'text-amber-700' },
      blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', text: 'text-blue-700' },
      purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', text: 'text-purple-700' }
    };
    return colors[color] || colors.blue;
  };

  // Key Metrics Summary
  const topPerformingCourse = courses.sort((a, b) => (b.completionRate || 0) - (a.completionRate || 0))[0];
  const lowPerformingCourse = courses.sort((a, b) => (a.completionRate || 0) - (b.completionRate || 0))[0];

  return (
    <div className="space-y-6">
      {/* Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Lightbulb className="text-yellow-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Insights & Nhận Định</h3>
            <p className="text-sm text-gray-600">Phân tích tự động và đề xuất</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            const colors = getColorClasses(insight.color);
            
            return (
              <div
                key={index}
                className={`${colors.bg} ${colors.border} border rounded-lg p-4`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`${colors.icon} flex-shrink-0 mt-0.5`} size={20} />
                  <div>
                    <h4 className={`font-semibold ${colors.text} mb-1`}>{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <BarChart3 className="text-blue-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chỉ Số Quan Trọng</h3>
            <p className="text-sm text-gray-600">Các metric nổi bật cần theo dõi</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topPerformingCourse && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="text-green-600" size={18} />
                <span className="text-sm font-semibold text-green-700">Khóa học tốt nhất</span>
              </div>
              <p className="text-lg font-bold text-green-900 mb-1">{topPerformingCourse.name}</p>
              <p className="text-sm text-green-700">
                Hoàn thành: <span className="font-semibold">{topPerformingCourse.completionRate || 0}%</span> | 
                Điểm TB: <span className="font-semibold">{topPerformingCourse.averageScore?.toFixed(1) || '0.0'}/10</span>
              </p>
            </div>
          )}

          {lowPerformingCourse && lowPerformingCourse.completionRate < 70 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="text-red-600" size={18} />
                <span className="text-sm font-semibold text-red-700">Cần hỗ trợ</span>
              </div>
              <p className="text-lg font-bold text-red-900 mb-1">{lowPerformingCourse.name}</p>
              <p className="text-sm text-red-700">
                Hoàn thành: <span className="font-semibold">{lowPerformingCourse.completionRate || 0}%</span> | 
                Điểm TB: <span className="font-semibold">{lowPerformingCourse.averageScore?.toFixed(1) || '0.0'}/10</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;

