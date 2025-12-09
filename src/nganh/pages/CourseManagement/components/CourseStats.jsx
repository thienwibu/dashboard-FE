import React from 'react';
import { TrendingUp, TrendingDown, BookOpen, Users, Award, Activity, AlertTriangle, UserCheck } from 'lucide-react';

const CourseStats = ({ stats, courses = [] }) => {
  // Tính toán các chỉ số tổng hợp cấp ngành
  const avgCompletionAllCourses = courses.length > 0
    ? Math.round(courses.reduce((sum, c) => sum + (c.completionRate || 0), 0) / courses.length)
    : 0;
  
  const riskCoursesCount = courses.filter(c => (c.completionRate || 0) < 70).length;
  
  // Tính xu hướng ngành (so với tháng trước - mock data)
  const industryTrend = 3.5; // +3.5% so với tháng trước
  
  // Tìm giảng viên phụ trách nhiều nhất
  const instructorCourseCount = {};
  courses.forEach(course => {
    if (course.instructorNames && course.instructorNames.length > 0) {
      course.instructorNames.forEach(instructor => {
        instructorCourseCount[instructor] = (instructorCourseCount[instructor] || 0) + 1;
      });
    }
  });
  const topInstructor = Object.entries(instructorCourseCount).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

  const statCards = [
    {
      title: 'Hiệu suất trung bình toàn ngành',
      value: `${avgCompletionAllCourses}%`,
      subtitle: '% hoàn thành trung bình của tất cả khóa',
      icon: TrendingUp,
      color: 'blue'
    },
    {
      title: 'Khóa có rủi ro',
      value: riskCoursesCount,
      subtitle: 'số khóa có tiến độ <70%',
      icon: AlertTriangle,
      color: 'red'
    },
    {
      title: 'Xu hướng ngành',
      value: industryTrend > 0 ? `+${industryTrend}` : `${industryTrend}`,
      subtitle: '% so với tháng trước',
      icon: Activity,
      color: industryTrend > 0 ? 'green' : 'red',
      suffix: '%'
    },
    {
      title: 'Giảng viên phụ trách nhiều nhất',
      value: topInstructor,
      subtitle: 'top 1 hiển thị',
      icon: UserCheck,
      color: 'purple'
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
    if (change === 0) return null;
    
    const isPositive = change > 0;
    return (
      <div className={`flex items-center gap-1 text-sm font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <Icon size={24} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <div className="flex items-baseline gap-1 mb-1">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.suffix && (
                <span className="text-lg text-gray-500">{stat.suffix}</span>
              )}
            </div>
            {stat.subtitle && (
              <p className="text-xs text-gray-500">{stat.subtitle}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CourseStats;

