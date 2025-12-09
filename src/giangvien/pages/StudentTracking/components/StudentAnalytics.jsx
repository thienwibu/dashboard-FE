import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Users, TrendingUp, AlertTriangle, Award, Clock, BookOpen, X, ChevronRight } from 'lucide-react';

const StudentAnalytics = ({ students, allStudents }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  // Sử dụng allStudents nếu có, nếu không thì dùng students
  const studentsToAnalyze = allStudents || students;
  
  // Calculate analytics data - Dùng studentsToAnalyze để đảm bảo tính toàn bộ
  const totalStudents = studentsToAnalyze.length;
  const activeStudents = studentsToAnalyze.filter(s => s.status === 'active' || s.status === 'at_risk').length;
  const atRiskStudents = studentsToAnalyze.filter(s => s.riskLevel === 'high').length;
  const averageScore = studentsToAnalyze.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents || 0;
  const averageCompletion = studentsToAnalyze.reduce((sum, s) => sum + s.completionRate, 0) / totalStudents || 0;

  // Performance distribution - Theo chuẩn phân loại
  const performanceData = [
    { name: 'Giỏi (≥8.0)', count: studentsToAnalyze.filter(s => s.averageScore >= 8.0).length, color: '#22c55e' },
    { name: 'Khá (6.5-7.9)', count: studentsToAnalyze.filter(s => s.averageScore >= 6.5 && s.averageScore < 8.0).length, color: '#3b82f6' },
    { name: 'Trung bình (5.0-6.4)', count: studentsToAnalyze.filter(s => s.averageScore >= 5.0 && s.averageScore < 6.5).length, color: '#f59e0b' },
    { name: 'Yếu (4.0-4.9)', count: studentsToAnalyze.filter(s => s.averageScore >= 4.0 && s.averageScore < 5.0).length, color: '#f97316' },
    { name: 'Kém (<4.0)', count: studentsToAnalyze.filter(s => s.averageScore < 4.0).length, color: '#ef4444' }
  ];

  // Status distribution
  const statusData = [
    { name: 'Đang học', count: studentsToAnalyze.filter(s => s.status === 'active').length, color: '#22c55e' },
    { name: 'Hoàn thành', count: studentsToAnalyze.filter(s => s.status === 'completed').length, color: '#3b82f6' },
    { name: 'Có nguy cơ', count: studentsToAnalyze.filter(s => s.status === 'at_risk').length, color: '#ef4444' },
    { name: 'Đã bỏ học', count: studentsToAnalyze.filter(s => s.status === 'dropped').length, color: '#6b7280' }
  ];

  // Course enrollment data
  const courseData = {};
  studentsToAnalyze.forEach(student => {
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
    { name: 'Thấp', count: studentsToAnalyze.filter(s => s.riskLevel === 'low').length, color: '#22c55e' },
    { name: 'Trung bình', count: studentsToAnalyze.filter(s => s.riskLevel === 'medium').length, color: '#f59e0b' },
    { name: 'Cao', count: studentsToAnalyze.filter(s => s.riskLevel === 'high').length, color: '#ef4444' }
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
      {/* Key Metrics - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <button 
          onClick={() => {
            setModalContent({ type: 'allStudents', data: studentsToAnalyze });
            setShowDetailModal(true);
          }}
          className="card p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-center mb-3">
            <Users className="h-8 w-8 text-primary-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{studentsToAnalyze.length}</div>
          <div className="text-sm text-gray-600">Tổng sinh viên</div>
          <div className="text-xs text-primary-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem danh sách →
          </div>
        </button>

        <button 
          onClick={() => {
            setModalContent({ 
              type: 'activeStudents', 
              data: studentsToAnalyze.filter(s => s.status === 'active' || s.status === 'at_risk') 
            });
            setShowDetailModal(true);
          }}
          className="card p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-center mb-3">
            <TrendingUp className="h-8 w-8 text-success-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-success-600 mb-1">
            {studentsToAnalyze.filter(s => s.status === 'active' || s.status === 'at_risk').length}
          </div>
          <div className="text-sm text-gray-600">Đang học tập</div>
          <div className="text-xs text-success-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem chi tiết →
          </div>
        </button>

        <button 
          onClick={() => {
            setModalContent({ 
              type: 'atRiskStudents', 
              data: studentsToAnalyze.filter(s => s.riskLevel === 'high') 
            });
            setShowDetailModal(true);
          }}
          className="card p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-center mb-3">
            <AlertTriangle className="h-8 w-8 text-danger-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-danger-600 mb-1">{atRiskStudents}</div>
          <div className="text-sm text-gray-600">Có nguy cơ</div>
          <div className="text-xs text-danger-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem chi tiết →
          </div>
        </button>

        <button 
          onClick={() => {
            setModalContent({ type: 'avgScore', data: studentsToAnalyze });
            setShowDetailModal(true);
          }}
          className="card p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-center mb-3">
            <Award className="h-8 w-8 text-warning-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-warning-600 mb-1">{averageScore.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Điểm TB</div>
          <div className="text-xs text-warning-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem phân tích →
          </div>
        </button>

        <button 
          onClick={() => {
            setModalContent({ type: 'avgCompletion', data: studentsToAnalyze });
            setShowDetailModal(true);
          }}
          className="card p-6 text-center hover:shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-center mb-3">
            <Clock className="h-8 w-8 text-primary-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-bold text-primary-600 mb-1">{averageCompletion.toFixed(1)}</div>
          <div className="text-sm text-gray-600">Hoàn thành TB</div>
          <div className="text-xs text-primary-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            Xem chi tiết →
          </div>
        </button>
      </div>

      {/* Charts Row 1 - Clickable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <button 
          onClick={() => {
            setModalContent({ type: 'performance', data: performanceData, students: studentsToAnalyze });
            setShowDetailModal(true);
          }}
          className="card p-6 hover:shadow-lg transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Phân Bố Hiệu Suất</h3>
            <div className="text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <span>Xem chi tiết</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </div>
          </div>
          <div className="h-64 pointer-events-none">
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
        </button>

        <button 
          onClick={() => {
            setModalContent({ type: 'status', data: statusData, students: studentsToAnalyze });
            setShowDetailModal(true);
          }}
          className="card p-6 hover:shadow-lg transition-all cursor-pointer text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Trạng Thái Học Tập</h3>
            <div className="text-xs text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
              <span>Xem chi tiết</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </div>
          </div>
          <div className="h-64 pointer-events-none">
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
        </button>
      </div>

      {/* Charts Row 2 - Clickable */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sinh Viên Theo Khóa Học</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalContent({ type: 'courses', data: courseChartData, students: studentsToAnalyze });
                setShowDetailModal(true);
              }}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center transition-colors"
            >
              <span>Xem chi tiết</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
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

        <div className="card p-6 hover:shadow-lg transition-all group">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Mức Độ Rủi ro</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setModalContent({ type: 'risk', data: riskData, students: studentsToAnalyze });
                setShowDetailModal(true);
              }}
              className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center transition-colors"
            >
              <span>Xem chi tiết</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </button>
          </div>
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
                  {item.count} ({Math.round((item.count / studentsToAnalyze.length) * 100)}%)
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
                <span>Điểm TB &lt; 5.0</span>
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
                <span>Điểm TB 5.0 - 6.4</span>
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
                <span>Điểm TB ≥ 6.5</span>
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

      {/* Detail Modal */}
      {showDetailModal && modalContent && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-80" onClick={() => setShowDetailModal(false)}></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {modalContent.type === 'allStudents' && 'Danh sách tất cả sinh viên'}
                  {modalContent.type === 'activeStudents' && 'Sinh viên đang học tập'}
                  {modalContent.type === 'atRiskStudents' && 'Sinh viên có nguy cơ cao'}
                  {modalContent.type === 'avgScore' && 'Phân tích điểm trung bình'}
                  {modalContent.type === 'avgCompletion' && 'Phân tích tỷ lệ hoàn thành'}
                  {modalContent.type === 'performance' && 'Chi tiết Phân Bố Hiệu Suất'}
                  {modalContent.type === 'status' && 'Chi tiết Trạng Thái Học Tập'}
                  {modalContent.type === 'courses' && 'Chi tiết Sinh Viên Theo Khóa Học'}
                  {modalContent.type === 'risk' && 'Chi tiết Mức Độ Rủi ro'}
                </h3>
                <button onClick={() => setShowDetailModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* All Students Detail */}
              {modalContent.type === 'allStudents' && (
                <div className="space-y-3">
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-600">{modalContent.data.length}</div>
                      <div className="text-gray-600 mt-1">Tổng số sinh viên</div>
                    </div>
                  </div>
                  {modalContent.data.map((student, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-primary-600">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.studentId} • {student.email}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-blue-600">{student.averageScore.toFixed(1)}</div>
                          <div className="text-xs text-gray-500">Điểm TB</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Hoàn thành</div>
                          <div className="font-medium text-gray-900">{student.completionRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Bài tập</div>
                          <div className="font-medium text-gray-900">{student.completedAssignments}/{student.totalAssignments}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Trạng thái</div>
                          <div className={`font-medium ${
                            student.status === 'active' ? 'text-success-600' :
                            student.status === 'at_risk' ? 'text-danger-600' :
                            'text-gray-600'
                          }`}>
                            {student.status === 'active' ? 'Đang học' : student.status === 'at_risk' ? 'Có nguy cơ' : 'Khác'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Active Students Detail */}
              {modalContent.type === 'activeStudents' && (
                <div className="space-y-3">
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-600">{modalContent.data.length}</div>
                      <div className="text-gray-600 mt-1">Sinh viên đang học tập</div>
                    </div>
                  </div>
                  {modalContent.data.map((student, idx) => (
                    <div key={idx} className="border-l-4 border-green-500 bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-600">{student.studentId}</div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                          Đang học
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-gray-600">Điểm TB</div>
                          <div className="font-bold text-gray-900">{student.averageScore.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Hoàn thành</div>
                          <div className="font-bold text-gray-900">{student.completionRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Bài tập</div>
                          <div className="font-bold text-gray-900">{student.completedAssignments}/{student.totalAssignments}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Rủi ro</div>
                          <div className={`font-bold ${
                            student.riskLevel === 'high' ? 'text-danger-600' :
                            student.riskLevel === 'medium' ? 'text-warning-600' :
                            'text-success-600'
                          }`}>
                            {student.riskLevel === 'high' ? 'Cao' : student.riskLevel === 'medium' ? 'TB' : 'Thấp'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* At Risk Students Detail */}
              {modalContent.type === 'atRiskStudents' && (
                <div className="space-y-3">
                  <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-red-600">{modalContent.data.length}</div>
                      <div className="text-gray-600 mt-1">Sinh viên có nguy cơ cao</div>
                    </div>
                  </div>
                  {modalContent.data.map((student, idx) => (
                    <div key={idx} className="border-l-4 border-danger-500 bg-danger-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 rounded-full bg-danger-100 flex items-center justify-center">
                            <span className="text-lg font-bold text-danger-600">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{student.name}</div>
                            <div className="text-sm text-gray-600">{student.studentId} • {student.email}</div>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-danger-100 text-danger-800 rounded-full text-sm font-medium">
                          Rủi ro cao
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-sm mb-3">
                        <div>
                          <div className="text-gray-600">Điểm TB</div>
                          <div className="font-bold text-danger-600">{student.averageScore.toFixed(1)}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Hoàn thành</div>
                          <div className="font-bold text-danger-600">{student.completionRate}%</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Bài tập</div>
                          <div className="font-bold text-danger-600">{student.completedAssignments}/{student.totalAssignments}</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Thời gian</div>
                          <div className="font-bold text-danger-600">{student.totalHours}h</div>
                        </div>
                      </div>
                      {student.courses && student.courses.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-sm font-medium text-gray-900">Môn học:</div>
                          {student.courses.map((course, cIdx) => (
                            <div key={cIdx} className="flex items-center justify-between text-sm bg-white rounded p-2">
                              <span className="text-gray-700">{course.name}</span>
                              <div className="flex items-center space-x-3">
                                <span className={`font-medium ${
                                  course.score >= 8.0 ? 'text-success-600' :
                                  course.score >= 6.5 ? 'text-primary-600' :
                                  'text-danger-600'
                                }`}>
                                  Điểm: {course.score.toFixed(1)}
                                </span>
                                <span className={`font-medium ${
                                  course.progress >= 75 ? 'text-success-600' :
                                  course.progress >= 50 ? 'text-warning-600' :
                                  'text-danger-600'
                                }`}>
                                  Tiến độ: {course.progress}%
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Average Score Detail */}
              {modalContent.type === 'avgScore' && (
                <div className="space-y-4">
                  <div className="bg-orange-50 p-6 rounded-lg text-center">
                    <div className="text-5xl font-bold text-orange-600 mb-2">
                      {(modalContent.data.reduce((sum, s) => sum + s.averageScore, 0) / modalContent.data.length).toFixed(2)}
                    </div>
                    <div className="text-gray-600 mb-3">Điểm trung bình chung</div>
                    <div className="text-sm text-orange-700 bg-white/50 rounded-lg p-3 mt-3">
                      <div className="font-semibold mb-1">📊 Cách tính:</div>
                      <div className="text-xs">
                        Tổng điểm của {modalContent.data.length} sinh viên ÷ {modalContent.data.length} = {' '}
                        ({modalContent.data.reduce((sum, s) => sum + s.averageScore, 0).toFixed(2)} ÷ {modalContent.data.length})
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Điểm cao nhất</div>
                      <div className="text-2xl font-bold text-success-600">
                        {Math.max(...modalContent.data.map(s => s.averageScore)).toFixed(1)}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-1">Điểm thấp nhất</div>
                      <div className="text-2xl font-bold text-danger-600">
                        {Math.min(...modalContent.data.map(s => s.averageScore)).toFixed(1)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Top 5 sinh viên xuất sắc:</h4>
                    {modalContent.data
                      .sort((a, b) => b.averageScore - a.averageScore)
                      .slice(0, 5)
                      .map((student, index) => (
                        <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                          <div className="flex items-center space-x-3">
                            <div className="text-lg font-bold text-gray-400">#{index + 1}</div>
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600">{student.studentId}</div>
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-success-600">{student.averageScore.toFixed(1)}</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Average Completion Detail */}
              {modalContent.type === 'avgCompletion' && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-6 rounded-lg text-center">
                    <div className="text-5xl font-bold text-blue-600 mb-2">
                      {(modalContent.data.reduce((sum, s) => sum + s.completionRate, 0) / modalContent.data.length).toFixed(1)}%
                    </div>
                    <div className="text-gray-600 mb-3">Tỷ lệ hoàn thành trung bình</div>
                    <div className="text-sm text-blue-700 bg-white/50 rounded-lg p-3 mt-3">
                      <div className="font-semibold mb-1">📊 Cách tính:</div>
                      <div className="text-xs">
                        Tổng tỷ lệ hoàn thành ÷ {modalContent.data.length} sinh viên = {' '}
                        ({modalContent.data.reduce((sum, s) => sum + s.completionRate, 0).toFixed(1)} ÷ {modalContent.data.length})
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Chi tiết từng sinh viên:</h4>
                    {modalContent.data
                      .sort((a, b) => b.completionRate - a.completionRate)
                      .map((student, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600">{student.studentId}</div>
                            </div>
                            <div className={`text-2xl font-bold ${
                              student.completionRate >= 80 ? 'text-success-600' :
                              student.completionRate >= 50 ? 'text-warning-600' :
                              'text-danger-600'
                            }`}>
                              {student.completionRate}%
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div 
                              className={`h-3 rounded-full ${
                                student.completionRate >= 80 ? 'bg-success-600' :
                                student.completionRate >= 50 ? 'bg-warning-600' :
                                'bg-danger-600'
                              }`}
                              style={{ width: `${student.completionRate}%` }}
                            ></div>
                          </div>
                          <div className="text-sm text-gray-600">
                            Bài tập: {student.completedAssignments}/{student.totalAssignments} • 
                            Thời gian: {student.totalHours}h
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Performance Distribution Detail */}
              {modalContent.type === 'performance' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Tổng quan phân bố điểm</h4>
                    <div className="grid grid-cols-5 gap-4">
                      {modalContent.data.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>
                            {item.count}
                          </div>
                          <div className="text-xs text-gray-600">{item.name}</div>
                          <div className="text-xs font-medium text-gray-900 mt-1">
                            {((item.count / totalStudents) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {modalContent.data.map((category, idx) => {
                    const studentsInCategory = modalContent.students.filter(s => {
                      if (category.name.includes('≥8.0')) return s.averageScore >= 8.0;
                      if (category.name.includes('6.5-7.9')) return s.averageScore >= 6.5 && s.averageScore < 8.0;
                      if (category.name.includes('5.0-6.4')) return s.averageScore >= 5.0 && s.averageScore < 6.5;
                      if (category.name.includes('4.0-4.9')) return s.averageScore >= 4.0 && s.averageScore < 5.0;
                      return s.averageScore < 4.0;
                    });

                    if (studentsInCategory.length === 0) return null;

                    return (
                      <div key={idx} className="border-l-4 rounded-lg p-4" style={{ borderColor: category.color, backgroundColor: `${category.color}10` }}>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                          <span>{category.name}</span>
                          <span className="text-sm font-normal text-gray-600">{studentsInCategory.length} sinh viên</span>
                        </h5>
                        <div className="space-y-2">
                          {studentsInCategory.map((student, sIdx) => (
                            <div key={sIdx} className="bg-white rounded p-3 flex items-center justify-between">
                              <div>
                                <div className="font-medium text-gray-900">{student.name}</div>
                                <div className="text-sm text-gray-600">{student.studentId}</div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold" style={{ color: category.color }}>
                                  {student.averageScore.toFixed(1)}
                                </div>
                                <div className="text-xs text-gray-500">Hoàn thành: {student.completionRate}%</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Status Detail */}
              {modalContent.type === 'status' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Tổng quan trạng thái</h4>
                    <div className="grid grid-cols-4 gap-4">
                      {modalContent.data.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>
                            {item.count}
                          </div>
                          <div className="text-xs text-gray-600">{item.name}</div>
                          <div className="text-xs font-medium text-gray-900 mt-1">
                            {((item.count / totalStudents) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {modalContent.data.map((statusItem, idx) => {
                    let studentsInStatus = [];
                    if (statusItem.name === 'Đang học') studentsInStatus = modalContent.students.filter(s => s.status === 'active');
                    else if (statusItem.name === 'Có nguy cơ') studentsInStatus = modalContent.students.filter(s => s.status === 'at_risk');
                    else if (statusItem.name === 'Hoàn thành') studentsInStatus = modalContent.students.filter(s => s.status === 'completed');
                    else if (statusItem.name === 'Đã bỏ học') studentsInStatus = modalContent.students.filter(s => s.status === 'dropped');

                    if (studentsInStatus.length === 0) return null;

                    return (
                      <div key={idx} className="border-l-4 rounded-lg p-4" style={{ borderColor: statusItem.color, backgroundColor: `${statusItem.color}10` }}>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                          <span>{statusItem.name}</span>
                          <span className="text-sm font-normal text-gray-600">{studentsInStatus.length} sinh viên</span>
                        </h5>
                        <div className="grid grid-cols-2 gap-3">
                          {studentsInStatus.map((student, sIdx) => (
                            <div key={sIdx} className="bg-white rounded p-3">
                              <div className="font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-600 mt-1">{student.studentId}</div>
                              <div className="flex items-center justify-between mt-2 text-xs">
                                <span className="text-gray-600">Điểm TB: <span className="font-bold">{student.averageScore.toFixed(1)}</span></span>
                                <span className="text-gray-600">Hoàn thành: <span className="font-bold">{student.completionRate}%</span></span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Courses Detail */}
              {modalContent.type === 'courses' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Tổng quan khóa học</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">{modalContent.data?.length || 0}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tổng khóa học</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                          {modalContent.data?.reduce((sum, c) => sum + (c.students || 0), 0) || 0}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Tổng sinh viên</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                          {modalContent.data?.length > 0 
                            ? (modalContent.data.reduce((sum, c) => sum + (parseFloat(c.avgScore) || 0), 0) / modalContent.data.length).toFixed(1)
                            : '0.0'
                          }
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">Điểm TB chung</div>
                      </div>
                    </div>
                  </div>

                  {modalContent.data && modalContent.data.length > 0 ? (
                    modalContent.data
                      .sort((a, b) => (b.students || 0) - (a.students || 0))
                      .map((course, idx) => {
                        const totalStudents = modalContent.data.reduce((sum, c) => sum + (c.students || 0), 0);
                        const percentage = totalStudents > 0 ? ((course.students || 0) / totalStudents * 100) : 0;
                        
                        return (
                          <div key={idx} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                            <div className="flex items-center justify-between mb-3">
                              <div>
                                <div className="font-semibold text-gray-900 dark:text-gray-100 text-lg">{course.name || 'Không có tên'}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {course.students || 0} sinh viên đang học
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{course.avgScore || '0.0'}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Điểm TB</div>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                              <div 
                                className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {percentage.toFixed(1)}% tổng sinh viên
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      Không có dữ liệu khóa học
                    </div>
                  )}
                </div>
              )}

              {/* Risk Detail */}
              {modalContent.type === 'risk' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-4">Tổng quan mức độ rủi ro</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {modalContent.data.map((item, idx) => (
                        <div key={idx} className="text-center">
                          <div className="text-3xl font-bold mb-1" style={{ color: item.color }}>
                            {item.count}
                          </div>
                          <div className="text-sm text-gray-600">{item.name}</div>
                          <div className="text-xs font-medium text-gray-900 mt-1">
                            {((item.count / modalContent.students.length) * 100).toFixed(1)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {modalContent.data.map((riskItem, idx) => {
                    let studentsInRisk = [];
                    if (riskItem.name === 'Thấp') studentsInRisk = modalContent.students.filter(s => s.riskLevel === 'low');
                    else if (riskItem.name === 'Trung bình') studentsInRisk = modalContent.students.filter(s => s.riskLevel === 'medium');
                    else if (riskItem.name === 'Cao') studentsInRisk = modalContent.students.filter(s => s.riskLevel === 'high');

                    if (studentsInRisk.length === 0) return null;

                    return (
                      <div key={idx} className="border-l-4 rounded-lg p-4" style={{ borderColor: riskItem.color, backgroundColor: `${riskItem.color}10` }}>
                        <h5 className="font-semibold text-gray-900 mb-3 flex items-center justify-between">
                          <span>Rủi ro {riskItem.name}</span>
                          <span className="text-sm font-normal text-gray-600">{studentsInRisk.length} sinh viên</span>
                        </h5>
                        <div className="space-y-2">
                          {studentsInRisk.map((student, sIdx) => (
                            <div key={sIdx} className="bg-white rounded p-3">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <div className="font-medium text-gray-900">{student.name}</div>
                                  <div className="text-sm text-gray-600">{student.studentId}</div>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ 
                                  backgroundColor: `${riskItem.color}20`, 
                                  color: riskItem.color 
                                }}>
                                  {riskItem.name}
                                </span>
                              </div>
                              <div className="grid grid-cols-3 gap-3 text-xs">
                                <div>
                                  <div className="text-gray-600">Điểm TB</div>
                                  <div className="font-bold text-gray-900">{student.averageScore.toFixed(1)}</div>
                                </div>
                                <div>
                                  <div className="text-gray-600">Hoàn thành</div>
                                  <div className="font-bold text-gray-900">{student.completionRate}%</div>
                                </div>
                                <div>
                                  <div className="text-gray-600">Bài tập</div>
                                  <div className="font-bold text-gray-900">{student.completedAssignments}/{student.totalAssignments}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAnalytics;