import React from 'react';
import { TrendingUp, TrendingDown, Users, BookOpen, Award, AlertCircle, CheckCircle, UserCheck, GraduationCap } from 'lucide-react';

const ReportStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Tổng sinh viên',
      value: stats?.totalStudents || 0,
      change: stats?.studentChange || 0,
      icon: Users,
      color: 'blue',
      description: 'Tổng số sinh viên đang theo học trong ngành'
    },
    {
      title: 'Tổng giảng viên',
      value: stats?.totalTeachers || 0,
      change: stats?.teacherChange || 0,
      icon: UserCheck,
      color: 'purple',
      description: 'Tổng số giảng viên trong ngành'
    },
    {
      title: 'Khóa học hoạt động',
      value: stats?.activeCourses || 0,
      change: stats?.courseChange || 0,
      icon: BookOpen,
      color: 'indigo',
      description: 'Số khóa học đang triển khai'
    },
    {
      title: 'Lớp học hoạt động',
      value: stats?.activeClasses || 0,
      change: stats?.classChange || 0,
      icon: GraduationCap,
      color: 'teal',
      description: 'Số lớp học đang diễn ra'
    },
    {
      title: 'Điểm TB toàn ngành',
      value: stats?.averageScore?.toFixed(1) || 0,
      change: stats?.scoreChange || 0,
      icon: Award,
      color: 'yellow',
      suffix: '/10',
      description: 'Điểm trung bình toàn ngành'
    },
    {
      title: 'Tỷ lệ hoàn thành ngành',
      value: stats?.completionRate || 0,
      change: stats?.completionChange || 0,
      icon: CheckCircle,
      color: 'green',
      suffix: '%',
      description: 'Tỷ lệ hoàn thành trung bình của tất cả khóa học'
    },
    {
      title: 'Sinh viên rủi ro',
      value: stats?.atRiskStudents || 0,
      change: stats?.riskChange || 0,
      icon: AlertCircle,
      color: 'red',
      description: 'Sinh viên có nguy cơ bỏ học hoặc yếu kém',
      invertChange: true
    },
    {
      title: 'Khóa có rủi ro',
      value: stats?.atRiskCourses || 0,
      change: stats?.riskCourseChange || 0,
      icon: AlertCircle,
      color: 'orange',
      description: 'Số khóa học có tiến độ dưới 70%',
      invertChange: true
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-100' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
      green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
      red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100' },
      teal: { bg: 'bg-teal-50', text: 'text-teal-600', border: 'border-teal-100' }
    };
    return colors[color] || colors.blue;
  };

  const renderChangeIndicator = (change, invertChange = false) => {
    if (change === 0) return null;
    
    const isPositive = invertChange ? change < 0 : change > 0;
    return (
      <div className={`flex items-center gap-1 text-xs font-medium ${
        isPositive ? 'text-green-600' : 'text-red-600'
      }`}>
        {change > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        <span>{Math.abs(change)}%</span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        const colors = getColorClasses(stat.color);
        
        return (
          <div
            key={index}
            className={`bg-white rounded-xl shadow-sm border ${colors.border} p-6 hover:shadow-md transition-all`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${colors.bg}`}>
                <Icon className={colors.text} size={24} />
              </div>
              {renderChangeIndicator(stat.change, stat.invertChange)}
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <div className="flex items-baseline gap-1 mb-2">
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              {stat.suffix && (
                <span className="text-lg text-gray-500">{stat.suffix}</span>
              )}
            </div>
            <p className="text-xs text-gray-500">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
};

export default ReportStats;

