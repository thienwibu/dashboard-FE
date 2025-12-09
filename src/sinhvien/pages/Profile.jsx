import React, { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { softSkills } from '../data/data';

const Profile = () => {
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Khởi tạo state từ sessionStorage ngay từ đầu
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = sessionStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  });

  // Lấy thông tin user từ sessionStorage
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        setUserInfo(JSON.parse(savedUser));
      } catch (error) {
        console.error('❌ Error parsing user from sessionStorage:', error);
      }
    }
  }, []);

  // Calculate stats from enrolled courses
  const totalAssignments = enrolledCourses.reduce((sum, c) => sum + (c.assignments?.total || 0), 0);
  const completedAssignments = enrolledCourses.reduce((sum, c) => sum + (c.assignments?.completed || 0), 0);
  const totalProjects = enrolledCourses.length;
  const completedProjects = enrolledCourses.filter(c => c.progress === 100).length;
  const totalStudyHours = enrolledCourses.length * 42; // 15 weeks * 3 hours per week average
  const averageScore = enrolledCourses.length > 0
    ? (enrolledCourses.reduce((sum, c) => sum + (c.grade || 0), 0) / enrolledCourses.length).toFixed(1)
    : 0;
  const avgProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / enrolledCourses.length)
    : 0;
  const highestScore = enrolledCourses.length > 0
    ? Math.max(...enrolledCourses.map(c => c.grade || 0))
    : 0;
  const lowestScore = enrolledCourses.length > 0
    ? Math.min(...enrolledCourses.map(c => c.grade || 0))
    : 0;

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  // Default avatar if not provided
  const getAvatar = () => {
    if (userInfo?.avatar) return userInfo.avatar;
    const name = userInfo?.full_name || 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=667eea&color=fff&size=128`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">👤 Hồ sơ Học tập</h1>
        <p className="text-gray-700">Tổng kết thành tích và tiến độ học tập của bạn</p>
      </div>

      {/* Student Profile Card */}
      <div className="card relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-700"
          style={{ background: 'linear-gradient(135deg, #3f51b5 0%, #283593 100%)' }}
        ></div>
        <div className="relative z-10 text-white">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img
                  src={getAvatar()}
                  alt={userInfo?.full_name || 'User'}
                  className="w-20 h-20 rounded-full border-4 border-white shadow-2xl"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{userInfo?.full_name || 'Đang cập nhật...'}</h2>
                <p className="text-white font-medium text-sm">MSSV: {userInfo?.mssv || 'Chưa có'}</p>
                <p className="text-white font-medium text-sm">{userInfo?.email || ''}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="bg-white/90 text-primary-700 px-3 py-1 rounded-full text-xs font-bold">
                    {userInfo?.role === 'sinh_vien' ? 'Sinh Viên' : 
                     userInfo?.role === 'giang_vien' ? 'Giảng Viên' : 
                     userInfo?.role === 'manage_nghanh' ? 'Quản Lý Ngành' : 'User'}
                  </span>
                  <span className="bg-success-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    Nguy cơ: Low
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowReportPreview(true)}
              className="bg-white/90 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-white hover:scale-105 transition-all duration-200 shadow-lg"
            >
              📄 Xuất báo cáo
            </button>
          </div>
        </div>
      </div>

      {/* Study Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center hover:scale-105 transition-transform duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-3">📝</div>
            <div className="text-4xl font-bold text-primary-500 mb-2">{completedAssignments || 0}</div>
            <div className="text-sm font-bold text-gray-800">Bài tập hoàn thành</div>
            <div className="text-xs text-gray-700 mt-1 font-medium">
              / {totalAssignments || 0} tổng số
            </div>
          </div>
        </div>
        
        <div className="card text-center hover:scale-105 transition-transform duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-success-50 to-success-100"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-3">⭐</div>
            <div className="text-4xl font-bold text-success-600 mb-2">{averageScore || '0.0'}</div>
            <div className="text-sm font-bold text-gray-800">Điểm trung bình</div>
            <div className="text-xs text-gray-700 mt-1 font-medium">
              {highestScore > 0 ? `Cao nhất: ${highestScore}` : 'Chưa có điểm'}
            </div>
          </div>
        </div>
        
        <div className="card text-center hover:scale-105 transition-transform duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-3">⏰</div>
            <div className="text-4xl font-bold text-primary-500 mb-2">{totalStudyHours || 0}</div>
            <div className="text-sm font-bold text-gray-800">Tổng giờ học</div>
            <div className="text-xs text-gray-700 mt-1 font-medium">
              Trong học kỳ
            </div>
          </div>
        </div>
        
        <div className="card text-center hover:scale-105 transition-transform duration-200 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-50 to-accent-100"></div>
          <div className="relative z-10">
            <div className="text-5xl mb-3">🎓</div>
            <div className="text-4xl font-bold text-accent-500 mb-2">{enrolledCourses.length || 1}</div>
            <div className="text-sm font-bold text-gray-800">Khóa học</div>
            <div className="text-xs text-gray-700 mt-1 font-medium">
              Đã đăng ký
            </div>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 Tổng kết Học tập</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border-l-4 border-primary-500">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">📝</span>
                <span className="text-gray-800 font-semibold">Tổng số bài tập:</span>
              </div>
              <span className="font-bold text-2xl text-primary-500">{totalAssignments}</span>
            </div>
            <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-success-50 to-success-100 rounded-lg border-l-4 border-success-500">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">✅</span>
                <span className="text-gray-800 font-semibold">Đã hoàn thành:</span>
              </div>
              <span className="font-bold text-2xl text-success-600">{completedAssignments}</span>
            </div>
            <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border-l-4 border-primary-500">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎓</span>
                <span className="text-gray-800 font-semibold">Tổng số khóa học:</span>
              </div>
              <span className="font-bold text-2xl text-primary-500">{totalProjects}</span>
            </div>
            <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-accent-50 to-accent-100 rounded-lg border-l-4 border-accent-500">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <span className="text-gray-800 font-semibold">Khóa học hoàn thành:</span>
              </div>
              <span className="font-bold text-2xl text-accent-500">{completedProjects}</span>
            </div>
            <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border-l-4 border-primary-500">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⭐</span>
                <span className="text-gray-800 font-semibold">Điểm trung bình:</span>
              </div>
              <span className="font-bold text-3xl text-primary-500">{averageScore || 0}</span>
            </div>
            <div className="flex justify-between items-center py-4 px-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg border-l-4 border-primary-500">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎯</span>
                <span className="text-gray-800 font-semibold">Cấp độ hiện tại:</span>
              </div>
              <span className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-full font-bold text-lg">
                {enrolledCourses.length >= 5 ? 'Advanced' : enrolledCourses.length >= 2 ? 'Intermediate' : 'Beginner'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🎯 Mục tiêu & Tiến độ</h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-primary-50 to-primary-100 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🎓</span>
                  <span className="text-lg font-bold text-gray-800">Hoàn thành khóa học</span>
                </div>
                <span className="text-2xl font-bold text-primary-500">{avgProgress}%</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-primary-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${avgProgress}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-success-50 to-success-100 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">📝</span>
                  <span className="text-lg font-bold text-gray-800">Bài tập</span>
                </div>
                <span className="text-2xl font-bold text-success-600">
                  {totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0}%
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-success-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${totalAssignments > 0 ? (completedAssignments / totalAssignments) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-accent-50 to-accent-100 p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">🏆</span>
                  <span className="text-lg font-bold text-gray-800">Khóa học</span>
                </div>
                <span className="text-2xl font-bold text-accent-500">
                  {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
                </span>
              </div>
              <div className="bg-gray-200 rounded-full h-4 shadow-inner">
                <div
                  className="bg-accent-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ width: `${totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div className={`mt-6 p-6 rounded-xl border-l-4 ${
              avgProgress >= 70 
                ? 'bg-gradient-to-r from-success-50 to-success-100 border-success-500' 
                : avgProgress >= 40
                ? 'bg-gradient-to-r from-warning-50 to-warning-100 border-warning-500'
                : 'bg-gradient-to-r from-danger-50 to-danger-100 border-danger-500'
            }`}>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-3xl">
                  {avgProgress >= 70 ? '✅' : 
                   avgProgress >= 40 ? '⚠️' : '🚨'}
                </span>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    Nguy cơ học kém: 
                    <span className={`ml-2 font-bold ${
                      avgProgress >= 70 ? 'text-success-600' : avgProgress >= 40 ? 'text-warning-600' : 'text-danger-600'
                    }`}>
                      {avgProgress >= 70 ? 'Low' : avgProgress >= 40 ? 'Medium' : 'High'}
                    </span>
                  </p>
                </div>
              </div>
              <p className={`text-sm font-bold ${
                avgProgress >= 70 ? 'text-success-700' : avgProgress >= 40 ? 'text-warning-700' : 'text-danger-700'
              }`}>
                {avgProgress >= 70 
                  ? '🎉 Tiến độ học tập tốt! Hãy duy trì nhịp độ này.' 
                  : avgProgress >= 40
                  ? '⚠️ Cần chú ý hơn đến việc học. Hãy nộp bài đúng hạn.'
                  : '🚨 Cảnh báo! Cần cải thiện tiến độ học tập ngay.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* DT062: Dashboard kỹ năng mềm với Radar Chart */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">📊 Dashboard Kỹ năng Mềm</h2>
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={[
                { 
                  skill: 'Giao tiếp', 
                  value: softSkills.communication * 20, 
                  fullMark: 100 
                },
                { 
                  skill: 'Làm việc nhóm', 
                  value: softSkills.teamwork * 20, 
                  fullMark: 100 
                },
                { 
                  skill: 'Quản lý thời gian', 
                  value: softSkills.timeManagement * 20, 
                  fullMark: 100 
                },
                { 
                  skill: 'Giải quyết vấn đề', 
                  value: softSkills.problemSolving * 20, 
                  fullMark: 100 
                },
                { 
                  skill: 'Sáng tạo', 
                  value: softSkills.creativity * 20, 
                  fullMark: 100 
                },
                { 
                  skill: 'Lãnh đạo', 
                  value: softSkills.leadership * 20, 
                  fullMark: 100 
                }
              ]}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: '#4b5563', fontSize: 12, fontWeight: 600 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fill: '#6b7280', fontSize: 10 }}
                />
                <Radar
                  name="Kỹ năng Mềm"
                  dataKey="value"
                  stroke="#3f51b5"
                  fill="#3f51b5"
                  fillOpacity={0.6}
                  strokeWidth={2}
                />
                <Legend />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Điểm số']}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    border: '1px solid #3f51b5',
                    borderRadius: '8px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(softSkills).map(([skill, score]) => {
              const skillLabels = {
                communication: 'Giao tiếp',
                teamwork: 'Làm việc nhóm',
                timeManagement: 'Quản lý thời gian',
                problemSolving: 'Giải quyết vấn đề',
                creativity: 'Sáng tạo',
                leadership: 'Lãnh đạo'
              };
              return (
                <div key={skill} className="bg-gray-50 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium text-gray-700 mb-1">{skillLabels[skill]}</div>
                  <div className="text-lg font-bold text-primary-500">{score.toFixed(1)}/5.0</div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Report Preview Modal */}
      {showReportPreview && (
        <div 
          className="bg-black bg-opacity-60 flex items-center justify-center p-4" 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            zIndex: 9999,
            margin: 0,
            padding: '1rem'
          }}
        >
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Báo cáo Học tập Cá nhân</h2>
                <button
                  onClick={() => setShowReportPreview(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center border-b border-gray-200 pb-6">
                <img
                  src={getAvatar()}
                  alt={userInfo?.full_name || 'User'}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-500"
                />
                <h3 className="text-xl font-bold text-gray-900">{userInfo?.full_name || 'Đang cập nhật...'}</h3>
                <p className="text-gray-700 font-medium">MSSV: {userInfo?.mssv || 'Chưa có'}</p>
                <p className="text-gray-700 font-medium">{userInfo?.email || ''}</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Tổng quan</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 font-medium">Điểm TB:</p>
                    <p className="font-bold text-lg text-primary-500">{averageScore || 0}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 font-medium">Tiến độ:</p>
                    <p className="font-bold text-lg text-success-600">
                      {enrolledCourses.length > 0 
                        ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
                        : 0}%
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 font-medium">Bài hoàn thành:</p>
                    <p className="font-bold text-lg text-gray-900">{completedAssignments}/{totalAssignments}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-700 font-medium">Giờ học:</p>
                    <p className="font-bold text-lg text-gray-900">{totalStudyHours}h</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Thống kê học tập</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-accent-50 border border-accent-300 px-3 py-1 rounded-full text-sm text-gray-800 font-semibold">
                    📝 {completedAssignments} bài tập hoàn thành
                  </span>
                  <span className="bg-primary-50 border border-primary-300 px-3 py-1 rounded-full text-sm text-gray-800 font-semibold">
                    🎓 {enrolledCourses.length} khóa học
                    </span>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 font-medium">
                  Báo cáo được tạo tự động • {new Date().toLocaleDateString('vi-VN')}
                </p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowReportPreview(false)}
                className="btn-secondary"
              >
                Đóng
              </button>
              <button className="btn-primary">
                📥 Tải xuống PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;

