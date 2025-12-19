import React, { useState, useEffect } from 'react';
import { X, Mail, Phone, Calendar, Clock, Award, TrendingUp, TrendingDown, AlertTriangle, BookOpen, User, ChevronRight } from 'lucide-react';
import dataService from '../../../services/dataService';

const StudentDetailModal = ({ student, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showScoreDetail, setShowScoreDetail] = useState(false);
  const [showCompletionDetail, setShowCompletionDetail] = useState(false);
  const [showHoursDetail, setShowHoursDetail] = useState(false);
  const [showAssignmentDetail, setShowAssignmentDetail] = useState(false);
  const [assignmentFilter, setAssignmentFilter] = useState('all'); // 'all', 'completed', 'missing', 'late'
  const [assignmentStats, setAssignmentStats] = useState(null);

  useEffect(() => {
    if (student && isOpen) {
      // Lấy thống kê bài tập thực tế từ dataService
      const stats = dataService.getStudentAssignmentStats(student.id);
      setAssignmentStats(stats);
      console.log('📊 Assignment stats for', student.name, ':', stats);
    }
  }, [student, isOpen]);

  if (!isOpen || !student) return null;
  
  // Sử dụng stats từ dataService nếu có, fallback về mockData
  const totalAssignments = assignmentStats?.total || student.totalAssignments || 20;
  const completedAssignments = assignmentStats?.submitted || student.completedAssignments || 0;

  // Generate full assignment list based on courses
  const generateFullAssignmentList = () => {
    const allAssignments = [];
    
    // Sử dụng recentAssignments làm base nếu có
    const recentMap = {};
    student.recentAssignments?.forEach(assignment => {
      recentMap[assignment.title] = assignment;
    });
    
    student.courses?.forEach((course, courseIndex) => {
      const totalAssignmentsPerCourse = 10; // Mỗi môn 10 bài
      const completedPerCourse = Math.round(totalAssignmentsPerCourse * (course.progress / 100));
      const lateCount = Math.max(0, Math.round(completedPerCourse * 0.1)); // 10% nộp muộn
      
      // Tạo danh sách bài tập cho môn học này
      for (let i = 1; i <= totalAssignmentsPerCourse; i++) {
        const assignmentTitle = `Bài tập ${i}: ${getAssignmentTitle(course.name, i)}`;
        const isCompleted = i <= completedPerCourse;
        const isLate = isCompleted && i > (completedPerCourse - lateCount);
        
        // Kiểm tra xem có trong recentAssignments không
        const existingAssignment = recentMap[assignmentTitle];
        
        if (existingAssignment) {
          allAssignments.push({
            ...existingAssignment,
            courseName: course.name,
            className: course.className,
            dueDate: `2024-12-${String(i + 5).padStart(2, '0')}`
          });
        } else {
          allAssignments.push({
            id: `${courseIndex}-${i}`,
            title: assignmentTitle,
            courseName: course.name,
            className: course.className,
            status: isCompleted ? (isLate ? 'late' : 'completed') : 'missing',
            score: isCompleted ? Math.max(5, Math.min(10, course.score + (Math.random() * 2 - 1))) : 0,
            submittedDate: isCompleted ? `2024-12-${String(i).padStart(2, '0')}` : null,
            dueDate: `2024-12-${String(i + 5).padStart(2, '0')}`
          });
        }
      }
    });
    
    return allAssignments;
  };

  const getAssignmentTitle = (courseName, index) => {
    const titles = {
      'Nhập môn lập trình': [
        'Biến và kiểu dữ liệu',
        'Cấu trúc điều khiển',
        'Vòng lặp',
        'Hàm và thủ tục',
        'Mảng cơ bản',
        'Chuỗi ký tự',
        'File I/O',
        'Struct',
        'Con trỏ cơ bản',
        'Đồ án cuối kỳ'
      ],
      'Kĩ thuật lập trình': [
        'Con trỏ nâng cao',
        'Cấp phát động',
        'Danh sách liên kết',
        'Stack và Queue',
        'Đệ quy',
        'Thuật toán sắp xếp',
        'Thuật toán tìm kiếm',
        'Xử lý ngoại lệ',
        'Debug và Testing',
        'Dự án nhóm'
      ],
      'Lập trình hướng đối tượng': [
        'Class và Object',
        'Encapsulation',
        'Inheritance',
        'Polymorphism',
        'Abstract Class',
        'Interface',
        'Design Patterns',
        'Exception Handling',
        'Collections',
        'Final Project'
      ],
      'Cấu trúc dữ liệu và giải thuật': [
        'Array và Linked List',
        'Stack và Queue',
        'Tree cơ bản',
        'Binary Search Tree',
        'AVL Tree',
        'Graph',
        'Sorting Algorithms',
        'Search Algorithms',
        'Dynamic Programming',
        'Greedy Algorithms'
      ]
    };
    
    const courseKey = Object.keys(titles).find(key => courseName.includes(key.split(' ')[0]));
    const titleList = titles[courseKey] || titles['Nhập môn lập trình'];
    return titleList[(index - 1) % titleList.length];
  };

  const fullAssignmentList = generateFullAssignmentList();

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'status-badge status-active', text: 'Đang học' },
      at_risk: { class: 'status-badge status-at-risk', text: 'Có nguy cơ' },
      completed: { class: 'status-badge status-completed', text: 'Hoàn thành' },
      dropped: { class: 'status-badge bg-gray-100 text-gray-600', text: 'Đã bỏ học' }
    };
    return statusConfig[status] || statusConfig.active;
  };

  const getRiskBadge = (riskLevel) => {
    const riskConfig = {
      low: { class: 'bg-success-100 text-success-800', text: 'Thấp', icon: '🟢' },
      medium: { class: 'bg-warning-100 text-warning-800', text: 'Trung bình', icon: '🟡' },
      high: { class: 'bg-danger-100 text-danger-800', text: 'Cao', icon: '🔴' }
    };
    return riskConfig[riskLevel] || riskConfig.low;
  };

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: User },
    { id: 'courses', label: 'Khóa học', icon: BookOpen },
    { id: 'assignments', label: 'Bài tập', icon: Award },
    { id: 'notes', label: 'Ghi chú', icon: Calendar }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {student.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-700">{student.name}</h2>
                <p className="text-gray-600">{student.studentId} • {student.email}</p>
                <div className="flex items-center space-x-3 mt-2">
                  <span className={getStatusBadge(student.status).class}>
                    {getStatusBadge(student.status).text}
                  </span>
                  <span className={`status-badge ${getRiskBadge(student.riskLevel).class}`}>
                    {getRiskBadge(student.riskLevel).icon} Rủi ro {getRiskBadge(student.riskLevel).text}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 max-h-96 overflow-y-auto">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Key Metrics - Clickable */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <button 
                    onClick={() => setShowScoreDetail(true)}
                    className="bg-primary-50 p-4 rounded-lg text-center hover:bg-primary-100 transition-colors cursor-pointer group"
                  >
                    <div className="text-2xl font-bold text-primary-600">{(student.averageScore || 0).toFixed(1)}</div>
                    <div className="text-sm text-gray-600">Điểm trung bình</div>
                    <div className="flex items-center justify-center mt-1">
                      {student.scoreChange > 0 ? (
                        <TrendingUp className="h-4 w-4 text-success-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-danger-600" />
                      )}
                      <span className={`text-xs ml-1 ${student.scoreChange > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {Math.abs(student.scoreChange || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="text-xs text-primary-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem chi tiết →
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowCompletionDetail(true)}
                    className="bg-success-50 p-4 rounded-lg text-center hover:bg-success-100 transition-colors cursor-pointer group"
                  >
                    <div className="text-2xl font-bold text-success-600">{student.completionRate}%</div>
                    <div className="text-sm text-gray-600">Hoàn thành</div>
                    <div className="text-xs text-success-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem chi tiết →
                    </div>
                  </button>

                  <button 
                    onClick={() => setShowHoursDetail(true)}
                    className="bg-warning-50 p-4 rounded-lg text-center hover:bg-warning-100 transition-colors cursor-pointer group"
                  >
                    <div className="text-2xl font-bold text-warning-600">{student.totalHours}h</div>
                    <div className="text-sm text-gray-600">Thời gian học</div>
                    <div className="text-xs text-warning-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem chi tiết →
                    </div>
                  </button>

                  <button 
                    onClick={() => {
                      setAssignmentFilter('all');
                      setShowAssignmentDetail(true);
                    }}
                    className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100 transition-colors cursor-pointer group"
                  >
                    <div className="text-2xl font-bold text-gray-600">
                      {completedAssignments}/{totalAssignments}
                    </div>
                    <div className="text-sm text-gray-600">Bài tập</div>
                    <div className="text-xs text-gray-600 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Xem chi tiết →
                    </div>
                  </button>
                </div>

                {/* Contact Information */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-3">Thông tin liên hệ</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Email</div>
                        <div className="font-medium text-gray-700">{student.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div>
                        <div className="text-sm text-gray-600">Điện thoại</div>
                        <div className="font-medium text-gray-700">{student.phone}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Assessment */}
                {student.riskLevel === 'high' && (
                  <div className="bg-danger-50 border border-danger-200 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-danger-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-danger-800">Cảnh báo: Sinh viên có nguy cơ cao</h3>
                        <p className="text-sm text-danger-700 mt-1">
                          Sinh viên này cần được can thiệp ngay lập tức. Điểm số thấp và tỷ lệ hoàn thành kém.
                        </p>
                        <div className="mt-3">
                          <button className="bg-danger-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-danger-700 transition-colors">
                            Tạo kế hoạch can thiệp
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Khóa học đang tham gia</h3>
                {student.courses?.map((course, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">{course.name}</h4>
                      <span className="text-sm text-gray-600">{course.progress}% hoàn thành</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Điểm: {(course.score || 0).toFixed(1)}</span>
                      <span>Lớp: {course.className}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700">Bài tập gần đây</h3>
                {student.recentAssignments?.map((assignment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-700">{assignment.title}</h4>
                      <span className={`text-sm font-medium ${
                        assignment.score >= 8.0 ? 'text-success-600' : 
                        assignment.score >= 6.5 ? 'text-primary-600' :
                        assignment.score >= 5.0 ? 'text-warning-600' :
                        assignment.score >= 4.0 ? 'text-orange-600' :
                        'text-danger-600'
                      }`}>
                        {(assignment.score || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>Nộp: {assignment.submittedDate}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        assignment.status === 'completed' ? 'bg-success-100 text-success-800' :
                        assignment.status === 'late' ? 'bg-warning-100 text-warning-800' :
                        'bg-danger-100 text-danger-800'
                      }`}>
                        {assignment.status === 'completed' ? 'Đúng hạn' :
                         assignment.status === 'late' ? 'Trễ hạn' : 'Chưa nộp'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-700">Ghi chú của giảng viên</h3>
                  <button className="btn-primary text-sm">Thêm ghi chú</button>
                </div>
                <div className="space-y-3">
                  {student.notes?.map((note, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">{note.author}</span>
                        <span className="text-xs text-gray-500">{note.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{note.content}</p>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p>Chưa có ghi chú nào</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Đóng
            </button>
            <button className="btn-primary">
              Cập nhật thông tin
            </button>
          </div>
        </div>
      </div>

      {/* Score Detail Modal */}
      {showScoreDetail && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowScoreDetail(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-700">Chi tiết điểm số - {student.name}</h3>
                <button onClick={() => setShowScoreDetail(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-600">{(student.averageScore || 0).toFixed(2)}</div>
                    <div className="text-gray-600 mt-1">Điểm trung bình tổng</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Điểm từng môn học</h4>
                  {student.courses?.map((course, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">{course.name}</div>
                          <div className="text-sm text-gray-600 mt-1">Lớp: {course.className}</div>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${
                            course.score >= 8.0 ? 'text-success-600' :
                            course.score >= 6.5 ? 'text-primary-600' :
                            course.score >= 5.0 ? 'text-warning-600' :
                            course.score >= 4.0 ? 'text-orange-600' :
                            'text-danger-600'
                          }`}>
                            {(course.score || 0).toFixed(1)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {course.score >= 8.0 ? 'Giỏi' :
                             course.score >= 6.5 ? 'Khá' :
                             course.score >= 5.0 ? 'Trung bình' :
                             course.score >= 4.0 ? 'Yếu' :
                             'Kém'}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Tiến độ</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Phân tích điểm số</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Môn cao nhất</div>
                      <div className="font-medium text-success-600">
                        {student.courses?.reduce((max, c) => c.score > max.score ? c : max, student.courses[0])?.name || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Môn thấp nhất</div>
                      <div className="font-medium text-danger-600">
                        {student.courses?.reduce((min, c) => c.score < min.score ? c : min, student.courses[0])?.name || 'N/A'}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Xu hướng</div>
                      <div className={`font-medium flex items-center ${student.scoreChange > 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {student.scoreChange > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                        {student.scoreChange > 0 ? 'Tăng' : 'Giảm'} {Math.abs(student.scoreChange || 0).toFixed(1)} điểm
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Số môn học</div>
                      <div className="font-medium text-gray-700">{student.courses?.length || 0} môn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completion Detail Modal */}
      {showCompletionDetail && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowCompletionDetail(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-700">Chi tiết tiến độ hoàn thành - {student.name}</h3>
                <button onClick={() => setShowCompletionDetail(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-success-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-success-600">{student.completionRate}%</div>
                    <div className="text-gray-600 mt-1">Tỷ lệ hoàn thành tổng</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Tiến độ từng môn học</h4>
                  {student.courses?.map((course, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-700">{course.name}</div>
                          <div className="text-sm text-gray-600">Lớp: {course.className}</div>
                        </div>
                        <div className={`text-2xl font-bold ${
                          course.progress >= 80 ? 'text-success-600' :
                          course.progress >= 50 ? 'text-warning-600' :
                          'text-danger-600'
                        }`}>
                          {course.progress}%
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className={`h-3 rounded-full transition-all ${
                            course.progress >= 80 ? 'bg-success-600' :
                            course.progress >= 50 ? 'bg-warning-600' :
                            'bg-danger-600'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Điểm hiện tại: <span className="font-medium">{(course.score || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Thống kê bài tập</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <button
                      onClick={() => {
                        setShowCompletionDetail(false);
                        setAssignmentFilter('completed');
                        setShowAssignmentDetail(true);
                      }}
                      className="bg-success-50 p-4 rounded-lg hover:bg-success-100 transition-colors cursor-pointer group"
                    >
                      <div className="text-2xl font-bold text-success-600">{completedAssignments}</div>
                      <div className="text-sm text-gray-600">Đã hoàn thành</div>
                      <div className="text-xs text-success-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem danh sách →
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        setShowCompletionDetail(false);
                        setAssignmentFilter('missing');
                        setShowAssignmentDetail(true);
                      }}
                      className="bg-danger-50 p-4 rounded-lg hover:bg-danger-100 transition-colors cursor-pointer group"
                    >
                      <div className="text-2xl font-bold text-danger-600">
                        {totalAssignments - completedAssignments}
                      </div>
                      <div className="text-sm text-gray-600">Chưa hoàn thành</div>
                      <div className="text-xs text-danger-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        Xem danh sách →
                      </div>
                    </button>
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gray-600">{student.totalAssignments}</div>
                      <div className="text-sm text-gray-600">Tổng số bài</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hours Detail Modal */}
      {showHoursDetail && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowHoursDetail(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-700">Chi tiết thời gian học - {student.name}</h3>
                <button onClick={() => setShowHoursDetail(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-warning-50 p-4 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-warning-600">{student.totalHours}h</div>
                    <div className="text-gray-600 mt-1">Tổng thời gian học</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Thời gian học từng môn</h4>
                  {student.courses?.map((course, index) => {
                    // Calculate hours per course based on progress
                    const courseHours = Math.round((student.totalHours / student.courses.length) * (course.progress / 100));
                    const estimatedTotal = Math.round(student.totalHours / student.courses.length);
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-medium text-gray-700">{course.name}</div>
                            <div className="text-sm text-gray-600">Lớp: {course.className}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-warning-600">{courseHours}h</div>
                            <div className="text-xs text-gray-500">/ ~{estimatedTotal}h</div>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-warning-600 h-2 rounded-full transition-all"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                        <div className="mt-2 flex items-center justify-between text-sm text-gray-600">
                          <span>Tiến độ: {course.progress}%</span>
                          <span>Điểm: {(course.score || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Phân tích thời gian</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Trung bình/môn</div>
                      <div className="font-medium text-gray-700">
                        {Math.round(student.totalHours / (student.courses?.length || 1))}h
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Trung bình/tuần</div>
                      <div className="font-medium text-gray-700">
                        {Math.round(student.totalHours / 12)}h
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Hiệu suất học tập</div>
                      <div className={`font-medium ${
                        student.averageScore >= 8.0 ? 'text-success-600' :
                        student.averageScore >= 6.5 ? 'text-primary-600' :
                        student.averageScore >= 5.0 ? 'text-warning-600' :
                        student.averageScore >= 4.0 ? 'text-orange-600' :
                        'text-danger-600'
                      }`}>
                        {(student.averageScore / (student.totalHours / 20)).toFixed(2)} điểm/10h
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Tổng số môn</div>
                      <div className="font-medium text-gray-700">{student.courses?.length || 0} môn</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assignment Detail Modal */}
      {showAssignmentDetail && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowAssignmentDetail(false)}></div>
            <div className="relative bg-white rounded-lg shadow-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-700">Chi tiết bài tập - {student.name}</h3>
                <button onClick={() => setShowAssignmentDetail(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-success-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-success-600">
                      {fullAssignmentList.filter(a => a.status === 'completed' || a.status === 'late').length}
                    </div>
                    <div className="text-sm text-gray-600">Đã nộp</div>
                  </div>
                  <div className="bg-danger-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-danger-600">
                      {fullAssignmentList.filter(a => a.status === 'missing').length}
                    </div>
                    <div className="text-sm text-gray-600">Chưa nộp</div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-gray-600">{fullAssignmentList.length}</div>
                    <div className="text-sm text-gray-600">Tổng số</div>
                  </div>
                </div>

                {/* Tabs for filtering assignments */}
                <div className="flex space-x-2 border-b border-gray-200 pb-2">
                  <button
                    onClick={() => setAssignmentFilter('all')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      assignmentFilter === 'all'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  <button
                    onClick={() => setAssignmentFilter('completed')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      assignmentFilter === 'completed'
                        ? 'bg-success-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Đã nộp
                  </button>
                  <button
                    onClick={() => setAssignmentFilter('missing')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      assignmentFilter === 'missing'
                        ? 'bg-danger-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Chưa nộp
                  </button>
                  <button
                    onClick={() => setAssignmentFilter('late')}
                    className={`px-4 py-2 rounded-t-lg font-medium transition-colors ${
                      assignmentFilter === 'late'
                        ? 'bg-warning-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Nộp muộn
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-700">
                      {assignmentFilter === 'all' ? 'Danh sách bài tập gần đây' :
                       assignmentFilter === 'completed' ? 'Bài tập đã nộp' :
                       assignmentFilter === 'missing' ? 'Bài tập chưa nộp' :
                       'Bài tập nộp muộn'}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {fullAssignmentList.filter(a => assignmentFilter === 'all' || a.status === assignmentFilter).length} bài tập
                    </span>
                  </div>
                  
                  {fullAssignmentList
                    .filter(a => assignmentFilter === 'all' || a.status === assignmentFilter)
                    .map((assignment, index) => {
                      return (
                        <div key={index} className={`border rounded-lg p-4 hover:shadow-md transition-all ${
                          assignment.status === 'completed' ? 'border-success-200 bg-success-50' :
                          assignment.status === 'late' ? 'border-warning-200 bg-warning-50' :
                          'border-danger-200 bg-danger-50'
                        }`}>
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <BookOpen className="h-4 w-4 text-primary-600" />
                                <span className="text-xs font-medium text-primary-600 bg-primary-100 px-2 py-1 rounded">
                                  {assignment.courseName}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Lớp: {assignment.className}
                                </span>
                              </div>
                              <div className="font-semibold text-gray-700 text-lg">{assignment.title}</div>
                            </div>
                            <div className="text-right ml-4">
                              <div className={`text-3xl font-bold ${
                                assignment.score >= 8.0 ? 'text-success-600' :
                                assignment.score >= 6.5 ? 'text-primary-600' :
                                assignment.score >= 5.0 ? 'text-warning-600' :
                                assignment.score >= 4.0 ? 'text-orange-600' :
                                assignment.score === 0 ? 'text-gray-400' :
                                'text-danger-600'
                              }`}>
                                {assignment.score > 0 ? (assignment.score || 0).toFixed(1) : '-'}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">điểm</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-white bg-opacity-50 p-2 rounded">
                              <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                                <User className="h-3 w-3" />
                                <span>Sinh viên</span>
                              </div>
                              <div className="font-mono text-sm font-semibold text-primary-600">
                                {student.studentId}
                              </div>
                              <div className="text-xs text-gray-600">{student.name}</div>
                            </div>
                            <div className="bg-white bg-opacity-50 p-2 rounded">
                              <div className="flex items-center space-x-1 text-xs text-gray-600 mb-1">
                                <Calendar className="h-3 w-3" />
                                <span>Thời gian nộp</span>
                              </div>
                              <div className="text-sm font-medium text-gray-700">
                                {assignment.submittedDate || 'Chưa nộp'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-white border-opacity-50">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              assignment.status === 'completed' ? 'bg-success-100 text-success-800' :
                              assignment.status === 'late' ? 'bg-warning-100 text-warning-800' :
                              'bg-danger-100 text-danger-800'
                            }`}>
                              {assignment.status === 'completed' ? '✓ Đã nộp đúng hạn' :
                               assignment.status === 'late' ? '⚠ Nộp muộn' : '✗ Chưa nộp bài'}
                            </span>
                            {assignment.status === 'missing' && (
                              <button className="text-sm text-danger-600 hover:text-danger-700 font-medium flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>Nhắc nhở</span>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  {fullAssignmentList.filter(a => assignmentFilter === 'all' || a.status === assignmentFilter).length === 0 && (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg">
                      <Award className="h-16 w-16 mx-auto mb-3 text-gray-300" />
                      <p className="text-lg font-medium">Không có bài tập nào trong danh mục này</p>
                      <p className="text-sm mt-1">Sinh viên đã hoàn thành tốt!</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Bài tập chưa nộp theo môn</h4>
                  {student.courses?.map((course, index) => {
                    const totalAssignmentsPerCourse = 10; // Mỗi môn 10 bài
                    const courseAssignments = fullAssignmentList.filter(a => a.courseName === course.name);
                    const completedPerCourse = courseAssignments.filter(a => a.status === 'completed' || a.status === 'late').length;
                    const missingPerCourse = courseAssignments.filter(a => a.status === 'missing').length;
                    
                    return (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <div className="font-medium text-gray-700">{course.name}</div>
                            <div className="text-sm text-gray-600">Lớp: {course.className}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-gray-700">
                              {completedPerCourse}/{totalAssignmentsPerCourse} bài
                            </div>
                            {missingPerCourse > 0 && (
                              <div className="text-xs text-danger-600 font-medium">
                                Thiếu {missingPerCourse} bài
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              course.progress >= 80 ? 'bg-success-600' :
                              course.progress >= 50 ? 'bg-warning-600' :
                              'bg-danger-600'
                            }`}
                            style={{ width: `${(completedPerCourse / totalAssignmentsPerCourse) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-3">Thống kê nộp bài</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Tỷ lệ nộp đúng hạn</div>
                      <div className="font-medium text-success-600">
                        {Math.round((student.recentAssignments?.filter(a => a.status === 'completed').length / student.recentAssignments?.length) * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Tỷ lệ nộp trễ</div>
                      <div className="font-medium text-warning-600">
                        {Math.round((student.recentAssignments?.filter(a => a.status === 'late').length / student.recentAssignments?.length) * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Điểm trung bình bài tập</div>
                      <div className="font-medium text-gray-700">
                        {(student.recentAssignments?.reduce((sum, a) => sum + a.score, 0) / student.recentAssignments?.filter(a => a.score > 0).length).toFixed(1)}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600">Bài tập chưa nộp</div>
                      <div className="font-medium text-danger-600">
                        {student.recentAssignments?.filter(a => a.status === 'missing').length} bài
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetailModal;