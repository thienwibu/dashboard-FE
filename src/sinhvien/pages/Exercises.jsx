import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { courseExercises, learningPath, competencyByCourse, softSkills } from '../data/data';

const Exercises = () => {
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [showSubmitModal, setShowSubmitModal] = useState(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(null);
  const [submissionCode, setSubmissionCode] = useState('');
  const [feedbackCode, setFeedbackCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [feedbackResult, setFeedbackResult] = useState(null);
  
  // Khởi tạo state từ sessionStorage ngay từ đầu
  const [enrolledCourses, setEnrolledCourses] = useState(() => {
    const saved = sessionStorage.getItem('enrolledCourses');
    return saved ? JSON.parse(saved) : [];
  });

  // Hàm tính điểm phù hợp dựa trên năng lực
  const calculateFitPercent = (exercise) => {
    if (!exercise.criteria || exercise.criteria.length === 0) {
      return exercise.fitPercent || 0;
    }

    const courseCompetencies = competencyByCourse[exercise.courseId] || {};
    let totalScore = 0;
    let criteriaCount = 0;

    exercise.criteria.forEach(criterion => {
      // Tìm điểm năng lực tương ứng
      const competencyScore = courseCompetencies[criterion] || 0;
      totalScore += competencyScore;
      criteriaCount++;
    });

    // Tính điểm trung bình
    const avgScore = criteriaCount > 0 ? totalScore / criteriaCount : 0;
    
    // Điều chỉnh dựa trên độ khó của bài tập
    let difficultyMultiplier = 1;
    if (exercise.level === 'Easy') difficultyMultiplier = 1.1;
    else if (exercise.level === 'Medium') difficultyMultiplier = 1.0;
    else if (exercise.level === 'Hard') difficultyMultiplier = 0.9;

    // Tính fitPercent (0-100)
    const fitPercent = Math.min(100, Math.round(avgScore * difficultyMultiplier));
    return fitPercent;
  };

  // Lấy tất cả bài tập từ các khóa học đã đăng ký và tính lại fitPercent
  const allExercises = enrolledCourses.flatMap(course => {
    const exercises = courseExercises[course.id] || [];
    return exercises.map(ex => ({
      ...ex,
      calculatedFitPercent: calculateFitPercent(ex),
      isRecommended: calculateFitPercent(ex) >= 80 // Gợi ý nếu >= 80%
    }));
  });

  // Sắp xếp theo độ phù hợp giảm dần
  const sortedExercises = [...allExercises].sort((a, b) => 
    b.calculatedFitPercent - a.calculatedFitPercent
  );

  const filteredExercises = sortedExercises.filter((exercise) => {
    const levelMatch = selectedLevel === 'all' || exercise.level === selectedLevel;
    const courseMatch = selectedCourse === 'all' || exercise.courseId === parseInt(selectedCourse);
    return levelMatch && courseMatch;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 'Easy':
        return 'bg-success-100 text-success-800';
      case 'Medium':
        return 'bg-warning-100 text-warning-800';
      case 'Hard':
        return 'bg-danger-100 text-danger-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Mock API: Chấm điểm tự động
  const handleSubmit = async (exercise) => {
    if (!submissionCode.trim()) {
      alert('Vui lòng nhập code của bạn!');
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    // Mock API call - sẽ thay bằng API thật sau
    setTimeout(() => {
      const mockResult = {
        score: Math.floor(Math.random() * 3) + 8, // 8-10 điểm
        totalScore: 10,
        testsPassed: Math.floor(Math.random() * 3) + 8, // 8-10
        testsTotal: 10,
        passed: Math.random() > 0.3, // 70% pass rate
        executionTime: (Math.random() * 200 + 50).toFixed(2) + 'ms',
        submittedAt: new Date().toLocaleString('vi-VN')
      };
      setSubmissionResult(mockResult);
      setIsSubmitting(false);
    }, 2000);
  };

  // Mock API: Feedback AI
  const handleGetFeedback = async (exercise) => {
    if (!feedbackCode.trim()) {
      alert('Vui lòng nhập code của bạn!');
      return;
    }

    setIsGettingFeedback(true);
    setFeedbackResult(null);

    // Mock API call - sẽ thay bằng API thật sau
    setTimeout(() => {
      const mockFeedback = {
        overallScore: Math.floor(Math.random() * 3) + 7, // 7-10
        criteriaScores: exercise.criteria.map(criterion => ({
          criterion,
          score: Math.floor(Math.random() * 3) + 7,
          maxScore: 10,
          feedback: `Bạn đã thể hiện tốt về ${criterion}. Có thể cải thiện thêm về cách tổ chức code.`
        })),
        errors: [
          {
            type: 'Logic Error',
            description: 'Vòng lặp không xử lý trường hợp mảng rỗng',
            suggestion: 'Thêm kiểm tra if (array.length === 0) return null;'
          }
        ],
        suggestions: [
          'Nên thêm comment để giải thích logic phức tạp',
          'Có thể tối ưu hóa bằng cách sử dụng built-in functions',
          'Code style tốt, dễ đọc'
        ],
        submittedAt: new Date().toLocaleString('vi-VN')
      };
      setFeedbackResult(mockFeedback);
      setIsGettingFeedback(false);
    }, 2500);
  };

  const closeSubmitModal = () => {
    setShowSubmitModal(null);
    setSubmissionCode('');
    setSubmissionResult(null);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(null);
    setFeedbackCode('');
    setFeedbackResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bài tập Gợi ý</h1>
        <p className="text-gray-600">Danh sách bài tập được cá nhân hóa dựa trên khóa học của bạn</p>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có bài tập</h3>
          <p className="text-gray-600 mb-4">
            Bạn cần đăng ký khóa học trước để có bài tập gợi ý
          </p>
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="card">
            <div className="flex flex-wrap gap-4 items-center">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Khóa học:</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[200px]"
                >
                  <option value="all">Tất cả khóa học</option>
                  {enrolledCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Độ khó:</label>
                <div className="flex gap-2">
                  {['all', 'Easy', 'Medium', 'Hard'].map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedLevel === level
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {level === 'all' ? 'Tất cả' : level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">{allExercises.length}</div>
              <div className="text-sm text-gray-600">Tổng số bài tập</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-success-500 mb-2">
                {allExercises.filter(e => e.completed).length}
              </div>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-accent-500 mb-2">
                {allExercises.filter(e => !e.completed).length}
              </div>
              <div className="text-sm text-gray-600">Còn lại</div>
            </div>
            <div className="card text-center">
              <div className="text-3xl font-bold text-primary-500 mb-2">
                {allExercises.filter(e => e.isRecommended).length}
              </div>
              <div className="text-sm text-gray-600">Gợi ý cho bạn</div>
            </div>
          </div>

          {/* Exercise Cards by Course */}
          {selectedCourse === 'all' ? (
            // Nhóm theo khóa học
            enrolledCourses.map(course => {
              const courseExs = courseExercises[course.id] || [];
              const courseExsWithFit = courseExs.map(ex => ({
                ...ex,
                calculatedFitPercent: calculateFitPercent(ex),
                isRecommended: calculateFitPercent(ex) >= 80
              }));
              const filteredCourseExs = courseExsWithFit
                .filter(ex => selectedLevel === 'all' || ex.level === selectedLevel)
                .sort((a, b) => b.calculatedFitPercent - a.calculatedFitPercent);

              if (filteredCourseExs.length === 0) return null;

              return (
                <div key={course.id} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                      {course.thumbnail} {course.name}
                    </h2>
                    <button
                      onClick={() => {
                        // TODO: Gọi API tính lại năng lực và gợi ý bài tập
                        alert('Đang tính lại năng lực và gợi ý bài tập...');
                        // Simulate API call
                        setTimeout(() => {
                          alert('Đã tính lại năng lực và cập nhật gợi ý bài tập!');
                        }, 1500);
                      }}
                      className="btn-primary text-sm px-4 py-2"
                    >
                      🔄 Tính lại
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCourseExs.map((exercise) => (
                      <div key={exercise.id} className="card hover:scale-[1.02] transition-transform relative">
                        {exercise.isRecommended && (
                          <div className="absolute top-4 right-4 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            ⭐ Gợi ý cho bạn
                          </div>
                        )}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-2">{exercise.title}</h3>
                            <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                          </div>
                          {exercise.completed && (
                            <span className="text-2xl ml-2">✅</span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          <span className={`badge ${getLevelColor(exercise.level)}`}>
                            {exercise.level}
                          </span>
                          <span className="badge bg-primary-100 text-primary-800">
                            {exercise.calculatedFitPercent}% phù hợp
                          </span>
                          <span className="badge bg-accent-100 text-accent-800">
                            {exercise.points} điểm
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {exercise.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">⏱️ {exercise.estimatedTime}</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={() => setShowSubmitModal(exercise)}
                              className="btn-primary text-sm flex-1"
                            >
                              {exercise.completed ? 'Nộp lại' : 'Nộp bài'}
                            </button>
                            <button 
                              onClick={() => setShowFeedbackModal(exercise)}
                              className="btn-accent text-sm flex-1"
                            >
                              AI Feedback
                          </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            // Hiển thị bài tập của khóa học được chọn
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredExercises.map((exercise) => (
                <div key={exercise.id} className="card hover:scale-[1.02] transition-transform relative">
                  {exercise.isRecommended && (
                    <div className="absolute top-4 right-4 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      ⭐ Gợi ý cho bạn
                    </div>
                  )}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{exercise.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                    </div>
                    {exercise.completed && (
                      <span className="text-2xl ml-2">✅</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className={`badge ${getLevelColor(exercise.level)}`}>
                      {exercise.level}
                    </span>
                    <span className="badge bg-primary-100 text-primary-800">
                      {exercise.calculatedFitPercent}% phù hợp
                    </span>
                    <span className="badge bg-accent-100 text-accent-800">
                      {exercise.points} điểm
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {exercise.skills.map((skill, idx) => (
                      <span key={idx} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="flex flex-col gap-2 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">⏱️ {exercise.estimatedTime}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowSubmitModal(exercise)}
                        className="btn-primary text-sm flex-1"
                      >
                        {exercise.completed ? 'Nộp lại' : 'Nộp bài'}
                      </button>
                      <button 
                        onClick={() => setShowFeedbackModal(exercise)}
                        className="btn-accent text-sm flex-1"
                      >
                        AI Feedback
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Kỹ năng Mềm Phát triển */}
          <div className="card bg-primary-50 border-l-4 border-primary-500">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💼 Kỹ năng Mềm Phát triển</h2>
            <p className="text-sm text-gray-600 mb-4">
              Làm bài tập giúp bạn phát triển các kỹ năng mềm quan trọng
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(softSkills).slice(0, 6).map(([skill, score]) => {
                const skillLabels = {
                  communication: 'Giao tiếp',
                  teamwork: 'Làm việc nhóm',
                  timeManagement: 'Quản lý thời gian',
                  problemSolving: 'Giải quyết vấn đề',
                  creativity: 'Sáng tạo',
                  leadership: 'Lãnh đạo'
                };
                const skillIcons = {
                  communication: '💬',
                  teamwork: '👥',
                  timeManagement: '⏰',
                  problemSolving: '🧩',
                  creativity: '🎨',
                  leadership: '👑'
                };
                
                return (
                  <div key={skill} className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{skillIcons[skill]}</span>
                        <span className="text-xs font-medium text-gray-700">{skillLabels[skill]}</span>
                      </div>
                      <span className="text-xs font-bold text-primary-500">{score.toFixed(1)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-primary-500 h-1.5 rounded-full"
                        style={{ width: `${(score / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Learning Path */}
          <div className="card">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Lộ trình Học tập</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-300 hidden md:block"></div>
              <div className="space-y-6">
                {learningPath.map((path, index) => (
                  <div key={path.id} className="relative flex items-start">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold z-10 ${
                        path.status === 'completed'
                          ? 'bg-success-500 text-white'
                          : path.status === 'current'
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {path.status === 'completed' ? '✓' : index + 1}
                    </div>
                    <div className="ml-6 flex-1">
                      <div className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-primary-300 transition-colors">
                        <h3 className="font-bold text-gray-800 mb-1">{path.title}</h3>
                        <p className="text-sm text-gray-600">{path.date}</p>
                        {path.status === 'current' && (
                          <span className="inline-block mt-2 text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded">
                            Đang học
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal: Nộp bài - Chấm điểm Tự động */}
      {showSubmitModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Nộp bài: {showSubmitModal.title}
                </h2>
                <button
                  onClick={closeSubmitModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {!submissionResult ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {/* Nhập code của bạn: */}
                    </label>
                    <textarea
                      value={submissionCode}
                      readOnly
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      disabled
                      className="btn-primary flex-1 opacity-50 cursor-not-allowed"
                    >
                      Nộp bài
                    </button>
                    <button
                      onClick={closeSubmitModal}
                      className="btn-secondary"
                    >
                      Hủy
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg ${submissionResult.passed ? 'bg-success-50 border border-success-200' : 'bg-warning-50 border border-warning-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {submissionResult.passed ? '✅ Đạt' : '⚠️ Đạt một phần'}
                      </h3>
                      <span className="text-2xl font-bold text-primary-500">
                        {submissionResult.score}/{submissionResult.totalScore} điểm
                      </span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-700">Test Cases:</span>
                        <span className="text-sm font-medium text-gray-800">
                          {submissionResult.testsPassed}/{submissionResult.testsTotal} passed
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            submissionResult.passed ? 'bg-success-500' : 'bg-warning-500'
                          }`}
                          style={{ width: `${(submissionResult.testsPassed / submissionResult.testsTotal) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-600">
                      <p>Thời gian thực thi: {submissionResult.executionTime}</p>
                      <p>Nộp lúc: {submissionResult.submittedAt}</p>
                    </div>
                  </div>
                  <button
                    onClick={closeSubmitModal}
                    className="btn-primary w-full"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        , document.body
      )}

      {/* Modal: AI Feedback */}
      {showFeedbackModal && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 99999, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, margin: 0 }}>
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  AI Feedback: {showFeedbackModal.title}
                </h2>
                <button
                  onClick={closeFeedbackModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              {!feedbackResult ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nhập code của bạn để nhận đánh giá:
                    </label>
                    <textarea
                      value={feedbackCode}
                      readOnly
                      className="w-full h-64 p-3 border border-gray-300 rounded-lg font-mono text-sm bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600">
                      <strong>Tiêu chí đánh giá:</strong> {showFeedbackModal.criteria?.join(', ') || 'Không có'}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      disabled
                      className="btn-accent flex-1 opacity-50 cursor-not-allowed"
                    >
                      Nhận Feedback AI
                    </button>
                    <button
                      onClick={closeFeedbackModal}
                      className="btn-secondary"
                    >
                      Hủy
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  {/* Overall Score */}
                  <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-800">Điểm tổng thể</h3>
                      <span className="text-3xl font-bold text-primary-500">
                        {feedbackResult.overallScore}/10
                      </span>
                    </div>
                  </div>

                  {/* Criteria Scores */}
                  {feedbackResult.criteriaScores && feedbackResult.criteriaScores.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Đánh giá theo tiêu chí:</h3>
                      <div className="space-y-3">
                        {feedbackResult.criteriaScores.map((item, idx) => (
                          <div key={idx} className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-800">{item.criterion}</span>
                              <span className="text-lg font-bold text-primary-500">
                                {item.score}/{item.maxScore}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{item.feedback}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {feedbackResult.errors && feedbackResult.errors.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Lỗi phát hiện:</h3>
                      <div className="space-y-2">
                        {feedbackResult.errors.map((error, idx) => (
                          <div key={idx} className="bg-danger-50 border-l-4 border-danger-500 p-3 rounded-r">
                            <div className="flex items-start space-x-2">
                              <span className="text-danger-600 font-medium text-sm">{error.type}:</span>
                              <div className="flex-1">
                                <p className="text-sm text-gray-800 mb-2">{error.description}</p>
                                <div className="bg-primary-50 border-l-4 border-primary-500 p-2 rounded-r">
                                  <p className="text-xs text-primary-800">
                                    💡 <strong>Gợi ý:</strong> {error.suggestion}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestions */}
                  {feedbackResult.suggestions && feedbackResult.suggestions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Gợi ý cải thiện:</h3>
                      <ul className="space-y-2">
                        {feedbackResult.suggestions.map((suggestion, idx) => (
                          <li key={idx} className="flex items-start text-sm text-gray-700">
                            <span className="mr-2">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="text-sm text-gray-600 text-right">
                    Phân tích lúc: {feedbackResult.submittedAt}
                  </div>

                  <button
                    onClick={closeFeedbackModal}
                    className="btn-accent w-full"
                  >
                    Đóng
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        , document.body
      )}
    </div>
  );
};

export default Exercises;
