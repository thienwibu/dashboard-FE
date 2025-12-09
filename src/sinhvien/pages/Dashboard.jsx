import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { competencyByCourse, competencyAssessment, courseExercises, friendSuggestions, courseLessons } from '../data/data';

// Load Highcharts More module - cần thiết cho gauge chart
let moreModuleInitialized = false;

const initMoreModule = async () => {
  if (moreModuleInitialized) return;
  
  try {
    // Highcharts cần highcharts-more module để hỗ trợ gauge chart
    const moreModule = await import('highcharts/highcharts-more.js');
    const initMore = moreModule.default || moreModule;
    if (typeof initMore === 'function') {
      initMore(Highcharts);
      moreModuleInitialized = true;
    }
  } catch (err) {
    console.error('Failed to load highcharts-more module:', err);
  }
};

// Component Gauge Chart sử dụng Highcharts
const GaugeChart = ({ value, courseName, size = 250 }) => {
  const chartRef = useRef(null);
  const percentage = Math.min(100, Math.max(0, value));
  
  // Màu sắc dựa trên giá trị
  let gaugeColor = '#ef4444'; // Red
  if (percentage >= 75) gaugeColor = '#22c55e'; // Green
  else if (percentage >= 50) gaugeColor = '#f59e0b'; // Yellow/Orange
  
  const options = {
    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false,
      height: '80%'
    },
    credits: {
      enabled: false // Tắt watermark "Highcharts.com"
    },
    title: {
      text: null // Bỏ title vì đã có tên khóa học ở ngoài
    },
    pane: {
      startAngle: -90,
      endAngle: 89.9, // Giống mẫu để đảm bảo labels nằm đúng trên đường cong
      background: null,
      center: ['50%', '75%'],
      size: '110%'
    },
    // Trục giá trị - từ 0 đến 100%
    yAxis: {
      min: 0,
      max: 100,
      tickPixelInterval: null, // Tắt auto tick để dùng tickPositions
      tickPosition: 'inside',
      tickColor: '#FFFFFF',
      tickLength: 20,
      tickWidth: 2,
      minorTickInterval: null,
      tickPositions: [0, 25, 50, 75, 100], // Chỉ hiển thị các mốc này
      labels: {
        distance: 10, // Giảm distance để labels nằm sát trên đường cong
        style: {
          fontSize: '14px',
          color: '#666'
        },
        formatter: function() {
          return this.value + '%';
        }
      },
      lineWidth: 0,
      // Các vùng màu: Red (0-50%), Yellow (50-75%), Green (75-100%)
      plotBands: [{
        from: 0,
        to: 50,
        color: '#ef4444', // Red
        thickness: 20,
        borderRadius: '50%'
      }, {
        from: 50,
        to: 75,
        color: '#f59e0b', // Yellow/Orange
        thickness: 20,
        borderRadius: '50%'
      }, {
        from: 75,
        to: 100,
        color: '#22c55e', // Green
        thickness: 20,
        borderRadius: '50%'
      }]
    },
    series: [{
      name: 'Tiến độ',
      data: [percentage],
      tooltip: {
        valueSuffix: ' %'
      },
      dataLabels: {
        enabled: false // Tắt số phần trăm dưới cây kim
      },
      dial: {
        radius: '80%',
        backgroundColor: '#1f2937',
        baseWidth: 12,
        baseLength: '0%',
        rearLength: '0%'
      },
      pivot: {
        backgroundColor: '#1f2937',
        radius: 6
      }
    }]
  };
  
  return (
    <div style={{ width: '100%', height: `${size * 0.6}px`, maxWidth: `${size}px`, margin: '0 auto', overflow: 'hidden' }}>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartRef}
      />
    </div>
  );
};

  const Dashboard = ({ setCurrentPage }) => {
  const [userName, setUserName] = useState('');
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0); // Key để force re-render
  const [gaugeReady, setGaugeReady] = useState(false);

  // Initialize Highcharts More module khi component mount (cần cho gauge chart)
  useEffect(() => {
    initMoreModule().then(() => {
      setGaugeReady(true);
    });
  }, []);

  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserName(user.full_name || '');
    }

    const loadCourses = () => {
    const savedCourses = sessionStorage.getItem('enrolledCourses');
    if (savedCourses) {
        let courses = JSON.parse(savedCourses);

        // Tính lại tiến độ từ completedLessons nếu cần
        const savedCompletedLessons = sessionStorage.getItem('completedLessons');
        if (savedCompletedLessons) {
          const completedLessons = JSON.parse(savedCompletedLessons);
          courses = courses.map(course => {
            const lessons = courseLessons[course.id] || [];
            if (lessons.length > 0) {
              const completedCount = lessons.filter(l => completedLessons.includes(l.id)).length;
              const newProgress = Math.round((completedCount / lessons.length) * 100);
              return { ...course, progress: newProgress };
            }
            return course;
          });
          
          // Lưu lại nếu có thay đổi
          sessionStorage.setItem('enrolledCourses', JSON.stringify(courses));
        }
        
        setEnrolledCourses(courses);
      }
    };

    loadCourses();

    // Lắng nghe thay đổi từ sessionStorage
    const handleStorageChange = () => {
      loadCourses();
      setRefreshKey(prev => prev + 1); // Force re-render
    };

    // Lắng nghe sự kiện storage (khi tab khác thay đổi)
    window.addEventListener('storage', handleStorageChange);
    
    // Lắng nghe custom event khi courses được cập nhật
    window.addEventListener('coursesUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('coursesUpdated', handleStorageChange);
    };
  }, [refreshKey]);


  // Hàm xác định mức độ dựa trên điểm số
  const getLevel = (score) => {
    if (score >= 90) return { level: 'Giỏi', color: 'bg-success-500', textColor: 'text-success-700' };
    if (score >= 80) return { level: 'Khá', color: 'bg-primary-500', textColor: 'text-primary-700' };
    if (score >= 60) return { level: 'Trung bình', color: 'bg-warning-500', textColor: 'text-warning-700' };
    return { level: 'Yếu', color: 'bg-danger-500', textColor: 'text-danger-700' };
  };

  return (
    <div className="space-y-6">
      {/* Tiêu đề chào mừng */}
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-primary-500 dark:text-primary-400">
          Chào mừng sinh viên {userName || 'Sinh viên'} quay lại dashboard!
        </h1>
      </div>

      {/* Hàng 1: Khung môn học + Biểu đồ tiến độ */}
      {enrolledCourses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Khung hiển thị các môn đã đăng ký */}
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md border border-gray-200 dark:border-gray-700"
            style={{ height: '500px', overflowY: 'auto' }}
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              Các môn đã đăng ký
            </h2>
            <div className="space-y-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                      {course.name}
                    </h3>
                    <span className="text-2xl font-bold text-gray-800 dark:text-white">
                      {course.progress || 0}%
                    </span>
                </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all ${
                        course.progress === 100 ? 'bg-success-500' :
                        course.progress >= 50 ? 'bg-primary-500' : 'bg-warning-500'
                      }`}
                      style={{ width: `${course.progress || 0}%` }}
                    ></div>
                </div>
                  {course.code && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                      {course.code}
                  </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Biểu đồ tiến độ học tập */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md overflow-hidden">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              📊 Tiến độ các Khóa học Đã Đăng ký
            </h2>
            {enrolledCourses.length > 0 ? (
              gaugeReady ? (
                <div className={`grid gap-4 ${
                  enrolledCourses.length === 1 
                    ? 'grid-cols-1' 
                    : enrolledCourses.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : enrolledCourses.length === 3
                    ? 'grid-cols-1 md:grid-cols-2' // 2 cột 2 hàng cho 3 khóa học
                    : enrolledCourses.length === 4
                    ? 'grid-cols-1 md:grid-cols-2' // 2 cột 2 hàng
                    : enrolledCourses.length <= 6
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // 3 cột 2 hàng
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' // 3 cột 3 hàng (hoặc nhiều hơn)
                }`}>
                  {enrolledCourses.map((course) => {
                    const progress = course.progress || 0;
                    // Kích thước gauge dựa trên số lượng khóa học
                    // 1 khóa: lớn (320px), 2 khóa: vừa (280px), 3-4 khóa: vừa (240px), 5+ khóa: nhỏ (200px)
                    const gaugeSize = enrolledCourses.length === 1 
                      ? 320 
                      : enrolledCourses.length === 2 
                      ? 280
                      : enrolledCourses.length <= 4
                      ? 240
                      : 200;
                    
                      return (
                      <div key={course.id} className="flex flex-col items-center justify-center p-2">
                        <h3 className={`font-semibold text-gray-800 dark:text-white mb-2 text-center ${
                          enrolledCourses.length === 1 ? 'text-xl' : enrolledCourses.length <= 4 ? 'text-lg' : 'text-base'
                        }`}>
                          {course.name}
                        </h3>
                        <div className="w-full flex justify-center">
                          <GaugeChart value={progress} courseName={course.name} size={gaugeSize} />
                        </div>
                      </div>
                      );
                    })}
                </div>
              ) : (
                <div className="flex items-center justify-center h-[420px] text-gray-500 dark:text-gray-400">
                  Đang tải biểu đồ...
                              </div>
              )
            ) : (
              <div className="flex items-center justify-center h-[420px] text-gray-500 dark:text-gray-400">
                Chưa có dữ liệu tiến độ
              </div>
            )}
            </div>
          </div>
        )}

      {/* Hàng 2: Phân loại năng lực theo từng môn + Gợi ý bạn bè */}
      {enrolledCourses.length > 0 && (
        <div className={`grid gap-6 ${
          enrolledCourses.length === 1 
            ? 'grid-cols-1 lg:grid-cols-5' 
            : 'grid-cols-1 lg:grid-cols-3'
        }`}>
          {/* Phân loại năng lực theo từng môn - Tự động điều chỉnh */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${
            enrolledCourses.length === 1 
              ? 'lg:col-span-2' 
              : 'lg:col-span-2'
          }`}>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
            📊 Phân loại năng lực theo từng môn
          </h2>
            <div 
              className={`${
                enrolledCourses.length === 1 
                  ? 'flex flex-col gap-4' 
                  : enrolledCourses.length === 2
                  ? 'grid grid-cols-1 gap-4'
                  : 'flex flex-col gap-4 overflow-y-auto'
              }`}
              style={enrolledCourses.length >= 3 ? { 
                maxHeight: '500px',
                height: '500px'
              } : {}}
            >
            {enrolledCourses.map((course) => {
              const competencies = competencyByCourse[course.id] || {};
              return (
                  <div 
                    key={course.id} 
                    className={`border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex-shrink-0 ${
                      enrolledCourses.length === 1 ? 'w-full' : ''
                    }`}
                  >
                    <h3 className="font-semibold text-sm text-gray-800 dark:text-white mb-3">
                    {course.name}
                  </h3>
                    <div className="space-y-2.5">
                    {Object.entries(competencies).map(([name, score]) => {
                      const levelInfo = getLevel(score);
                      return (
                          <div key={name} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate flex-1">
                              {name}
                            </span>
                              <span className={`text-xs font-bold ${levelInfo.textColor} ml-2 flex-shrink-0`}>
                              {score}%
                            </span>
                          </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                            <div
                                className={`h-1.5 rounded-full transition-all ${levelInfo.color}`}
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                            <div className="flex items-center justify-between">
                          <span className={`text-xs ${levelInfo.textColor} font-semibold`}>
                            {levelInfo.level}
                          </span>
                            </div>
                        </div>
                      );
                    })}
                  </div>
            </div>
              );
            })}
            </div>
          </div>

          {/* Gợi ý bạn bè */}
          <div className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md ${
            enrolledCourses.length === 1 
              ? 'lg:col-span-3' 
              : ''
          }`}>
            <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
              👥 Gợi ý Kết bạn
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 text-center">
              Dựa trên năng lực và sở thích học tập tương đồng
            </p>
            <div className="space-y-3" style={{ height: '500px', maxHeight: '500px', overflowY: 'auto' }}>
              {friendSuggestions.slice(0, 3).map((friend) => (
                <div 
                  key={friend.id} 
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:shadow-md transition-shadow bg-white dark:bg-gray-700"
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={friend.avatar}
                      alt={friend.name}
                      className="w-12 h-12 rounded-full border-2 border-primary-300 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-gray-800 dark:text-white truncate">
                            {friend.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">MSSV: {friend.mssv}</p>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <div className="text-sm font-bold text-primary-500">
                            {friend.matchingScore}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-1">
                        <span className={`badge text-xs ${
                          friend.level === 'Advanced' ? 'bg-danger-100 text-danger-800' :
                          friend.level === 'Intermediate' ? 'bg-warning-100 text-warning-800' :
                          'bg-success-100 text-success-800'
                        }`}>
                          {friend.level}
                        </span>
                        <span className="badge bg-primary-100 text-primary-800 text-xs">
                          ⭐ {friend.averageScore}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        <strong>Môn chung:</strong> {friend.commonCourses.slice(0, 1).join(', ')}
                        {friend.commonCourses.length > 1 && '...'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button className="btn-primary text-xs flex-1 py-1.5">
                      👋 Kết bạn
                    </button>
                    <button className="btn-secondary text-xs py-1.5">
                      📄
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-3">
              <button 
                onClick={() => setCurrentPage('profile')}
                className="text-xs text-primary-500 hover:text-primary-700 font-medium"
              >
                Xem thêm →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hàng 3: Đánh giá tổng hợp theo tiêu chí/năng lực */}
      {enrolledCourses.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
            🎯 Đánh giá tổng hợp theo tiêu chí/năng lực
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(competencyAssessment).map(([key, assessment]) => {
              const levelInfo = getLevel(assessment.score);
              return (
                <div
                  key={key}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                      {key}
                    </h3>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      levelInfo.level === 'Giỏi' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                      levelInfo.level === 'Khá' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' :
                      levelInfo.level === 'Trung bình' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                    }`}>
                      {assessment.level}
                    </span>
                  </div>
                    <div className="mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-600 dark:text-gray-400">Tỉ lệ đạt</span>
                        <span className="text-lg font-bold text-primary-500 dark:text-primary-400">
                          {assessment.score}%
                        </span>
                      </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full ${levelInfo.color}`}
                        style={{ width: `${assessment.score}%` }}
                    ></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {assessment.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500">
                    <span className="font-semibold">Môn học:</span> {assessment.courses.join(', ')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Thông báo khi chưa có khóa học */}
      {enrolledCourses.length === 0 && (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            Chưa có khóa học nào được đăng ký
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
