// Danh sách 10 sinh viên chung cho tất cả các lớp
const ALL_STUDENTS = [
  { id: 1, name: 'Nguyễn Văn Minh', studentId: '122000001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 },
  { id: 2, name: 'Trần Thị Hương', studentId: '122000002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 },
  { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 60, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.2 },
  { id: 4, name: 'Phạm Thị Lan', studentId: '122000004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 },
  { id: 5, name: 'Vũ Đức Thành', studentId: '122000005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.4 },
  { id: 6, name: 'Hoàng Thị Mai', studentId: '122000006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.6 },
  { id: 7, name: 'Đặng Văn Hùng', studentId: '122000007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 },
  { id: 8, name: 'Bùi Thị Ngọc', studentId: '122000008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 },
  { id: 9, name: 'Lý Minh Tuấn', studentId: '122000009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 4.5, completedAssignments: 7, totalAssignments: 10, scoreChange: -0.6 },
  { id: 10, name: 'Ngô Thị Thu', studentId: '122000010', email: 'thu.nt@student.edu.vn', phone: '0901234576', status: 'active', completionRate: 91, averageScore: 8.6, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
];

export const mockDashboardData = {
  kpiMetrics: {
    totalStudents: 10,
    studentChange: 1,
    activeCourses: 4,
    courseChange: 0,
    averageCompletion: 80,  // (90+85+60+78+95+100+72+89+38+91)/10 = 79.8 ≈ 80
    completionChange: 5,
    atRiskStudents: 2,  // Có 2 sinh viên: Lê Hoàng Nam (ID 3) và Lý Minh Tuấn (ID 9)
    riskChange: 0
  },
  
  progressOverview: {
    all: [
      {
        course: 'Nhập môn lập trình',
        completed: 6,
        inProgress: 3,
        notStarted: 1
      },
      {
        course: 'Kĩ thuật lập trình',
        completed: 5,
        inProgress: 4,
        notStarted: 1
      },
      {
        course: 'Lập trình hướng đối tượng',
        completed: 4,
        inProgress: 5,
        notStarted: 1
      },
      {
        course: 'Cấu trúc dữ liệu và giải thuật',
        completed: 3,
        inProgress: 5,
        notStarted: 2
      }
    ],
    '22CT111': [
      {
        course: 'Nhập môn lập trình',
        completed: 2,
        inProgress: 1,
        notStarted: 0
      },
      {
        course: 'Kĩ thuật lập trình',
        completed: 2,
        inProgress: 1,
        notStarted: 0
      },
      {
        course: 'Lập trình hướng đối tượng',
        completed: 1,
        inProgress: 2,
        notStarted: 0
      },
      {
        course: 'Cấu trúc dữ liệu và giải thuật',
        completed: 1,
        inProgress: 1,
        notStarted: 1
      }
    ],
    '22CT112': [
      {
        course: 'Nhập môn lập trình',
        completed: 3,
        inProgress: 1,
        notStarted: 0
      },
      {
        course: 'Kĩ thuật lập trình',
        completed: 2,
        inProgress: 2,
        notStarted: 0
      },
      {
        course: 'Lập trình hướng đối tượng',
        completed: 2,
        inProgress: 1,
        notStarted: 1
      },
      {
        course: 'Cấu trúc dữ liệu và giải thuật',
        completed: 1,
        inProgress: 2,
        notStarted: 1
      }
    ],
    '22CT113': [
      {
        course: 'Nhập môn lập trình',
        completed: 1,
        inProgress: 1,
        notStarted: 1
      },
      {
        course: 'Kĩ thuật lập trình',
        completed: 1,
        inProgress: 1,
        notStarted: 1
      },
      {
        course: 'Lập trình hướng đối tượng',
        completed: 1,
        inProgress: 2,
        notStarted: 0
      },
      {
        course: 'Cấu trúc dữ liệu và giải thuật',
        completed: 1,
        inProgress: 2,
        notStarted: 0
      }
    ]
  },
  
  courseMonitoring: [
    {
      name: 'Nhập môn lập trình',
      enrolledStudents: 10,  // Tổng: 4 (22CT111) + 3 (22CT112) + 3 (22CT113) = 10 sinh viên
      duration: '12 tuần',
      status: 'active',
      completionRate: 80,  // Trung bình 3 lớp: (83+90+66)/3 = 79.67 ≈ 80%
      averageScore: 7.7   // Trung bình 3 lớp: (8.0+8.5+6.6)/3 = 7.7
    },
    {
      name: 'Kĩ thuật lập trình',
      enrolledStudents: 10,  // Tổng: 4 (22CT111) + 3 (22CT112) + 3 (22CT113) = 10 sinh viên
      duration: '10 tuần',
      status: 'active',
      completionRate: 80,  // Trung bình 3 lớp: (83+90+66)/3 = 79.67 ≈ 80%
      averageScore: 7.6   // Trung bình 3 lớp: (7.8+8.4+6.5)/3 = 7.57 ≈ 7.6
    },
    {
      name: 'Lập trình hướng đối tượng',
      enrolledStudents: 10,  // Tổng: 4 (22CT111) + 3 (22CT112) + 3 (22CT113) = 10 sinh viên
      duration: '16 tuần',
      status: 'active',
      completionRate: 80,  // Trung bình 3 lớp: (83+90+66)/3 = 79.67 ≈ 80%
      averageScore: 7.6   // Trung bình 3 lớp: (7.7+8.5+6.5)/3 = 7.57 ≈ 7.6
    },
    {
      name: 'Cấu trúc dữ liệu và giải thuật',
      enrolledStudents: 10,  // Tổng: 4 (22CT111) + 3 (22CT112) + 3 (22CT113) = 10 sinh viên
      duration: '12 tuần',
      status: 'active',
      completionRate: 80,  // Trung bình 3 lớp: (83+90+66)/3 = 79.67 ≈ 80%
      averageScore: 7.5   // Trung bình 3 lớp: (7.6+8.3+6.4)/3 = 7.43 ≈ 7.5
    }
  ],
  
  notifications: [
    {
      id: 1,
      type: 'warning',
      priority: 'high',
      title: 'Cảnh báo tiến độ',
      message: 'Sinh viên Lê Hoàng Nam (122000003) chưa nộp 3 bài tập gần đây',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      relatedStudent: { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003' },
      relatedCourse: { id: 'intro-prog', name: 'Nhập môn lập trình' },
      details: 'Sinh viên Lê Hoàng Nam đang có nguy cơ bỏ học cao với tỷ lệ hoàn thành chỉ 60%. Cần can thiệp ngay để hỗ trợ sinh viên.'
    },
    {
      id: 2,
      type: 'success',
      priority: 'medium',
      title: 'Sinh viên nộp bài',
      message: 'Nguyễn Văn Minh đã nộp bài tập "Hàm và thủ tục" cho lớp 22CT111',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      relatedStudent: { id: 1, name: 'Nguyễn Văn Minh', studentId: '122000001' },
      relatedCourse: { id: 'intro-prog', name: 'Nhập môn lập trình' },
      relatedAssignment: { id: 3, title: 'Bài tập 3: Hàm và thủ tục' },
      details: 'Sinh viên đã nộp bài đúng hạn. Bài làm cần được chấm điểm.'
    },
    {
      id: 3,
      type: 'reminder',
      priority: 'high',
      title: 'Sắp đến hạn',
      message: 'Bài tập "Cấu trúc điều khiển" sẽ hết hạn trong 2 giờ nữa',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: false,
      relatedCourse: { id: 'intro-prog', name: 'Nhập môn lập trình' },
      relatedAssignment: { id: 2, title: 'Bài tập 2: Cấu trúc điều khiển' },
      details: 'Hiện có 1/3 sinh viên trong lớp 22CT111 chưa nộp bài. Cần nhắc nhở sinh viên.'
    },
    {
      id: 4,
      type: 'info',
      priority: 'medium',
      title: 'Khóa học mới',
      message: 'Khóa học "Lập trình hướng đối tượng" đã được thêm vào hệ thống',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      relatedCourse: { id: 'oop', name: 'Lập trình hướng đối tượng' },
      details: 'Khóa học mới đã được tạo với 10 sinh viên đăng ký. Bạn có thể bắt đầu tạo bài tập và tài liệu.'
    },
    {
      id: 5,
      type: 'success',
      priority: 'low',
      title: 'Sinh viên mới',
      message: '3 sinh viên mới đã đăng ký vào lớp 22CT112',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      read: false,
      relatedCourse: { id: 'intro-prog', name: 'Nhập môn lập trình' },
      details: 'Các sinh viên mới: Trần Thị Hương, Vũ Đức Thành, Đặng Văn Hùng đã được thêm vào lớp.'
    },
    {
      id: 6,
      type: 'warning',
      priority: 'high',
      title: 'Tiến độ chậm',
      message: 'Lớp 22CT113 có tỷ lệ hoàn thành thấp (72%) trong khóa "Cấu trúc dữ liệu và giải thuật"',
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: true,
      relatedCourse: { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật' },
      details: 'Lớp 22CT113 đang gặp khó khăn với nội dung khóa học. Cần tổ chức buổi học bổ sung.'
    },
    {
      id: 7,
      type: 'success',
      priority: 'low',
      title: 'Bài tập được giao',
      message: 'Bài tập "HTML/CSS Nâng cao" đã được giao cho lớp 22CT111',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      relatedCourse: { id: 'intro-prog', name: 'Nhập môn lập trình' },
      relatedAssignment: { id: 1, title: 'Bài tập 1: Biến và Kiểu dữ liệu' },
      details: 'Bài tập mới đã được tạo và giao cho 3 sinh viên trong lớp 22CT111.'
    }
  ],
  
  performanceChart: [
    {
      date: '01/12',
      averageScore: 7.5,
      completionRate: 70,
      engagement: 6.8
    },
    {
      date: '02/12',
      averageScore: 7.6,
      completionRate: 72,
      engagement: 7.0
    },
    {
      date: '03/12',
      averageScore: 7.4,
      completionRate: 73,
      engagement: 7.2
    },
    {
      date: '04/12',
      averageScore: 7.8,
      completionRate: 75,
      engagement: 7.4
    },
    {
      date: '05/12',
      averageScore: 8.0,
      completionRate: 78,
      engagement: 7.5
    },
    {
      date: '06/12',
      averageScore: 7.9,
      completionRate: 79,
      engagement: 7.6
    },
    {
      date: '07/12',
      averageScore: 8.1,
      completionRate: 80,
      engagement: 7.8
    }
  ],

  gradeDistribution: {
    excellent: { min: 8.0, max: 10, color: '#10b981' },
    good: { min: 6.5, max: 8.0, color: '#3b82f6' },
    average: { min: 5.0, max: 6.5, color: '#f59e0b' },
    weak: { min: 4.0, max: 5.0, color: '#f97316' },
    poor: { min: 0, max: 4.0, color: '#ef4444' }
  }
};

// Import danh sách bài tập chuẩn hóa
import { ASSIGNMENTS_LIST, calculateAssignmentStats } from './assignmentsData';

// Tính toán stats từ dữ liệu thực tế
const assignmentStats = calculateAssignmentStats();

export const mockAssignmentData = {
  // Stats được tính toán từ ASSIGNMENTS_LIST
  stats: {
    totalAssignments: assignmentStats.totalAssignments,
    assignmentChange: 0,
    activeAssignments: assignmentStats.activeAssignments,
    activeChange: 0,
    completedAssignments: assignmentStats.completedAssignments,
    completedChange: 0,
    overdueAssignments: assignmentStats.overdueAssignments,
    overdueChange: 0,
    averageSubmissionRate: assignmentStats.averageSubmissionRate,
    submissionChange: 0,
    averageScore: assignmentStats.averageScore,
    scoreChange: 0
  },
  
  // Sử dụng danh sách bài tập từ assignmentsData.js
  assignments: ASSIGNMENTS_LIST,
  
  assignmentDetails: {
    // Danh sách đầy đủ 10 sinh viên nộp bài
    submissions: [
      {
        id: 1,
        studentId: '122000001',
        studentName: 'Nguyễn Văn Minh',
        submittedAt: '2024-11-21T14:30:00',
        status: 'graded',
        score: 8.5,
        feedback: 'Bài làm rất tốt! Code clean và có comment đầy đủ.',
        files: [{ name: 'baitap.zip', size: 2048, url: '#' }]
      },
      {
        id: 2,
        studentId: '122000002',
        studentName: 'Trần Thị Hương',
        submittedAt: '2024-11-22T09:15:00',
        status: 'graded',
        score: 7.8,
        feedback: 'Bài làm tốt, cần cải thiện phần xử lý lỗi.',
        files: [{ name: 'project.zip', size: 5120, url: '#' }]
      },
      {
        id: 3,
        studentId: '122000003',
        studentName: 'Lê Hoàng Nam',
        submittedAt: '2024-11-23T16:45:00',
        status: 'late',
        score: 6.5,
        feedback: 'Nộp muộn 1 ngày. Code cần cải thiện về cấu trúc.',
        files: [{ name: 'assignment.zip', size: 3072, url: '#' }]
      },
      {
        id: 4,
        studentId: '122000004',
        studentName: 'Phạm Thị Lan',
        submittedAt: '2024-11-20T11:20:00',
        status: 'pending',
        score: null,
        feedback: null,
        files: [{ name: 'homework.zip', size: 4096, url: '#' }]
      },
      {
        id: 5,
        studentId: '122000005',
        studentName: 'Vũ Đức Thành',
        submittedAt: '2024-11-21T18:30:00',
        status: 'graded',
        score: 9.2,
        feedback: 'Xuất sắc! Code rất clean, có sử dụng best practices.',
        files: [{ name: 'final-project.zip', size: 6144, url: '#' }]
      },
      {
        id: 6,
        studentId: '122000006',
        studentName: 'Hoàng Thị Mai',
        submittedAt: '2024-11-21T10:00:00',
        status: 'graded',
        score: 9.2,
        feedback: 'Hoàn thành xuất sắc! Logic rõ ràng, code tối ưu.',
        files: [{ name: 'baitap_mai.zip', size: 4500, url: '#' }]
      },
      {
        id: 7,
        studentId: '122000007',
        studentName: 'Đặng Văn Hùng',
        submittedAt: '2024-11-22T14:00:00',
        status: 'graded',
        score: 7.2,
        feedback: 'Bài làm đạt yêu cầu, cần cải thiện naming convention.',
        files: [{ name: 'hung_bt.zip', size: 3800, url: '#' }]
      },
      {
        id: 8,
        studentId: '122000008',
        studentName: 'Bùi Thị Ngọc',
        submittedAt: '2024-11-21T16:45:00',
        status: 'graded',
        score: 8.4,
        feedback: 'Bài làm tốt, có sáng tạo trong cách giải quyết vấn đề.',
        files: [{ name: 'ngoc_assignment.zip', size: 5200, url: '#' }]
      },
      {
        id: 9,
        studentId: '122000009',
        studentName: 'Lý Minh Tuấn',
        submittedAt: '2024-11-24T20:30:00',
        status: 'late',
        score: 4.5,
        feedback: 'Nộp muộn 2 ngày. Bài làm chưa hoàn thiện, thiếu nhiều chức năng.',
        files: [{ name: 'tuan_bt.zip', size: 1500, url: '#' }]
      },
      {
        id: 10,
        studentId: '122000010',
        studentName: 'Ngô Thị Thu',
        submittedAt: '2024-11-20T09:30:00',
        status: 'graded',
        score: 8.6,
        feedback: 'Bài làm rất tốt, code sạch và có documentation đầy đủ.',
        files: [{ name: 'thu_project.zip', size: 4800, url: '#' }]
      }
    ],
    
    analytics: {
      submissionRate: 100, // 10/10 sinh viên đã nộp
      averageScore: 7.7,   // Trung bình: (8.5+7.8+6.5+7.5+9.2+9.2+7.2+8.4+4.5+8.6)/10 = 7.74
      lateSubmissions: 2,  // SV 3 và SV 9 nộp muộn
      failureRate: 10,     // 1/10 sinh viên dưới 5 điểm
      totalSubmissions: 10,
      averageSubmissionTime: '2.5 ngày',
      resubmissions: 1,
      plagiarismDetected: 0,
      averageGradingTime: '1.2 ngày',
      feedbackGiven: 9,    // 9 sinh viên đã được chấm (trừ 1 pending)
      
      scoreDistribution: [
        { range: '9-10', count: 2 },   // SV 5, 6
        { range: '8-8.9', count: 3 },  // SV 1, 8, 10
        { range: '7-7.9', count: 2 },  // SV 2, 7
        { range: '6-6.9', count: 1 },  // SV 3
        { range: '0-5.9', count: 1 }   // SV 9
      ],
      
      submissionStatus: [
        { name: 'Đã chấm', value: 8 },
        { name: 'Chờ chấm', value: 1 },
        { name: 'Nộp muộn', value: 2 },
        { name: 'Chưa nộp', value: 0 }
      ],
      
      submissionTimeline: [
        { date: '18/11', submissions: 0 },
        { date: '19/11', submissions: 0 },
        { date: '20/11', submissions: 3 },
        { date: '21/11', submissions: 7 },
        { date: '22/11', submissions: 9 },
        { date: '23/11', submissions: 9 },
        { date: '24/11', submissions: 10 }
      ],
      
      classComparison: [
        { className: '22CT111', averageScore: 7.95, submissionRate: 100 },
        { className: '22CT112', averageScore: 8.47, submissionRate: 100 },
        { className: '22CT113', averageScore: 6.73, submissionRate: 100 }
      ]
    },
    
    files: [
      { name: 'Hướng dẫn bài tập.pdf', url: '#' },
      { name: 'Template HTML.zip', url: '#' },
      { name: 'Rubric chấm điểm.xlsx', url: '#' }
    ]
  }
};

export const mockStudentTrackingData = {
  version: '1.0.1', // Version để force reload cache
  lastUpdated: new Date().toISOString(),
  students: [
    {
      id: 1,
      name: 'Nguyễn Văn Minh',
      studentId: '122000001',
      email: 'minh.nv@student.edu.vn',
      phone: '0901234567',
      status: 'active',
      riskLevel: 'low',
      completionRate: 90,
      averageScore: 8.5,
      completedAssignments: 18,
      totalAssignments: 20,
      totalHours: 156,
      scoreChange: 0.5,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 95, score: 8.9, className: '22CT111' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 88, score: 8.7, className: '22CT111' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 92, score: 8.6, className: '22CT111' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 85, score: 8.3, className: '22CT111' }
      ],
      classes: [
        { id: 1, name: 'Nhập môn lập trình - 22CT111' },
        { id: 3, name: 'Kĩ thuật lập trình - 22CT111' }
      ],
      recentAssignments: [
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 8.5, submittedDate: '2024-10-22', status: 'completed' },
        { id: 3, title: 'Vòng lặp', courseName: 'Nhập môn lập trình', score: 8.2, submittedDate: '2024-10-12', status: 'completed' },
        { id: 2, title: 'Cấu trúc điều khiển', courseName: 'Nhập môn lập trình', score: 8.8, submittedDate: '2024-10-02', status: 'completed' },
        { id: 1, title: 'Biến và kiểu dữ liệu', courseName: 'Nhập môn lập trình', score: 8.9, submittedDate: '2024-09-22', status: 'completed' },
        { id: 6, title: 'Con trỏ cơ bản', courseName: 'Kĩ thuật lập trình', score: 8.7, submittedDate: '2024-09-27', status: 'completed' },
        { id: 7, title: 'Con trỏ và mảng', courseName: 'Kĩ thuật lập trình', score: 8.4, submittedDate: '2024-10-08', status: 'completed' },
        { id: 11, title: 'Lớp và đối tượng', courseName: 'Lập trình hướng đối tượng', score: 8.6, submittedDate: '2024-10-02', status: 'completed' },
        { id: 16, title: 'Danh sách liên kết', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 8.3, submittedDate: '2024-10-08', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-06', content: 'Sinh viên có tiến bộ rõ rệt, tích cực tham gia lớp học.' },
        { author: 'TS. Nguyễn Văn An', date: '2024-11-28', content: 'Cần cải thiện kỹ năng debug code.' }
      ]
    },
    {
      id: 2,
      name: 'Trần Thị Hương',
      studentId: '122000002',
      email: 'huong.tt@student.edu.vn',
      phone: '0901234568',
      status: 'active',
      riskLevel: 'low',
      completionRate: 85,
      averageScore: 8.0,
      completedAssignments: 16,
      totalAssignments: 20,
      totalHours: 142,
      scoreChange: 0.2,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 88, score: 8.2, className: '22CT112' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 85, score: 8.0, className: '22CT112' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 82, score: 7.9, className: '22CT112' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 80, score: 7.8, className: '22CT112' }
      ],
      classes: [
        { id: 2, name: 'Nhập môn lập trình - 22CT112' },
        { id: 4, name: 'Lập trình hướng đối tượng - 22CT112' }
      ],
      recentAssignments: [
        { id: 11, title: 'Lớp và đối tượng', courseName: 'Lập trình hướng đối tượng', score: 8.0, submittedDate: '2024-10-02', status: 'completed' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 7.8, submittedDate: '2024-10-22', status: 'completed' },
        { id: 6, title: 'Con trỏ cơ bản', courseName: 'Kĩ thuật lập trình', score: 8.1, submittedDate: '2024-09-27', status: 'completed' },
        { id: 1, title: 'Biến và kiểu dữ liệu', courseName: 'Nhập môn lập trình', score: 8.2, submittedDate: '2024-09-22', status: 'completed' },
        { id: 2, title: 'Cấu trúc điều khiển', courseName: 'Nhập môn lập trình', score: 7.9, submittedDate: '2024-10-02', status: 'completed' },
        { id: 16, title: 'Danh sách liên kết', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 7.8, submittedDate: '2024-10-08', status: 'completed' },
        { id: 12, title: 'Đóng gói và trừu tượng', courseName: 'Lập trình hướng đối tượng', score: 7.9, submittedDate: '2024-10-12', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-05', content: 'Sinh viên chăm chỉ, cần hỗ trợ thêm về thuật toán.' }
      ]
    },
    {
      id: 3,
      name: 'Lê Hoàng Nam',
      studentId: '122000003',
      email: 'nam.lh@student.edu.vn',
      phone: '0901234569',
      status: 'at_risk',
      riskLevel: 'medium',
      completionRate: 40,
      averageScore: 6.0,
      completedAssignments: 8,
      totalAssignments: 20,
      totalHours: 89,
      scoreChange: -0.2,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 40, score: 6.2, className: '22CT113' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 40, score: 5.8, className: '22CT113' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 40, score: 6.0, className: '22CT113' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 40, score: 5.5, className: '22CT113' }
      ],
      classes: [
        { id: 9, name: 'Nhập môn lập trình - 22CT113' },
        { id: 10, name: 'Kĩ thuật lập trình - 22CT113' }
      ],
      // 8/20 bài hoàn thành = 40% → 2 bài/môn hoàn thành, 3 bài/môn chưa nộp
      recentAssignments: [
        // Nhập môn lập trình: 2 hoàn thành, 3 chưa nộp
        { id: 1, title: 'Biến và kiểu dữ liệu', courseName: 'Nhập môn lập trình', score: 6.2, submittedDate: '2024-09-25', status: 'late' },
        { id: 2, title: 'Cấu trúc điều khiển', courseName: 'Nhập môn lập trình', score: 6.5, submittedDate: '2024-10-05', status: 'completed' },
        { id: 3, title: 'Vòng lặp', courseName: 'Nhập môn lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 5, title: 'Mảng một chiều', courseName: 'Nhập môn lập trình', score: 0, submittedDate: null, status: 'missing' },
        // Kĩ thuật lập trình: 2 hoàn thành, 3 chưa nộp
        { id: 6, title: 'Con trỏ cơ bản', courseName: 'Kĩ thuật lập trình', score: 5.8, submittedDate: '2024-09-30', status: 'late' },
        { id: 7, title: 'Con trỏ và mảng', courseName: 'Kĩ thuật lập trình', score: 5.5, submittedDate: '2024-10-10', status: 'late' },
        { id: 8, title: 'Cấp phát động', courseName: 'Kĩ thuật lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 9, title: 'File I/O', courseName: 'Kĩ thuật lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 10, title: 'Struct và Union', courseName: 'Kĩ thuật lập trình', score: 0, submittedDate: null, status: 'missing' },
        // Lập trình hướng đối tượng: 2 hoàn thành, 3 chưa nộp
        { id: 11, title: 'Lớp và đối tượng', courseName: 'Lập trình hướng đối tượng', score: 6.0, submittedDate: '2024-10-05', status: 'completed' },
        { id: 12, title: 'Đóng gói và trừu tượng', courseName: 'Lập trình hướng đối tượng', score: 5.8, submittedDate: '2024-10-15', status: 'late' },
        { id: 13, title: 'Kế thừa', courseName: 'Lập trình hướng đối tượng', score: 0, submittedDate: null, status: 'missing' },
        { id: 14, title: 'Đa hình', courseName: 'Lập trình hướng đối tượng', score: 0, submittedDate: null, status: 'missing' },
        { id: 15, title: 'Design Patterns cơ bản', courseName: 'Lập trình hướng đối tượng', score: 0, submittedDate: null, status: 'missing' },
        // Cấu trúc dữ liệu: 2 hoàn thành, 3 chưa nộp
        { id: 16, title: 'Danh sách liên kết', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 5.5, submittedDate: '2024-10-10', status: 'late' },
        { id: 17, title: 'Stack và Queue', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 5.8, submittedDate: '2024-10-20', status: 'completed' },
        { id: 18, title: 'Cây nhị phân', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 0, submittedDate: null, status: 'missing' },
        { id: 19, title: 'Sắp xếp và tìm kiếm', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 0, submittedDate: null, status: 'missing' },
        { id: 20, title: 'Đồ thị cơ bản', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 0, submittedDate: null, status: 'missing' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-07', content: 'CẢNH BÁO: Sinh viên có nguy cơ bỏ học cao. Cần can thiệp ngay.' },
        { author: 'TS. Nguyễn Văn An', date: '2024-12-01', content: 'Vắng mặt nhiều buổi học, điểm số giảm. Chưa nộp 12 bài tập.' }
      ]
    },
    {
      id: 4,
      name: 'Phạm Thị Lan',
      studentId: '122000004',
      email: 'lan.pt@student.edu.vn',
      phone: '0901234570',
      status: 'active',
      riskLevel: 'low',
      completionRate: 78,
      averageScore: 7.5,
      completedAssignments: 14,
      totalAssignments: 20,
      totalHours: 128,
      scoreChange: 0.2,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 80, score: 7.6, className: '22CT111' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 75, score: 7.3, className: '22CT111' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 82, score: 7.8, className: '22CT111' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 74, score: 7.4, className: '22CT111' }
      ],
      classes: [
        { id: 4, name: 'Lập trình hướng đối tượng - 22CT111' },
        { id: 5, name: 'Cấu trúc dữ liệu và giải thuật - 22CT111' }
      ],
      recentAssignments: [
        { id: 14, title: 'Đa hình', courseName: 'Lập trình hướng đối tượng', score: 7.5, submittedDate: '2024-11-01', status: 'completed' },
        { id: 13, title: 'Kế thừa', courseName: 'Lập trình hướng đối tượng', score: 7.8, submittedDate: '2024-10-22', status: 'completed' },
        { id: 17, title: 'Stack và Queue', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 7.6, submittedDate: '2024-10-17', status: 'completed' },
        { id: 11, title: 'Lớp và đối tượng', courseName: 'Lập trình hướng đối tượng', score: 7.8, submittedDate: '2024-10-02', status: 'completed' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 7.5, submittedDate: '2024-10-22', status: 'completed' },
        { id: 6, title: 'Con trỏ cơ bản', courseName: 'Kĩ thuật lập trình', score: 7.4, submittedDate: '2024-09-27', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-06', content: 'Sinh viên có tiềm năng, cần tập trung hơn vào lý thuyết.' }
      ]
    },
    {
      id: 5,
      name: 'Vũ Đức Thành',
      studentId: '122000005',
      email: 'thanh.vd@student.edu.vn',
      phone: '0901234571',
      status: 'active',
      riskLevel: 'low',
      completionRate: 95,
      averageScore: 9.0,
      completedAssignments: 19,
      totalAssignments: 20,
      totalHours: 168,
      scoreChange: 0.4,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 98, score: 9.2, className: '22CT112' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 92, score: 8.8, className: '22CT112' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 95, score: 9.0, className: '22CT112' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 94, score: 9.1, className: '22CT112' }
      ],
      classes: [
        { id: 1, name: 'Nhập môn lập trình - 22CT112' },
        { id: 6, name: 'Kĩ thuật lập trình - 22CT112' }
      ],
      recentAssignments: [
        { id: 9, title: 'File I/O', courseName: 'Kĩ thuật lập trình', score: 9.3, submittedDate: '2024-10-27', status: 'completed' },
        { id: 8, title: 'Cấp phát động', courseName: 'Kĩ thuật lập trình', score: 8.6, submittedDate: '2024-10-17', status: 'completed' },
        { id: 7, title: 'Con trỏ và mảng', courseName: 'Kĩ thuật lập trình', score: 9.0, submittedDate: '2024-10-08', status: 'completed' },
        { id: 18, title: 'Cây nhị phân', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 9.1, submittedDate: '2024-10-27', status: 'completed' },
        { id: 14, title: 'Đa hình', courseName: 'Lập trình hướng đối tượng', score: 9.0, submittedDate: '2024-11-01', status: 'completed' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 9.2, submittedDate: '2024-10-22', status: 'completed' },
        { id: 1, title: 'Biến và kiểu dữ liệu', courseName: 'Nhập môn lập trình', score: 9.0, submittedDate: '2024-09-22', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-05', content: 'Sinh viên xuất sắc, có thể làm mentor cho các bạn khác.' }
      ]
    },
    {
      id: 6,
      name: 'Hoàng Thị Mai',
      studentId: '122000006',
      email: 'mai.ht@student.edu.vn',
      phone: '0901234572',
      status: 'completed',
      riskLevel: 'low',
      completionRate: 100,
      averageScore: 9.2,
      completedAssignments: 20,
      totalAssignments: 20,
      totalHours: 180,
      scoreChange: 0.6,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 100, score: 9.4, className: '22CT113' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 100, score: 9.2, className: '22CT113' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 100, score: 9.3, className: '22CT113' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 100, score: 9.1, className: '22CT113' }
      ],
      classes: [
        { id: 6, name: 'Lập trình hướng đối tượng - 22CT113' },
        { id: 7, name: 'Cấu trúc dữ liệu và giải thuật - 22CT113' }
      ],
      recentAssignments: [
        { id: 18, title: 'Cây nhị phân', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 9.4, submittedDate: '2024-10-27', status: 'completed' },
        { id: 16, title: 'Danh sách liên kết', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 9.0, submittedDate: '2024-10-08', status: 'completed' },
        { id: 19, title: 'Sắp xếp và tìm kiếm', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 9.2, submittedDate: '2024-11-08', status: 'completed' },
        { id: 17, title: 'Stack và Queue', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 9.3, submittedDate: '2024-10-17', status: 'completed' },
        { id: 14, title: 'Đa hình', courseName: 'Lập trình hướng đối tượng', score: 9.3, submittedDate: '2024-11-01', status: 'completed' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 9.2, submittedDate: '2024-10-22', status: 'completed' },
        { id: 9, title: 'File I/O', courseName: 'Kĩ thuật lập trình', score: 9.1, submittedDate: '2024-10-27', status: 'completed' },
        { id: 20, title: 'Đồ thị cơ bản', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 9.2, submittedDate: '2024-11-15', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-04', content: 'Hoàn thành xuất sắc tất cả khóa học. Đề xuất làm TA.' }
      ]
    },
    {
      id: 7,
      name: 'Đặng Văn Hùng',
      studentId: '122000007',
      email: 'hung.dv@student.edu.vn',
      phone: '0901234573',
      status: 'active',
      riskLevel: 'low',
      completionRate: 72,
      averageScore: 7.2,
      completedAssignments: 13,
      totalAssignments: 20,
      totalHours: 118,
      scoreChange: -0.1,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 69, score: 7.0, className: '22CT111' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 75, score: 7.5, className: '22CT111' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 72, score: 7.2, className: '22CT111' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 70, score: 7.1, className: '22CT111' }
      ],
      classes: [
        { id: 3, name: 'Kĩ thuật lập trình - 22CT111' },
        { id: 2, name: 'Nhập môn lập trình - 22CT112' }
      ],
      recentAssignments: [
        { id: 8, title: 'Cấp phát động', courseName: 'Kĩ thuật lập trình', score: 7.1, submittedDate: '2024-10-17', status: 'completed' },
        { id: 9, title: 'File I/O', courseName: 'Kĩ thuật lập trình', score: 7.6, submittedDate: '2024-10-27', status: 'completed' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 7.3, submittedDate: '2024-10-22', status: 'completed' },
        { id: 11, title: 'Lớp và đối tượng', courseName: 'Lập trình hướng đối tượng', score: 7.2, submittedDate: '2024-10-02', status: 'completed' },
        { id: 16, title: 'Danh sách liên kết', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 7.1, submittedDate: '2024-10-08', status: 'completed' },
        { id: 6, title: 'Con trỏ cơ bản', courseName: 'Kĩ thuật lập trình', score: 7.0, submittedDate: '2024-09-27', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-06', content: 'Cần cải thiện kỹ năng coding và tham gia tích cực hơn.' }
      ]
    },
    {
      id: 8,
      name: 'Bùi Thị Ngọc',
      studentId: '122000008',
      email: 'ngoc.bt@student.edu.vn',
      phone: '0901234574',
      status: 'active',
      riskLevel: 'low',
      completionRate: 89,
      averageScore: 8.4,
      completedAssignments: 17,
      totalAssignments: 20,
      totalHours: 152,
      scoreChange: 0.4,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 88, score: 8.3, className: '22CT112' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 90, score: 8.5, className: '22CT112' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 92, score: 8.6, className: '22CT112' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 86, score: 8.2, className: '22CT112' }
      ],
      classes: [
        { id: 4, name: 'Lập trình hướng đối tượng - 22CT112' },
        { id: 5, name: 'Cấu trúc dữ liệu và giải thuật - 22CT112' }
      ],
      recentAssignments: [
        { id: 18, title: 'Cây nhị phân', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 8.7, submittedDate: '2024-10-27', status: 'completed' },
        { id: 14, title: 'Đa hình', courseName: 'Lập trình hướng đối tượng', score: 8.1, submittedDate: '2024-11-01', status: 'completed' },
        { id: 17, title: 'Stack và Queue', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 8.4, submittedDate: '2024-10-17', status: 'completed' },
        { id: 13, title: 'Kế thừa', courseName: 'Lập trình hướng đối tượng', score: 8.6, submittedDate: '2024-10-22', status: 'completed' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 8.4, submittedDate: '2024-10-22', status: 'completed' },
        { id: 9, title: 'File I/O', courseName: 'Kĩ thuật lập trình', score: 8.5, submittedDate: '2024-10-27', status: 'completed' },
        { id: 16, title: 'Danh sách liên kết', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 8.2, submittedDate: '2024-10-08', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-05', content: 'Sinh viên có năng khiếu về phân tích dữ liệu.' }
      ]
    },
    {
      id: 9,
      name: 'Lý Minh Tuấn',
      studentId: '122000009',
      email: 'tuan.lm@student.edu.vn',
      phone: '0901234575',
      status: 'at_risk',
      riskLevel: 'high',
      completionRate: 38,
      averageScore: 4.5,
      completedAssignments: 8,
      totalAssignments: 20,
      totalHours: 76,
      scoreChange: -0.6,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 40, score: 4.8, className: '22CT113' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 40, score: 4.5, className: '22CT113' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 40, score: 4.2, className: '22CT113' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 40, score: 4.3, className: '22CT113' }
      ],
      classes: [
        { id: 9, name: 'Nhập môn lập trình - 22CT113' },
        { id: 11, name: 'Lập trình hướng đối tượng - 22CT113' }
      ],
      // 8/20 bài hoàn thành = 40% → 2 bài/môn hoàn thành, 3 bài/môn chưa nộp
      recentAssignments: [
        // Nhập môn lập trình: 2 hoàn thành (nộp muộn), 3 chưa nộp
        { id: 1, title: 'Biến và kiểu dữ liệu', courseName: 'Nhập môn lập trình', score: 4.8, submittedDate: '2024-09-28', status: 'late' },
        { id: 2, title: 'Cấu trúc điều khiển', courseName: 'Nhập môn lập trình', score: 4.5, submittedDate: '2024-10-08', status: 'late' },
        { id: 3, title: 'Vòng lặp', courseName: 'Nhập môn lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 4, title: 'Hàm và thủ tục', courseName: 'Nhập môn lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 5, title: 'Mảng một chiều', courseName: 'Nhập môn lập trình', score: 0, submittedDate: null, status: 'missing' },
        // Kĩ thuật lập trình: 2 hoàn thành (nộp muộn), 3 chưa nộp
        { id: 6, title: 'Con trỏ cơ bản', courseName: 'Kĩ thuật lập trình', score: 4.2, submittedDate: '2024-10-02', status: 'late' },
        { id: 7, title: 'Con trỏ và mảng', courseName: 'Kĩ thuật lập trình', score: 4.0, submittedDate: '2024-10-12', status: 'late' },
        { id: 8, title: 'Cấp phát động', courseName: 'Kĩ thuật lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 9, title: 'File I/O', courseName: 'Kĩ thuật lập trình', score: 0, submittedDate: null, status: 'missing' },
        { id: 10, title: 'Struct và Union', courseName: 'Kĩ thuật lập trình', score: 0, submittedDate: null, status: 'missing' },
        // Lập trình hướng đối tượng: 2 hoàn thành (nộp muộn), 3 chưa nộp
        { id: 11, title: 'Lớp và đối tượng', courseName: 'Lập trình hướng đối tượng', score: 3.5, submittedDate: '2024-10-10', status: 'late' },
        { id: 12, title: 'Đóng gói và trừu tượng', courseName: 'Lập trình hướng đối tượng', score: 4.0, submittedDate: '2024-10-18', status: 'late' },
        { id: 13, title: 'Kế thừa', courseName: 'Lập trình hướng đối tượng', score: 0, submittedDate: null, status: 'missing' },
        { id: 14, title: 'Đa hình', courseName: 'Lập trình hướng đối tượng', score: 0, submittedDate: null, status: 'missing' },
        { id: 15, title: 'Design Patterns cơ bản', courseName: 'Lập trình hướng đối tượng', score: 0, submittedDate: null, status: 'missing' },
        // Cấu trúc dữ liệu: 2 hoàn thành (nộp muộn), 3 chưa nộp
        { id: 16, title: 'Danh sách liên kết', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 4.5, submittedDate: '2024-10-12', status: 'late' },
        { id: 17, title: 'Stack và Queue', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 4.8, submittedDate: '2024-10-22', status: 'late' },
        { id: 18, title: 'Cây nhị phân', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 0, submittedDate: null, status: 'missing' },
        { id: 19, title: 'Sắp xếp và tìm kiếm', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 0, submittedDate: null, status: 'missing' },
        { id: 20, title: 'Đồ thị cơ bản', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 0, submittedDate: null, status: 'missing' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-08', content: 'KHẨN CẤP: Cần họp phụ huynh và tư vấn học tập.' },
        { author: 'TS. Nguyễn Văn An', date: '2024-12-03', content: 'Sinh viên gặp khó khăn về cơ bản, cần hỗ trợ đặc biệt. Chưa nộp 12 bài tập.' }
      ]
    },
    {
      id: 10,
      name: 'Ngô Thị Thu',
      studentId: '122000010',
      email: 'thu.nt@student.edu.vn',
      phone: '0901234576',
      status: 'active',
      riskLevel: 'low',
      completionRate: 91,
      averageScore: 8.6,
      completedAssignments: 18,
      totalAssignments: 20,
      totalHours: 159,
      scoreChange: 0.4,
      enrollmentDate: '2024-09-01',
      courses: [
        { id: 'intro-prog', name: 'Nhập môn lập trình', progress: 90, score: 8.6, className: '22CT111' },
        { id: 'prog-technique', name: 'Kĩ thuật lập trình', progress: 88, score: 8.5, className: '22CT111' },
        { id: 'oop', name: 'Lập trình hướng đối tượng', progress: 92, score: 8.7, className: '22CT111' },
        { id: 'data-struct-algo', name: 'Cấu trúc dữ liệu và giải thuật', progress: 94, score: 8.7, className: '22CT111' }
      ],
      classes: [
        { id: 7, name: 'Cấu trúc dữ liệu và giải thuật - 22CT111' },
        { id: 6, name: 'Kĩ thuật lập trình - 22CT111' }
      ],
      recentAssignments: [
        { id: 20, title: 'Đồ thị cơ bản', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 8.9, submittedDate: '2024-11-15', status: 'completed' },
        { id: 18, title: 'Cây nhị phân', courseName: 'Cấu trúc dữ liệu và giải thuật', score: 8.3, submittedDate: '2024-10-27', status: 'completed' },
        { title: 'Hash Table', score: 8.6, submittedDate: '2024-12-01', status: 'completed' }
      ],
      notes: [
        { author: 'TS. Nguyễn Văn An', date: '2024-12-05', content: 'Sinh viên có khả năng tốt về hệ thống và vận hành.' }
      ]
    }
  ]
};

export const mockClassData = {
  stats: {
    totalClasses: 12,
    classChange: 0,
    activeClasses: 12,
    activeChange: 0,
    totalStudents: 10,
    studentChange: 1,
    averageScore: 7.4,
    scoreChange: 0.3,
    completionRate: 77,
    completionChange: 5,
    atRiskClasses: 2,
    riskChange: 0
  },
  
  classes: [
    // Lớp 22CT111 - 4 sinh viên (SV 1, 4, 7, 10): completionRate = (90+78+72+91)/4 = 83%
    {
      id: 1,
      name: '22CT111',
      course: 'Nhập môn lập trình',
      courseId: 'intro-prog',
      enrolledStudents: 4,
      schedule: 'Thứ 2, 4 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 83,
      averageScore: 7.8,
      activeAssignments: 3,
      instructor: 'TS. Nguyễn Văn An'
    },
    {
      id: 2,
      name: '22CT111',
      course: 'Kĩ thuật lập trình',
      courseId: 'prog-technique',
      enrolledStudents: 4,
      schedule: 'Thứ 3, 5 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 83,
      averageScore: 7.6,
      activeAssignments: 2,
      instructor: 'TS. Nguyễn Văn An'
    },
    {
      id: 3,
      name: '22CT111',
      course: 'Lập trình hướng đối tượng',
      courseId: 'oop',
      enrolledStudents: 4,
      schedule: 'Thứ 6 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 83,
      averageScore: 7.5,
      activeAssignments: 2,
      instructor: 'TS. Nguyễn Văn An'
    },
    {
      id: 4,
      name: '22CT111',
      course: 'Cấu trúc dữ liệu và giải thuật',
      courseId: 'data-struct-algo',
      enrolledStudents: 4,
      schedule: 'Thứ 7 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 83,
      averageScore: 7.3,
      activeAssignments: 3,
      instructor: 'TS. Nguyễn Văn An'
    },
    // Lớp 22CT112 - 3 sinh viên (SV 2, 5, 8): completionRate = (85+95+89)/3 = 90%
    {
      id: 5,
      name: '22CT112',
      course: 'Nhập môn lập trình',
      courseId: 'intro-prog',
      enrolledStudents: 3,
      schedule: 'Thứ 2, 4 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 90,
      averageScore: 7.6,
      activeAssignments: 2,
      instructor: 'TS. Trần Thị Bình'
    },
    {
      id: 6,
      name: '22CT112',
      course: 'Kĩ thuật lập trình',
      courseId: 'prog-technique',
      enrolledStudents: 3,
      schedule: 'Thứ 3, 5 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 90,
      averageScore: 7.5,
      activeAssignments: 3,
      instructor: 'TS. Trần Thị Bình'
    },
    {
      id: 7,
      name: '22CT112',
      course: 'Lập trình hướng đối tượng',
      courseId: 'oop',
      enrolledStudents: 3,
      schedule: 'Thứ 6 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 90,
      averageScore: 7.4,
      activeAssignments: 2,
      instructor: 'TS. Trần Thị Bình'
    },
    {
      id: 8,
      name: '22CT112',
      course: 'Cấu trúc dữ liệu và giải thuật',
      courseId: 'data-struct-algo',
      enrolledStudents: 3,
      schedule: 'Thứ 7 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 90,
      averageScore: 7.2,
      activeAssignments: 3,
      instructor: 'TS. Trần Thị Bình'
    },
    // Lớp 22CT113 - 3 sinh viên (SV 3, 6, 9): completionRate = (60+100+38)/3 = 66%
    {
      id: 9,
      name: '22CT113',
      course: 'Nhập môn lập trình',
      courseId: 'intro-prog',
      enrolledStudents: 3,
      schedule: 'Thứ 2, 4 - 13:30-17:00',
      location: 'Phòng Lab 201',
      duration: '10 tuần',
      status: 'active',
      completionRate: 66,
      averageScore: 7.4,
      activeAssignments: 3,
      instructor: 'TS. Lê Văn Cường'
    },
    {
      id: 10,
      name: '22CT113',
      course: 'Kĩ thuật lập trình',
      courseId: 'prog-technique',
      enrolledStudents: 3,
      schedule: 'Thứ 3, 5 - 13:30-17:00',
      location: 'Phòng Lab 201',
      duration: '10 tuần',
        status: 'active',
      completionRate: 66,
      averageScore: 7.2,
      activeAssignments: 2,
      instructor: 'TS. Lê Văn Cường'
    },
    {
      id: 11,
      name: '22CT113',
      course: 'Lập trình hướng đối tượng',
      courseId: 'oop',
      enrolledStudents: 3,
      schedule: 'Thứ 6 - 13:30-17:00',
      location: 'Phòng Lab 201',
      duration: '10 tuần',
        status: 'active',
      completionRate: 66,
      averageScore: 7.0,
      activeAssignments: 4,
      instructor: 'TS. Lê Văn Cường'
    },
    {
      id: 12,
      name: '22CT113',
      course: 'Cấu trúc dữ liệu và giải thuật',
      courseId: 'data-struct-algo',
      enrolledStudents: 3,
      schedule: 'Thứ 7 - 13:30-17:00',
      location: 'Phòng Lab 201',
      duration: '10 tuần',
        status: 'active',
      completionRate: 66,
      averageScore: 6.9,
      activeAssignments: 3,
      instructor: 'TS. Lê Văn Cường'
    }
  ],
  
  // Dữ liệu chi tiết cho từng lớp học (key là classId)
  classDetails: {
    // Lớp 1: 22CT111 - Nhập môn lập trình (4 sinh viên: 1, 4, 7, 10)
    1: {
      students: [
        { id: 1, name: 'Nguyễn Văn Minh', studentId: '122000001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 },
        { id: 4, name: 'Phạm Thị Lan', studentId: '122000004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 },
        { id: 7, name: 'Đặng Văn Hùng', studentId: '122000007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 },
        { id: 10, name: 'Ngô Thị Thu', studentId: '122000010', email: 'thu.nt@student.edu.vn', phone: '0901234576', status: 'active', completionRate: 91, averageScore: 8.6, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ],
    assignments: [
        { id: 1, title: 'Bài tập 1: Biến và Kiểu dữ liệu', description: 'Làm quen với các kiểu dữ liệu cơ bản', status: 'completed', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 4, totalStudents: 4, averageScore: 7.95 },
        { id: 2, title: 'Bài tập 2: Cấu trúc điều khiển', description: 'Làm việc với câu lệnh if-else và vòng lặp', status: 'active', startDate: '25/11/2024', dueDate: '05/12/2024', submittedCount: 3, totalStudents: 4, averageScore: 8.1 }
      ],
    schedule: [
        { title: 'Buổi 1: Giới thiệu lập trình', description: 'Tìm hiểu về lập trình', type: 'lecture', date: '01/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.6, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 2: Biến và kiểu dữ liệu', description: 'Thực hành khai báo biến', type: 'lecture', date: '08/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.0, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 3: Toán tử và biểu thức', description: 'Các phép toán cơ bản', type: 'lecture', date: '15/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.2, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 4: Cấu trúc rẽ nhánh', description: 'Câu lệnh if-else', type: 'lecture', date: '22/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.8, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 5: Vòng lặp for', description: 'Làm quen với vòng lặp', type: 'lecture', date: '29/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.1, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 6: Vòng lặp while', description: 'Vòng lặp điều kiện', type: 'lecture', date: '06/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.0, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 7: Mảng 1 chiều', description: 'Làm việc với mảng', type: 'lecture', date: '13/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.9, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 8: Mảng 2 chiều', description: 'Ma trận và xử lý', type: 'lecture', date: '20/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.7, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 9: Hàm cơ bản', description: 'Định nghĩa và sử dụng hàm', type: 'lecture', date: '27/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.3, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 10: Tham số và đệ quy', description: 'Hàm đệ quy', type: 'lecture', date: '03/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.1, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 11: Bài tập tổng hợp', description: 'Ôn tập và thực hành', type: 'lab', date: '10/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'active', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 12: Thi cuối kỳ', description: 'Kiểm tra đánh giá', type: 'exam', date: '17/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'upcoming', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] }
      ]
    },
    // Lớp 2: 22CT111 - Kĩ thuật lập trình (4 sinh viên: 1, 4, 7, 10)
    2: { 
      students: [
        { id: 1, name: 'Nguyễn Văn Minh', studentId: '122000001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 },
        { id: 4, name: 'Phạm Thị Lan', studentId: '122000004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 },
        { id: 7, name: 'Đặng Văn Hùng', studentId: '122000007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 },
        { id: 10, name: 'Ngô Thị Thu', studentId: '122000010', email: 'thu.nt@student.edu.vn', phone: '0901234576', status: 'active', completionRate: 91, averageScore: 8.6, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [
        { id: 1, title: 'Bài tập 1: Con trỏ cơ bản', description: 'Làm việc với con trỏ', status: 'completed', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 4, totalStudents: 4, averageScore: 7.6 }
      ], 
      schedule: [
        { title: 'Buổi 1: Con trỏ cơ bản', description: 'Giới thiệu con trỏ', type: 'lecture', date: '01/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.2, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 2: Toán tử con trỏ', description: 'Các phép toán với con trỏ', type: 'lecture', date: '08/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.0, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 3: Con trỏ và mảng', description: 'Liên hệ con trỏ mảng', type: 'lecture', date: '15/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.8, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 4: Con trỏ và hàm', description: 'Truyền con trỏ vào hàm', type: 'lecture', date: '22/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.1, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 5: Cấp phát động', description: 'Malloc và free', type: 'lecture', date: '29/09/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.9, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 6: File I/O', description: 'Làm việc với file', type: 'lecture', date: '06/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.0, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 7: Struct cơ bản', description: 'Cấu trúc dữ liệu', type: 'lecture', date: '13/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.7, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 8: Struct nâng cao', description: 'Nested struct', type: 'lecture', date: '20/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.8, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 9: Thực hành tổng hợp', description: 'Bài tập thực hành', type: 'lab', date: '27/10/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.2, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 10: Ôn tập', description: 'Ôn tập kiến thức', type: 'lecture', date: '03/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'active', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 11: Thi giữa kỳ', description: 'Kiểm tra đánh giá', type: 'exam', date: '10/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'upcoming', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 12: Bài tập nâng cao', description: 'Đồ án cuối kỳ', type: 'lab', date: '17/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'upcoming', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] }
      ] 
    },
    // Lớp 3: 22CT111 - Lập trình hướng đối tượng (4 sinh viên: 1, 4, 7, 10)
    3: { 
      students: [
        { id: 1, name: 'Nguyễn Văn Minh', studentId: '122000001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 },
        { id: 4, name: 'Phạm Thị Lan', studentId: '122000004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 },
        { id: 7, name: 'Đặng Văn Hùng', studentId: '122000007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 },
        { id: 10, name: 'Ngô Thị Thu', studentId: '122000010', email: 'thu.nt@student.edu.vn', phone: '0901234576', status: 'active', completionRate: 91, averageScore: 8.6, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: Lớp và đối tượng', description: 'Tạo class cơ bản', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 4, averageScore: 7.5 }], 
      schedule: [{ title: 'Buổi 1: OOP cơ bản', description: 'Giới thiệu OOP', type: 'lecture', date: '04/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.0, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 4: 22CT111 - Cấu trúc dữ liệu và giải thuật (4 sinh viên: 1, 4, 7, 10)
    4: { 
      students: [
        { id: 1, name: 'Nguyễn Văn Minh', studentId: '122000001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 },
        { id: 4, name: 'Phạm Thị Lan', studentId: '122000004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 },
        { id: 7, name: 'Đặng Văn Hùng', studentId: '122000007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 },
        { id: 10, name: 'Ngô Thị Thu', studentId: '122000010', email: 'thu.nt@student.edu.vn', phone: '0901234576', status: 'active', completionRate: 91, averageScore: 8.6, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: Danh sách liên kết', description: 'Cài đặt linked list', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 4, averageScore: 7.3 }], 
      schedule: [{ title: 'Buổi 1: Linked List', description: 'Giới thiệu danh sách liên kết', type: 'lecture', date: '04/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.8, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 5: 22CT112 - Nhập môn lập trình (3 sinh viên: 2, 5, 8)
    5: { 
      students: [
        { id: 2, name: 'Trần Thị Hương', studentId: '122000002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 },
        { id: 5, name: 'Vũ Đức Thành', studentId: '122000005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.4 },
        { id: 8, name: 'Bùi Thị Ngọc', studentId: '122000008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: HTML/CSS cơ bản', description: 'Tạo trang web đầu tiên', status: 'completed', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 3, averageScore: 7.6 }], 
      schedule: [{ title: 'Buổi 1: HTML cơ bản', description: 'Giới thiệu HTML', type: 'lecture', date: '04/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 9.1, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 6: 22CT112 - Kĩ thuật lập trình (3 sinh viên: 2, 5, 8)
    6: { 
      students: [
        { id: 2, name: 'Trần Thị Hương', studentId: '122000002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 },
        { id: 5, name: 'Vũ Đức Thành', studentId: '122000005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.4 },
        { id: 8, name: 'Bùi Thị Ngọc', studentId: '122000008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: Functions', description: 'Làm việc với functions', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 3, averageScore: 7.5 }], 
      schedule: [{ title: 'Buổi 1: Functions', description: 'Giới thiệu functions', type: 'lecture', date: '04/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.9, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 7: 22CT112 - Lập trình hướng đối tượng (3 sinh viên: 2, 5, 8)
    7: { 
      students: [
        { id: 2, name: 'Trần Thị Hương', studentId: '122000002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 },
        { id: 5, name: 'Vũ Đức Thành', studentId: '122000005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.4 },
        { id: 8, name: 'Bùi Thị Ngọc', studentId: '122000008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: Classes', description: 'Tạo classes', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 3, averageScore: 7.4 }], 
      schedule: [{ title: 'Buổi 1: Classes', description: 'Giới thiệu classes', type: 'lecture', date: '04/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.7, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 8: 22CT112 - Cấu trúc dữ liệu và giải thuật (3 sinh viên: 2, 5, 8)
    8: { 
      students: [
        { id: 2, name: 'Trần Thị Hương', studentId: '122000002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 },
        { id: 5, name: 'Vũ Đức Thành', studentId: '122000005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.4 },
        { id: 8, name: 'Bùi Thị Ngọc', studentId: '122000008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [
        { id: 1, title: 'Bài tập 1: Stack & Queue', description: 'Cài đặt stack và queue', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 3, averageScore: 8.4 }
      ], 
      schedule: [
        { title: 'Buổi 1: Giới thiệu CTDL&GT', description: 'Tổng quan về cấu trúc dữ liệu', type: 'lecture', date: '01/09/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 9.2, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 2: Array & Linked List', description: 'Mảng và danh sách liên kết', type: 'lecture', date: '08/09/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 9.0, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 3: Stack cơ bản', description: 'Cấu trúc dữ liệu Stack', type: 'lecture', date: '15/09/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.8, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 4: Queue cơ bản', description: 'Cấu trúc dữ liệu Queue', type: 'lecture', date: '22/09/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 9.1, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 5: Thực hành Stack & Queue', description: 'Bài tập thực hành', type: 'lab', date: '29/09/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.9, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 6: Tree cơ bản', description: 'Cây nhị phân', type: 'lecture', date: '06/10/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 9.0, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 7: Binary Search Tree', description: 'Cây tìm kiếm nhị phân', type: 'lecture', date: '13/10/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.7, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 8: AVL Tree', description: 'Cây AVL cân bằng', type: 'lecture', date: '20/10/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.5, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 9: Graph cơ bản', description: 'Đồ thị và biểu diễn', type: 'lecture', date: '27/10/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.6, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 10: Thuật toán sắp xếp', description: 'Các thuật toán sắp xếp cơ bản', type: 'lecture', date: '03/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'active', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 11: Thuật toán tìm kiếm', description: 'Các thuật toán tìm kiếm', type: 'lecture', date: '10/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'upcoming', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] },
        { title: 'Buổi 12: Ôn tập và thi cuối kỳ', description: 'Tổng kết và đánh giá', type: 'exam', date: '17/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'upcoming', attendanceRate: 0, attendedStudents: 0, absentStudents: 0, lateStudents: 0, materials: [] }
      ] 
    },
    // Lớp 9: 22CT113 - Nhập môn lập trình (3 sinh viên: 3, 6, 9)
    9: { 
      students: [
        { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 60, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.2 },
        { id: 6, name: 'Hoàng Thị Mai', studentId: '122000006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.6 },
        { id: 9, name: 'Lý Minh Tuấn', studentId: '122000009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 4.5, completedAssignments: 7, totalAssignments: 10, scoreChange: -0.6 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: Cơ bản', description: 'Bài tập cơ bản', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.4 }], 
      schedule: [{ title: 'Buổi 1: Cơ bản', description: 'Giới thiệu', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 8.3, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 10: 22CT113 - Kĩ thuật lập trình (3 sinh viên: 3, 6, 9)
    10: { 
      students: [
        { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 60, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.2 },
        { id: 6, name: 'Hoàng Thị Mai', studentId: '122000006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.6 },
        { id: 9, name: 'Lý Minh Tuấn', studentId: '122000009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 4.5, completedAssignments: 7, totalAssignments: 10, scoreChange: -0.6 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: Advanced', description: 'Bài tập nâng cao', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.2 }], 
      schedule: [{ title: 'Buổi 1: Advanced', description: 'Nội dung nâng cao', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 8.1, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 11: 22CT113 - Lập trình hướng đối tượng (3 sinh viên: 3, 6, 9)
    11: { 
      students: [
        { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 60, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.2 },
        { id: 6, name: 'Hoàng Thị Mai', studentId: '122000006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.6 },
        { id: 9, name: 'Lý Minh Tuấn', studentId: '122000009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 4.5, completedAssignments: 7, totalAssignments: 10, scoreChange: -0.6 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: OOP', description: 'Bài tập OOP', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.0 }], 
      schedule: [{ title: 'Buổi 1: OOP', description: 'Lập trình OOP', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 7.9, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] 
    },
    // Lớp 12: 22CT113 - Cấu trúc dữ liệu và giải thuật (3 sinh viên: 3, 6, 9)
    12: { 
      students: [
        { id: 3, name: 'Lê Hoàng Nam', studentId: '122000003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 60, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.2 },
        { id: 6, name: 'Hoàng Thị Mai', studentId: '122000006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.6 },
        { id: 9, name: 'Lý Minh Tuấn', studentId: '122000009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 4.5, completedAssignments: 7, totalAssignments: 10, scoreChange: -0.6 }
      ], 
      assignments: [{ id: 1, title: 'Bài tập 1: Algorithms', description: 'Bài tập thuật toán', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 6.9 }], 
      schedule: [{ title: 'Buổi 1: Algorithms', description: 'Giới thiệu thuật toán', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 7.7, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] 
    }
  }
};