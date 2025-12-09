import React, { useMemo } from 'react';
import { TrendingUp, Award, AlertTriangle, Eye } from 'lucide-react';
import { mockDepartmentData, mockClassData, mockDashboardData } from '../../../data/mockData';

const IndustryAnalysis = () => {
  // Tính toán xu hướng học tập (mock data - 7 ngày gần nhất)
  const learningTrend = useMemo(() => {
    // Mock data cho 7 ngày
    return [
      { day: 'T2', progress: 72 },
      { day: 'T3', progress: 74 },
      { day: 'T4', progress: 73 },
      { day: 'T5', progress: 76 },
      { day: 'T6', progress: 77 },
      { day: 'T7', progress: 78 },
      { day: 'CN', progress: 78.5 }
    ];
  }, []);

  // Top 3 giảng viên/môn có hiệu suất cao nhất
  const topPerformers = useMemo(() => {
    const courses = mockDashboardData.courseMonitoring || [];
    const teachers = mockDepartmentData.teachers || [];
    
    // Tính hiệu suất theo lớp học
    const teacherPerformance = teachers.map(teacher => {
      const teacherClasses = mockClassData.classes.filter(c => c.instructor === teacher.name);
      const avgCompletion = teacherClasses.length > 0
        ? teacherClasses.reduce((sum, c) => sum + (c.completionRate || 0), 0) / teacherClasses.length
        : 0;
      const avgScore = teacherClasses.length > 0
        ? teacherClasses.reduce((sum, c) => sum + (c.averageScore || 0), 0) / teacherClasses.length
        : 0;
      return {
        name: teacher.name,
        performance: (avgCompletion * 0.6 + avgScore * 10 * 0.4).toFixed(1),
        completionRate: avgCompletion,
        avgScore: avgScore.toFixed(1)
      };
    }).sort((a, b) => parseFloat(b.performance) - parseFloat(a.performance)).slice(0, 3);

    // Top 3 môn
    const coursePerformance = courses.map(course => ({
      name: course.name,
      performance: ((course.completionRate || 0) * 0.6 + (course.averageScore || 0) * 10 * 0.4).toFixed(1),
      completionRate: course.completionRate || 0,
      avgScore: course.averageScore || 0
    })).sort((a, b) => parseFloat(b.performance) - parseFloat(a.performance)).slice(0, 3);

    return { teachers: teacherPerformance, courses: coursePerformance };
  }, []);

  // 3 môn có nhiều sinh viên yếu nhất
  const weakSubjects = useMemo(() => {
    const allClasses = mockClassData.classes || [];
    const classDetails = mockClassData.classDetails || {};
    
    const subjectWeakCount = {};
    
    allClasses.forEach(cls => {
      const details = classDetails[cls.id];
      if (details && details.students) {
        const weakCount = details.students.filter(s => 
          (s.averageScore || 0) < 6 || (s.completionRate || 0) < 60
        ).length;
        
        if (!subjectWeakCount[cls.course]) {
          subjectWeakCount[cls.course] = { count: 0, total: 0, classes: [] };
        }
        subjectWeakCount[cls.course].count += weakCount;
        subjectWeakCount[cls.course].total += details.students.length;
        subjectWeakCount[cls.course].classes.push(cls);
      }
    });

    return Object.entries(subjectWeakCount)
      .map(([course, data]) => ({
        name: course,
        weakCount: data.count,
        totalStudents: data.total,
        percentage: data.total > 0 ? Math.round((data.count / data.total) * 100) : 0
      }))
      .sort((a, b) => b.weakCount - a.weakCount)
      .slice(0, 3);
  }, []);

  // Tính max value cho chart
  const maxProgress = Math.max(...learningTrend.map(d => d.progress));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Phân Tích Ngành</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Xu hướng học tập ngành */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h4 className="text-sm font-semibold text-gray-900">Xu hướng học tập ngành</h4>
          </div>
          {/* Simple line chart using SVG */}
          <div className="relative h-32">
            <svg className="w-full h-full" viewBox="0 0 300 100" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={100 - y}
                  x2="300"
                  y2={100 - y}
                  stroke="#e5e7eb"
                  strokeWidth="0.5"
                  strokeDasharray="2,2"
                />
              ))}
              {/* Data line */}
              <polyline
                points={learningTrend.map((point, idx) => {
                  const x = (idx / (learningTrend.length - 1)) * 300;
                  const y = 100 - ((point.progress / maxProgress) * 100);
                  return `${x},${y}`;
                }).join(' ')}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              {/* Data points */}
              {learningTrend.map((point, idx) => {
                const x = (idx / (learningTrend.length - 1)) * 300;
                const y = 100 - ((point.progress / maxProgress) * 100);
                return (
                  <circle
                    key={idx}
                    cx={x}
                    cy={y}
                    r="2"
                    fill="#3b82f6"
                  />
                );
              })}
            </svg>
            {/* Labels */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-600">
              {learningTrend.map((point, idx) => (
                <span key={idx}>{point.day}</span>
              ))}
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500 text-center">
            Tiến độ trung bình: {learningTrend[learningTrend.length - 1].progress}%
          </div>
        </div>

        {/* 2. Top 3 giảng viên/môn */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-amber-600" />
            <h4 className="text-sm font-semibold text-gray-900">Top 3 hiệu suất cao</h4>
          </div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-gray-600 mb-2">Giảng viên:</div>
              {topPerformers.teachers.map((teacher, idx) => (
                <div key={idx} className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-gray-700">
                    {idx + 1}. {teacher.name.split(' ').slice(-2).join(' ')}
                  </span>
                  <span className="font-semibold text-amber-600">{teacher.performance}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="text-xs text-gray-600 mb-2">Môn:</div>
              {topPerformers.courses.map((course, idx) => (
                <div key={idx} className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-gray-700 truncate">{idx + 1}. {course.name}</span>
                  <span className="font-semibold text-amber-600">{course.performance}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3. 3 môn có nhiều SV yếu */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            <h4 className="text-sm font-semibold text-gray-900">Môn có nhiều SV yếu</h4>
          </div>
          <div className="space-y-3">
            {weakSubjects.map((subject, idx) => (
              <div key={idx} className="bg-white rounded p-2.5 border border-rose-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-900 truncate">{subject.name}</span>
                  <span className="text-xs font-bold text-rose-600">{subject.percentage}%</span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {subject.weakCount}/{subject.totalStudents} sinh viên
                </div>
                <button className="w-full text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3" />
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndustryAnalysis;

