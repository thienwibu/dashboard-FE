import React, { useState, useEffect, useRef } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { availableCourses, generateProgressData, courseExercises, organizeExercisesByLevel, calculateLevelProgress } from '../data/data';
import Toast from '../components/Toast';

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

const Courses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    // Khởi tạo state từ sessionStorage ngay từ đầu
    const saved = sessionStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [showEnrollModal, setShowEnrollModal] = useState(null);
  const [toast, setToast] = useState(null);
  const isFirstRender = useRef(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedCourseForLessons, setSelectedCourseForLessons] = useState(null);
  const [learningLessons, setLearningLessons] = useState({}); // { lessonId: { startTime, timer } }
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = sessionStorage.getItem('completedLessons');
    return saved ? JSON.parse(saved) : [];
  });
  const [gaugeReady, setGaugeReady] = useState(false);

  // Initialize Highcharts More module khi component mount (cần cho gauge chart)
  useEffect(() => {
    initMoreModule().then(() => {
      setGaugeReady(true);
    });
  }, []);

  // Lấy thông tin user hiện tại
  useEffect(() => {
    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  // Save to sessionStorage whenever enrolledCourses changes (bỏ qua lần render đầu tiên)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    sessionStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
  }, [enrolledCourses]);


  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c.id === courseId);
  };

  const handleEnroll = (course) => {
    setShowEnrollModal(course);
  };

  const confirmEnroll = () => {
    if (showEnrollModal) {
      const newCourse = {
        ...showEnrollModal,
        enrolledDate: new Date().toISOString(),
        progress: 0,
        grade: 0,
        attendance: 0,
        assignments: {
          completed: 0,
          total: 15
        },
        topics: showEnrollModal.topics.map(topic => ({
          ...topic,
          progress: 0,
          status: 'not-started'
        }))
      };
      setEnrolledCourses([...enrolledCourses, newCourse]);
      setShowEnrollModal(null);
      
      // Show success notification
      setToast({
        message: `Đăng ký thành công khóa học: ${showEnrollModal.name}`,
        type: 'success'
      });
    }
  };

  const handleStartLearning = (courseId) => {
    const course = availableCourses.find(c => c.id === courseId);
    if (course) {
      setSelectedCourseForLessons(course);
    }
  };

  // Xử lý bắt đầu học bài
  const handleStartLesson = (lessonId) => {
    const startTime = Date.now();
    const lesson = Object.values(courseLessons).flat().find(l => l.id === lessonId);
    if (!lesson) return;

    // Đếm ngược 5 phút (300 giây) cho demo
    const demoTime = 300; // 5 phút = 300 giây
    let remaining = demoTime;

    // Tạo timer
    const timer = setInterval(() => {
      remaining -= 1;
      
      setLearningLessons(prev => {
        if (prev[lessonId]) {
          return {
            ...prev,
            [lessonId]: {
              ...prev[lessonId],
              remainingTime: remaining
            }
          };
        }
        return prev;
      });

      if (remaining <= 0) {
        clearInterval(timer);
        // Tự động hoàn thành bài học
        handleCompleteLesson(lessonId);
      }
    }, 1000);

    // Set trạng thái đang học với timer
    setLearningLessons(prev => ({
      ...prev,
      [lessonId]: {
        startTime,
        remainingTime: demoTime,
        lesson,
        timer
      }
    }));
  };

  // Tính tiến độ khóa học dựa trên số bài học đã hoàn thành
  const calculateCourseProgress = (courseId, completedLessonsList) => {
    const lessons = courseLessons[courseId] || [];
    if (lessons.length === 0) return 0;
    
    const completedCount = lessons.filter(l => completedLessonsList.includes(l.id)).length;
    return Math.round((completedCount / lessons.length) * 100);
  };

  // Update tiến độ khóa học trong enrolledCourses
  const updateCourseProgress = (courseId, completedLessonsList) => {
    const newProgress = calculateCourseProgress(courseId, completedLessonsList);
    setEnrolledCourses(prev => {
      const updated = prev.map(course => 
        course.id === courseId 
          ? { ...course, progress: newProgress }
          : course
      );
      // Lưu vào sessionStorage ngay lập tức
      sessionStorage.setItem('enrolledCourses', JSON.stringify(updated));
      // Dispatch custom event để Dashboard có thể cập nhật
      window.dispatchEvent(new Event('coursesUpdated'));
      return updated;
    });
  };

  // Xử lý hoàn thành bài học
  const handleCompleteLesson = (lessonId) => {
    // Xóa khỏi learningLessons
    setLearningLessons(prev => {
      const newState = { ...prev };
      if (newState[lessonId]?.timer) {
        clearInterval(newState[lessonId].timer);
      }
      delete newState[lessonId];
      return newState;
    });

    // Thêm vào completedLessons
    if (!completedLessons.includes(lessonId)) {
      const newCompleted = [...completedLessons, lessonId];
      setCompletedLessons(newCompleted);
      sessionStorage.setItem('completedLessons', JSON.stringify(newCompleted));
      
      // Tìm courseId từ lesson
      const lesson = Object.values(courseLessons).flat().find(l => l.id === lessonId);
      if (lesson) {
        // Update tiến độ khóa học với danh sách completed mới
        updateCourseProgress(lesson.courseId, newCompleted);
      }
    }

    setToast({
      message: 'Hoàn thành bài học!',
      type: 'success'
    });
  };

  // Format thời gian đếm ngược
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup timers khi component unmount
  useEffect(() => {
    return () => {
      Object.values(learningLessons).forEach(lesson => {
        if (lesson.timer) {
          clearInterval(lesson.timer);
        }
      });
    };
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'Advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCourses = availableCourses.filter(course => {
    if (filterStatus === 'enrolled') return isEnrolled(course.id);
    if (filterStatus === 'available') return !isEnrolled(course.id);
    return true;
  });

  // Tạo dữ liệu cho biểu đồ tiến độ (mỗi khóa học 1 đường)
  const progressData = enrolledCourses.length > 0 
    ? generateProgressData(enrolledCourses) 
    : [];

  // Màu sắc cho từng khóa học
  const courseColors = [
    '#3f51b5', // Primary Blue
    '#ff9800', // Accent Orange
    '#22c55e', // Success Green
    '#ef4444', // Danger Red
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f59e0b'  // Warning Amber
  ];

  // Nếu đang xem bài học, hiển thị trang bài học
  // Vertical Timeline - Gợi ý bài tập theo level
  if (selectedCourseForLessons) {
    const courseId = selectedCourseForLessons.id;
    const levels = organizeExercisesByLevel(courseId);
    
    // Lấy danh sách bài tập đã hoàn thành
    const savedCompleted = typeof window !== 'undefined' 
      ? JSON.parse(sessionStorage.getItem('completedExercises') || '[]')
      : [];
    
    // Tính tiến độ cho từng level
    const levelsWithProgress = levels.map(level => {
      const progress = calculateLevelProgress(courseId, level.levelNumber);
      const completedCount = level.exercises.filter(ex => 
        savedCompleted.includes(ex.id) || ex.completed
      ).length;
      
      return {
        ...level,
        progress,
        completedCount,
        totalCount: level.exercises.length
      };
    });
    
    // Xác định level nào được unlock (level đầu tiên luôn unlock, level tiếp theo unlock khi đạt >70%)
    const unlockedLevels = [];
    for (let i = 0; i < levelsWithProgress.length; i++) {
      const level = levelsWithProgress[i];
      if (i === 0) {
        // Level đầu tiên luôn unlock
        unlockedLevels.push({ ...level, isUnlocked: true });
      } else {
        // Level tiếp theo unlock khi level trước đạt >70%
        const prevLevel = levelsWithProgress[i - 1];
        const isUnlocked = prevLevel.progress > 70;
        unlockedLevels.push({ ...level, isUnlocked });
      }
    }
    
    // Xác định level nào cần gợi ý bài tập bổ sung (<70%)
    const needsMorePractice = unlockedLevels.filter(level => 
      level.isUnlocked && level.progress < 70
    );

    return (
      <div className="space-y-6">
        {/* Toast Notification */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}

        {/* Button Quay lại và Tiêu đề */}
        <div className="relative">
          <button
            onClick={() => setSelectedCourseForLessons(null)}
            className="btn-secondary flex items-center gap-2 bg-primary-50 hover:bg-primary-100 text-primary-700 border-primary-200"
          >
            <span>←</span> Quay lại
          </button>
          <div className="text-center mt-4">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              🎯 Lộ trình Bài tập: {selectedCourseForLessons.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {selectedCourseForLessons.code} • {selectedCourseForLessons.instructor}
            </p>
          </div>
        </div>

        {/* Cảnh báo nếu cần luyện thêm */}
        {needsMorePractice.length > 0 && (
          <div className="card bg-warning-50 dark:bg-warning-900/20 border-l-4 border-warning-500">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="font-bold text-warning-800 dark:text-warning-200 mb-2">
                  Cần luyện tập thêm!
                </h3>
                <p className="text-sm text-warning-700 dark:text-warning-300">
                  Bạn cần đạt trên 70% ở {needsMorePractice.map(l => l.name).join(', ')} để mở khóa level tiếp theo.
                  Hãy làm thêm các bài tập ở level này để cải thiện kỹ năng!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Vertical Timeline */}
        <div className="card">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
            
            <div className="space-y-8">
              {unlockedLevels.map((level, index) => {
                const isLocked = !level.isUnlocked;
                const progressColor = level.progress >= 70 ? 'bg-green-500' : 
                                     level.progress >= 50 ? 'bg-yellow-500' : 'bg-red-500';
                
                return (
                  <div key={level.levelNumber} className="relative flex items-start gap-6">
                    {/* Timeline dot */}
                    <div className={`relative z-10 flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                      isLocked 
                        ? 'bg-gray-300 dark:bg-gray-600' 
                        : level.progress >= 70 
                          ? 'bg-green-500' 
                          : level.progress >= 50 
                            ? 'bg-yellow-500' 
                            : 'bg-red-500'
                    }`}>
                      {isLocked ? (
                        <span className="text-2xl">🔒</span>
                      ) : level.progress === 100 ? (
                        <span className="text-2xl">✓</span>
                      ) : (
                        <span className="text-white font-bold text-lg">{level.levelNumber}</span>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className={`flex-1 pb-8 ${index < unlockedLevels.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                      <div className="card">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className={`text-xl font-bold mb-2 ${
                              isLocked 
                                ? 'text-gray-400 dark:text-gray-500' 
                                : 'text-gray-800 dark:text-white'
                            }`}>
                              {level.name}
                            </h3>
                            {!isLocked && (
                              <div className="mb-3">
                                <div className="flex justify-between items-center mb-2">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Tiến độ: {level.completedCount}/{level.totalCount} bài tập
                                  </span>
                                  <span className={`text-sm font-bold ${
                                    level.progress >= 70 ? 'text-green-600' :
                                    level.progress >= 50 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {level.progress}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${progressColor}`}
                                    style={{ width: `${level.progress}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}
                            {isLocked && (
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                🔒 Hoàn thành trên 70% ở level trước để mở khóa
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Danh sách bài tập */}
                        {!isLocked && (
                          <div className="space-y-3">
                            {level.exercises.map((exercise) => {
                              const isCompleted = savedCompleted.includes(exercise.id) || exercise.completed;
                              
                              return (
                                <div
                                  key={exercise.id}
                                  className={`p-4 rounded-lg border-2 ${
                                    isCompleted
                                      ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                                  } transition-all`}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <h4 className={`font-semibold ${
                                          isCompleted 
                                            ? 'text-green-800 dark:text-green-200' 
                                            : 'text-gray-800 dark:text-white'
                                        }`}>
                                          {exercise.title}
                                        </h4>
                                        {isCompleted && (
                                          <span className="badge bg-green-100 text-green-800">
                                            ✓ Hoàn thành
                                          </span>
                                        )}
                                        <span className={`badge ${
                                          exercise.level === 'Easy' ? 'bg-green-100 text-green-800' :
                                          exercise.level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                          'bg-red-100 text-red-800'
                                        }`}>
                                          {exercise.level}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {exercise.description}
                                      </p>
                                      <div className="flex flex-wrap gap-2">
                                        {exercise.skills.map((skill, idx) => (
                                          <span key={idx} className="text-xs px-2 py-1 bg-primary-100 text-primary-800 rounded">
                                            {skill}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                    <div className="ml-4">
                                      {isCompleted ? (
                                        <button
                                          disabled
                                          className="btn btn-success opacity-75 cursor-not-allowed text-sm"
                                        >
                                          ✓ Hoàn thành
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => {
                                            // TODO: Navigate to exercise page
                                            setToast({
                                              message: `Bắt đầu làm bài: ${exercise.title}`,
                                              type: 'info'
                                            });
                                          }}
                                          className="btn btn-primary text-sm"
                                        >
                                          🚀 Làm bài
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Timeline bài tập theo level - thay thế phần khóa học cũ
  // TODO: Implement Timeline component

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Danh sách Khóa học</h1>
          <p className="text-gray-600">Đăng ký và quản lý các khóa học của bạn</p>
        </div>
        
        {/* Filter */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tất cả ({availableCourses.length})
          </button>
          <button
            onClick={() => setFilterStatus('enrolled')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'enrolled'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Đã đăng ký ({enrolledCourses.length})
          </button>
          <button
            onClick={() => setFilterStatus('available')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filterStatus === 'available'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Chưa đăng ký ({availableCourses.length - enrolledCourses.length})
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {enrolledCourses.length}
          </div>
          <div className="text-sm text-gray-600">Khóa học đã đăng ký</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {enrolledCourses.filter(c => c.progress === 100).length}
          </div>
          <div className="text-sm text-gray-600">Khóa học hoàn thành</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {enrolledCourses.reduce((sum, c) => sum + c.credits, 0)}
          </div>
          <div className="text-sm text-gray-600">Tổng tín chỉ đang học</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {enrolledCourses.length > 0 
              ? Math.round(enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / enrolledCourses.length)
              : 0}%
          </div>
          <div className="text-sm text-gray-600">Tiến độ trung bình</div>
        </div>
      </div>

      {/* Progress Chart - Gauge Chart */}
      {enrolledCourses.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Tiến độ các Khóa học Đã Đăng ký</h2>
          {gaugeReady ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {enrolledCourses.map((course) => {
                const progress = course.progress || 0;
                const gaugeSize = 220; // Kích thước cho 4 cột trên 1 hàng
                
                  return (
                  <div key={course.id} className="flex flex-col items-center justify-center p-2">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2 text-center text-base">
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
          )}
        </div>
      )}


      {/* Empty State */}
      {enrolledCourses.length === 0 && filterStatus === 'enrolled' && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có khóa học nào</h3>
          <p className="text-gray-600 mb-4">Bạn chưa đăng ký khóa học nào. Hãy chọn khóa học phù hợp để bắt đầu học!</p>
          <button
            onClick={() => setFilterStatus('available')}
            className="btn-primary"
          >
            Xem khóa học có sẵn
          </button>
        </div>
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCourses.map((course) => {
          const enrolled = isEnrolled(course.id);
          const enrolledCourse = enrolledCourses.find(c => c.id === course.id);
          
          return (
            <div
              key={course.id}
              className="card hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="text-4xl">{course.thumbnail}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <h3 className="text-lg font-bold text-gray-800">{course.name}</h3>
                      {enrolled && (
                        <span className="badge bg-green-100 text-green-800">
                          ✓ Đã đăng ký
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>{course.code}</strong> • {course.credits} tín chỉ
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge ${getDifficultyColor(course.difficulty)}`}>
                  {course.difficulty}
                </span>
                <span className="badge bg-blue-100 text-blue-800">
                  {course.category}
                </span>
              </div>

              <div className="h-16 mb-4 overflow-hidden">
                <p className="text-sm text-gray-700 line-clamp-3">{course.description}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    👨‍🏫 {course.instructor}
                  </div>
                  <div className="flex items-center text-gray-600">
                    👥 {course.enrolled}/{course.maxStudents} SV
                  </div>
                  <div className="flex items-center text-gray-600">
                    📅 {course.schedule}
                  </div>
                  <div className="flex items-center text-gray-600">
                    🏫 {course.room}
                  </div>
                </div>

                {enrolled && enrolledCourse && (
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">Tiến độ học tập</span>
                      <span className="text-sm font-bold text-gray-800">{enrolledCourse.progress}%</span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          enrolledCourse.progress === 100 ? 'bg-green-500' : 
                          enrolledCourse.progress >= 50 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${enrolledCourse.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                {enrolled ? (
                  <button
                    onClick={() => handleStartLearning(course.id)}
                    className="flex-1 btn-primary text-sm"
                  >
                    🎓 Vào học
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="flex-1 btn-secondary text-sm"
                    >
                      📄 Chi tiết
                    </button>
                  <button
                    onClick={() => handleEnroll(course)}
                    className="flex-1 btn-accent text-sm"
                  >
                    ✅ Đăng ký ngay
                  </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Detail Modal */}
      {selectedCourse && (
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-t-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="text-5xl">{selectedCourse.thumbnail}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedCourse.name}</h2>
                    <p className="text-blue-100 mb-2">
                      {selectedCourse.code} • {selectedCourse.credits} tín chỉ • {selectedCourse.semester}
                    </p>
                    <p className="text-blue-100">👨‍🏫 {selectedCourse.instructor}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-white hover:text-gray-200 text-3xl font-bold ml-4"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Mô tả khóa học</h3>
                <p className="text-gray-700 dark:text-gray-300">{selectedCourse.description}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-lg border-2 border-blue-200 dark:border-blue-800" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)' }}>
                  <div className="text-2xl font-bold text-primary-500 dark:text-primary-400">{selectedCourse.credits}</div>
                  <div className="text-xs font-semibold text-blue-700 dark:text-gray-400 mt-1">Tín chỉ</div>
                </div>
                <div className="text-center p-4 rounded-lg border-2 border-purple-200 dark:border-purple-800" style={{ background: 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)' }}>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedCourse.enrolled}/{selectedCourse.maxStudents}</div>
                  <div className="text-xs font-semibold text-purple-700 dark:text-gray-400 mt-1">Sinh viên</div>
                </div>
                <div className="text-center p-4 rounded-lg border-2 border-orange-200 dark:border-orange-800" style={{ background: 'linear-gradient(135deg, #ffedd5 0%, #fed7aa 100%)' }}>
                  <div className={`text-sm font-bold px-3 py-1 rounded-full inline-block ${getDifficultyColor(selectedCourse.difficulty)}`}>
                    {selectedCourse.difficulty}
                  </div>
                  <div className="text-xs font-semibold text-orange-700 dark:text-gray-400 mt-1">Độ khó</div>
                </div>
              </div>

              {/* Topics */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">Nội dung Khóa học</h3>
                <div className="space-y-3">
                  {selectedCourse.topics.map((topic, idx) => (
                    <div 
                      key={idx} 
                      className="topic-item rounded-lg p-4 hover:shadow-lg transition-all hover:scale-[1.02] border-l-4 border-primary-500 dark:border-primary-400 dark:bg-gray-700/50"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="topic-number flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 dark:text-white mb-1">{topic.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{topic.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Info */}
              <div className="rounded-lg p-5 border-2 border-indigo-200 dark:border-gray-700" style={{ background: 'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 100%)' }}>
                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <span className="mr-2">📋</span> Thông tin Lịch học
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">📅 Lịch học:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{selectedCourse.schedule}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">🏫 Phòng học:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{selectedCourse.room}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">📚 Loại môn:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{selectedCourse.category}</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-700/50 p-3 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">📊 Học kỳ:</span>
                    <span className="font-bold text-gray-800 dark:text-white">{selectedCourse.semester}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setSelectedCourse(null)}
                className="btn-secondary"
              >
                Đóng
              </button>
              {isEnrolled(selectedCourse.id) ? (
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    handleStartLearning(selectedCourse.id);
                  }}
                  className="btn-primary"
                >
                  🎓 Xem Timeline
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSelectedCourse(null);
                    handleEnroll(availableCourses.find(c => c.id === selectedCourse.id));
                  }}
                  className="btn-accent"
                >
                  ✅ Đăng ký khóa học
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Enroll Confirmation Modal */}
      {showEnrollModal && (
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{showEnrollModal.thumbnail}</div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Xác nhận Đăng ký</h2>
                <p className="text-gray-600 dark:text-gray-400">Bạn có chắc chắn muốn đăng ký khóa học:</p>
                <p className="font-bold text-primary-600 dark:text-primary-400 mt-2">{showEnrollModal.name}</p>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 dark:border-blue-400 p-4 rounded-r-lg mb-4">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Thông tin:</strong>
                </p>
                <ul className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                  <li>• Mã môn: {showEnrollModal.code}</li>
                  <li>• Tín chỉ: {showEnrollModal.credits}</li>
                  <li>• Giảng viên: {showEnrollModal.instructor}</li>
                  <li>• Lịch học: {showEnrollModal.schedule}</li>
                </ul>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setShowEnrollModal(null)}
                className="btn-secondary"
              >
                Hủy
              </button>
              <button
                onClick={confirmEnroll}
                  className="btn-accent"
              >
                ✅ Xác nhận đăng ký
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Courses;
