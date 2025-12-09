import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Award, Clock, BookOpen } from 'lucide-react';

const StudentAnalytics = ({ students, allStudents }) => {
  // Calculate analytics data
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.status === 'active').length;
  const atRiskStudents = students.filter(s => s.riskLevel === 'high').length;
  const averageScore = students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents || 0;
  const averageCompletion = students.reduce((sum, s) => sum + s.completionRate, 0) / totalStudents || 0;

  // Performance distribution
  const performanceData = [
    { name: 'Xuất sắc (≥9.0)', count: students.filter(s => s.averageScore >= 9.0).length, color: '#22c55e' },
    { name: 'Tốt (8.0-8.9)', count: students.filter(s => s.averageScore >= 8.0 && s.averageScore < 9.0).length, color: '#3b82f6' },
    { name: 'Trung bình (7.0-7.9)', count: students.filter(s => s.averageScore >= 7.0 && s.averageScore < 8.0).length, color: '#f59e0b' },
    { name: 'Yếu (<7.0)', count: students.filter(s => s.averageScore < 7.0).length, color: '#ef4444' }
  ];

  // Status distribution
  const statusData = [
    { name: 'Đang học', count: students.filter(s => s.status === 'active').length, color: '#22c55e' },
    { name: 'Có nguy cơ', count: students.filter(s => s.status === 'at_risk').length, color: '#ef4444' },
    { name: 'Hoàn thành', count: students.filter(s => s.status === 'completed').length, color: '#3b82f6' },
    { name: 'Đã bỏ học', count: students.filter(s => s.status === 'dropped').length, color: '#6b7280' }
  ];

  // Course enrollment data
  const courseData = {};
  students.forEach(student => {
    student.courses?.forEach(course => {
      if (!courseData[course.name]) {
        courseData[course.name] = { name: course.name, students: 0, avgScore: 0, totalScore: 0 };
      }
      courseData[course.name].students += 1;
      courseData[course.name].totalScore += student.averageScore;
    });
  });

  const courseChartData = Object.values(courseData).map(course => ({
    ...course,
    avgScore: (course.totalScore / course.students).toFixed(1)
  }));

  // Risk level data
  const riskData = [
    { name: 'Thấp', count: students.filter(s => s.riskLevel === 'low').length, color: '#22c55e' },
    { name: 'Trung bình', count: students.filter(s => s.riskLevel === 'medium').length, color: '#f59e0b' },
    { name: 'Cao', count: students.filter(s => s.riskLevel === 'high').length, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-medium text-gray-900">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="card p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Users className="h-8 w-8 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{totalStudents}</div>
          <div className="text-sm text-gray-600">Tổng sinh viên</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="h-8 w-8 text-success-600" />
          </div>
          <div className="text-2xl font-bold text-success-600 mb-1">{activeStudents}</div>
          <div className="text-sm text-gray-600">Đang học tập</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <AlertTriangle className="h-8 w-8 text-danger-600" />
          </div>
          <div className="text-2xl font-bold text-danger-600 mb-1">{atRiskStudents}</div>
          <div className="text-sm text-gray-600">Có nguy cơ</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Award className="h-8 w-8 text-warning-600" />
          </div>
          <div className="text-2xl font-bold text-warning-600 mb-1">{averageScore.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Điểm TB</div>
        </div>

        <div className="card p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Clock className="h-8 w-8 text-primary-600" />
          </div>
          <div className="text-2xl font-bold text-primary-600 mb-1">{averageCompletion.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Hoàn thành TB</div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân Bố Hiệu Suất</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {performanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng Thái Học Tập</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sinh Viên Theo Khóa Học</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="students" name="Số sinh viên" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mức Độ Rủi ro</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Statistics */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống Kê Chi Tiết</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Hiệu Suất Học Tập</h4>
            {performanceData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.count} ({Math.round((item.count / totalStudents) * 100)}%)
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Trạng Thái</h4>
            {statusData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.count} ({Math.round((item.count / totalStudents) * 100)}%)
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Mức Độ Rủi Ro</h4>
            {riskData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {item.count} ({Math.round((item.count / totalStudents) * 100)}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Assessment Criteria */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 text-warning-600" />
          Tiêu Chí Đánh Giá Mức Độ Rủi Ro
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* High Risk */}
          <div className="border-l-4 border-danger-500 pl-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-danger-500"></div>
              <h4 className="font-semibold text-danger-700">Nguy Cơ Cao</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-danger-500 mr-2">•</span>
                <span>Điểm TB &lt; 7.0</span>
              </li>
              <li className="flex items-start">
                <span className="text-danger-500 mr-2">•</span>
                <span>Hoàn thành &lt; 50%</span>
              </li>
              <li className="flex items-start">
                <span className="text-danger-500 mr-2">•</span>
                <span>Điểm đang giảm (&lt; -0.3)</span>
              </li>
              <li className="flex items-start">
                <span className="text-danger-500 mr-2">•</span>
                <span>Có bài không nộp/nộp muộn</span>
              </li>
            </ul>
          </div>

          {/* Medium Risk */}
          <div className="border-l-4 border-warning-500 pl-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-warning-500"></div>
              <h4 className="font-semibold text-warning-700">Nguy Cơ Trung Bình</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-warning-500 mr-2">•</span>
                <span>Điểm TB 7.0 - 7.9</span>
              </li>
              <li className="flex items-start">
                <span className="text-warning-500 mr-2">•</span>
                <span>Hoàn thành 50% - 75%</span>
              </li>
              <li className="flex items-start">
                <span className="text-warning-500 mr-2">•</span>
                <span>Điểm không tăng</span>
              </li>
              <li className="flex items-start">
                <span className="text-warning-500 mr-2">•</span>
                <span>Cần theo dõi thêm</span>
              </li>
            </ul>
          </div>

          {/* Low Risk */}
          <div className="border-l-4 border-success-500 pl-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-3 h-3 rounded-full bg-success-500"></div>
              <h4 className="font-semibold text-success-700">Nguy Cơ Thấp</h4>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-success-500 mr-2">•</span>
                <span>Điểm TB ≥ 8.0</span>
              </li>
              <li className="flex items-start">
                <span className="text-success-500 mr-2">•</span>
                <span>Hoàn thành &gt; 75%</span>
              </li>
              <li className="flex items-start">
                <span className="text-success-500 mr-2">•</span>
                <span>Điểm đang tăng</span>
              </li>
              <li className="flex items-start">
                <span className="text-success-500 mr-2">•</span>
                <span>Nộp bài đúng hạn</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <BookOpen className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h5 className="font-medium text-blue-900 mb-1">Lưu ý</h5>
              <p className="text-sm text-blue-700">
                Hệ thống đánh giá dựa trên nhiều yếu tố kết hợp. Sinh viên được phân loại tự động 
                nhưng giảng viên có thể điều chỉnh mức độ rủi ro dựa trên đánh giá thực tế.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;