export const mockDashboardData = {
  kpiMetrics: {
    totalStudents: 150,
    studentChange: 12,
    totalTeachers: 14,
    teacherChange: 1,
    ongoingClasses: 2,
    classChange: 2,
    averageProgress: 78.5,
    progressChange: 3.2,
    graduationRate: 85.2,
    graduationChange: 2.5,
    employmentRate: 92.5,
    employmentChange: 1.8
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
      enrolledStudents: 10,
      duration: '12 tuần',
      status: 'active',
      completionRate: 78,
      averageScore: 7.8
    },
    {
      name: 'Kĩ thuật lập trình',
      enrolledStudents: 10,
      duration: '10 tuần',
      status: 'active',
      completionRate: 70,
      averageScore: 7.2
    },
    {
      name: 'Lập trình hướng đối tượng',
      enrolledStudents: 10,
      duration: '16 tuần',
      status: 'active',
      completionRate: 68,
      averageScore: 7.5
    },
    {
      name: 'Cấu trúc dữ liệu và giải thuật',
      enrolledStudents: 10,
      duration: '12 tuần',
      status: 'active',
      completionRate: 72,
      averageScore: 7.6
    }
  ],
  
  notifications: [
    {
      id: 1,
      type: 'warning',
      priority: 'high',
      title: 'Sinh viên có nguy cơ bỏ học',
      message: '15 sinh viên trong khóa "Nhập môn lập trình" có tỷ lệ hoàn thành dưới 30%',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 2,
      type: 'info',
      priority: 'medium',
      title: 'Báo cáo tiến độ tuần',
      message: 'Báo cáo tiến độ học tập tuần này đã sẵn sàng để xem',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 3,
      type: 'success',
      priority: 'low',
      title: 'Khóa học hoàn thành',
      message: 'Khóa "Kĩ thuật lập trình" đã hoàn thành với 98% sinh viên đạt yêu cầu',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      read: true
    },
    {
      id: 4,
      type: 'reminder',
      priority: 'medium',
      title: 'Deadline nộp bài tập',
      message: 'Nhắc nhở: Bài tập lớn môn "Cấu trúc dữ liệu và giải thuật" sẽ hết hạn trong 3 ngày',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false
    },
    {
      id: 5,
      type: 'info',
      priority: 'low',
      title: 'Cập nhật hệ thống',
      message: 'Hệ thống sẽ được bảo trì vào 2:00 AM ngày mai',
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true
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
  ]
};

// Dữ liệu mock cho quản lý ngành
export const mockDepartmentData = {
  departmentInfo: {
    name: 'Khoa Công Nghệ Thông Tin',
    code: 'CNTT',
    description: 'Khoa Công Nghệ Thông Tin - Đào tạo chuyên sâu về lập trình, hệ thống và công nghệ',
    establishedYear: 2005,
    totalStudents: 150,
    totalTeachers: 14,
    totalCourses: 12,
    totalClasses: 24
  },
  
  teachers: [
    {
      id: 1,
      name: 'TS. Nguyễn Văn An',
      email: 'an.nv@university.edu.vn',
      phone: '0901234567',
      position: 'Trưởng khoa',
      department: 'CNTT',
      specialization: 'Lập trình, Cấu trúc dữ liệu',
      experience: 15,
      status: 'active',
      totalClasses: 4,
      totalStudents: 45,
      averageRating: 4.8,
      joinDate: '2010-09-01',
      education: 'Tiến sĩ Công nghệ Thông tin - Đại học Bách Khoa',
      researchAreas: ['Machine Learning', 'Data Structures', 'Algorithm Design'],
      publications: 25,
      projects: 12
    },
    {
      id: 2,
      name: 'TS. Trần Thị Bình',
      email: 'binh.tt@university.edu.vn',
      phone: '0901234568',
      position: 'Phó trưởng khoa',
      department: 'CNTT',
      specialization: 'Lập trình hướng đối tượng, Phát triển phần mềm',
      experience: 12,
      status: 'active',
      totalClasses: 3,
      totalStudents: 36,
      averageRating: 4.7,
      joinDate: '2012-03-01',
      education: 'Tiến sĩ Khoa học Máy tính - Đại học Quốc gia',
      researchAreas: ['Software Engineering', 'Object-Oriented Programming', 'Web Development'],
      publications: 18,
      projects: 8
    },
    {
      id: 3,
      name: 'TS. Lê Văn Cường',
      email: 'cuong.lv@university.edu.vn',
      phone: '0901234569',
      position: 'Giảng viên chính',
      department: 'CNTT',
      specialization: 'Cơ sở dữ liệu, Hệ thống thông tin',
      experience: 10,
      status: 'active',
      totalClasses: 3,
      totalStudents: 42,
      averageRating: 4.6,
      joinDate: '2014-08-01',
      education: 'Tiến sĩ Hệ thống Thông tin - Đại học Công nghệ',
      researchAreas: ['Database Systems', 'Information Systems', 'Data Mining'],
      publications: 15,
      projects: 6
    },
    {
      id: 4,
      name: 'ThS. Phạm Thị Dung',
      email: 'dung.pt@university.edu.vn',
      phone: '0901234570',
      position: 'Giảng viên',
      department: 'CNTT',
      specialization: 'Mạng máy tính, An toàn thông tin',
      experience: 8,
      status: 'active',
      totalClasses: 2,
      totalStudents: 30,
      averageRating: 4.5,
      joinDate: '2016-09-01',
      education: 'Thạc sĩ An toàn Thông tin - Đại học Bách Khoa',
      researchAreas: ['Network Security', 'Cybersecurity', 'Computer Networks'],
      publications: 12,
      projects: 4
    },
    {
      id: 5,
      name: 'ThS. Hoàng Văn Em',
      email: 'em.hv@university.edu.vn',
      phone: '0901234571',
      position: 'Giảng viên',
      department: 'CNTT',
      specialization: 'Trí tuệ nhân tạo, Machine Learning',
      experience: 6,
      status: 'active',
      totalClasses: 2,
      totalStudents: 24,
      averageRating: 4.4,
      joinDate: '2018-02-01',
      education: 'Thạc sĩ Trí tuệ Nhân tạo - Đại học Quốc tế',
      researchAreas: ['Artificial Intelligence', 'Machine Learning', 'Deep Learning'],
      publications: 8,
      projects: 3
    },
    {
      id: 6,
      name: 'ThS. Vũ Thị Phương',
      email: 'phuong.vt@university.edu.vn',
      phone: '0901234572',
      position: 'Giảng viên',
      department: 'CNTT',
      specialization: 'Thiết kế giao diện, UX/UI',
      experience: 5,
      status: 'active',
      totalClasses: 2,
      totalStudents: 28,
      averageRating: 4.3,
      joinDate: '2019-08-01',
      education: 'Thạc sĩ Thiết kế Đồ họa - Đại học Mỹ thuật',
      researchAreas: ['User Experience', 'User Interface Design', 'Human-Computer Interaction'],
      publications: 6,
      projects: 2
    },
    {
      id: 7,
      name: 'ThS. Đặng Văn Giang',
      email: 'giang.dv@university.edu.vn',
      phone: '0901234573',
      position: 'Giảng viên',
      department: 'CNTT',
      specialization: 'Phát triển ứng dụng di động',
      experience: 4,
      status: 'active',
      totalClasses: 1,
      totalStudents: 20,
      averageRating: 4.2,
      joinDate: '2020-09-01',
      education: 'Thạc sĩ Công nghệ Thông tin - Đại học Công nghệ',
      researchAreas: ['Mobile Development', 'Cross-platform Development', 'Mobile Security'],
      publications: 4,
      projects: 1
    },
    {
      id: 8,
      name: 'ThS. Bùi Thị Hoa',
      email: 'hoa.bt@university.edu.vn',
      phone: '0901234574',
      position: 'Giảng viên',
      department: 'CNTT',
      specialization: 'Phân tích dữ liệu, Business Intelligence',
      experience: 3,
      status: 'active',
      totalClasses: 1,
      totalStudents: 18,
      averageRating: 4.1,
      joinDate: '2021-03-01',
      education: 'Thạc sĩ Khoa học Dữ liệu - Đại học Quốc gia',
      researchAreas: ['Data Analytics', 'Business Intelligence', 'Big Data'],
      publications: 3,
      projects: 1
    },
    {
      id: 9,
      name: 'TS. Nguyen Hai Long',
      email: 'long.nh@university.edu.vn',
      phone: '0901234575',
      position: 'Giang vien',
      department: 'CNTT',
      specialization: 'Khoa hoc du lieu, Machine Learning',
      experience: 7,
      status: 'active',
      totalClasses: 2,
      totalStudents: 26,
      averageRating: 4.35,
      joinDate: '2017-01-15',
      education: 'Tien si Khoa hoc Du lieu - DH Quoc gia',
      researchAreas: ['Data Science', 'Machine Learning', 'MLOps'],
      publications: 10,
      projects: 5
    },
    {
      id: 10,
      name: 'ThS. Tran Minh Khoi',
      email: 'khoi.tm@university.edu.vn',
      phone: '0901234576',
      position: 'Giang vien',
      department: 'CNTT',
      specialization: 'Blockchain, An toan he thong',
      experience: 5,
      status: 'active',
      totalClasses: 2,
      totalStudents: 22,
      averageRating: 4.2,
      joinDate: '2019-05-10',
      education: 'Thac si An toan thong tin - DH Bach Khoa',
      researchAreas: ['Blockchain', 'Security', 'Distributed Systems'],
      publications: 6,
      projects: 3
    },
    {
      id: 11,
      name: 'TS. Pham Lan Chi',
      email: 'chi.pl@university.edu.vn',
      phone: '0901234577',
      position: 'Giang vien',
      department: 'CNTT',
      specialization: 'Thi giac may tinh, Deep Learning',
      experience: 9,
      status: 'active',
      totalClasses: 3,
      totalStudents: 34,
      averageRating: 4.6,
      joinDate: '2015-11-20',
      education: 'Tien si Thi giac may tinh - DH Quoc te',
      researchAreas: ['Computer Vision', 'Deep Learning', 'Image Processing'],
      publications: 16,
      projects: 7
    },
    {
      id: 12,
      name: 'ThS. Hoang Nhat Quang',
      email: 'quang.hn@university.edu.vn',
      phone: '0901234578',
      position: 'Giang vien',
      department: 'CNTT',
      specialization: 'DevOps, Cloud',
      experience: 6,
      status: 'active',
      totalClasses: 2,
      totalStudents: 25,
      averageRating: 4.25,
      joinDate: '2018-07-12',
      education: 'Thac si Khoa hoc May tinh - DH Cong nghe',
      researchAreas: ['Cloud Computing', 'DevOps', 'SRE'],
      publications: 5,
      projects: 4
    },
    {
      id: 13,
      name: 'TS. Vu Mai Anh',
      email: 'anh.vm@university.edu.vn',
      phone: '0901234579',
      position: 'Giang vien',
      department: 'CNTT',
      specialization: 'Khoa hoc du lieu, Thong ke ung dung',
      experience: 8,
      status: 'active',
      totalClasses: 3,
      totalStudents: 32,
      averageRating: 4.55,
      joinDate: '2016-04-05',
      education: 'Tien si Thong ke - DH Quoc gia',
      researchAreas: ['Statistics', 'Data Analytics', 'Predictive Modeling'],
      publications: 12,
      projects: 6
    },
    {
      id: 14,
      name: 'ThS. Le Thanh Tung',
      email: 'tung.lt@university.edu.vn',
      phone: '0901234580',
      position: 'Giang vien',
      department: 'CNTT',
      specialization: 'Tri tue nhan tao, Xu ly ngon ngu tu nhien',
      experience: 4,
      status: 'active',
      totalClasses: 1,
      totalStudents: 18,
      averageRating: 4.15,
      joinDate: '2021-02-01',
      education: 'Thac si AI - DH Quoc te',
      researchAreas: ['NLP', 'AI', 'Chatbot'],
      publications: 4,
      projects: 2
    }
  ],
  
  departmentStats: {
    totalStudents: 150,
    totalTeachers: 14,
    totalCourses: 12,
    totalClasses: 24,
    averageClassSize: 6.25,
    graduationRate: 85.2,
    employmentRate: 92.5,
    researchProjects: 45,
    publications: 91,
    averageStudentRating: 4.3,
    averageTeacherRating: 4.5
  }
};

export const mockAssignmentData = {
  stats: {
    totalAssignments: 12,
    assignmentChange: 5.2,
    activeAssignments: 4,
    completedAssignments: 6,
    overdueAssignments: 2,
    averageSubmissionRate: 78,
    averageScore: 7.5
  },
  assignments: [
    {
      id: 1,
      title: 'Bai tap 1: Bien va kieu du lieu',
      description: 'Lam quen voi kieu du lieu co ban va cach khai bao bien.',
      difficulty: 'Easy',
      status: 'completed',
      course: 'Nhap mon lap trinh',
      courseId: 'intro-prog',
      className: '22CT111',
      classId: 1,
      startDate: '2024-11-15',
      dueDate: '2024-11-22',
      submittedCount: 18,
      totalStudents: 20,
      averageScore: 78,
      lateSubmissions: 3,
      updatedAt: '2024-11-22'
    },
    {
      id: 2,
      title: 'Bai tap 2: Cau truc dieu khien',
      description: 'If/else, vong lap, tim so lon nhat, bang cuu chuong, so nguyen to.',
      difficulty: 'Medium',
      status: 'active',
      course: 'Nhap mon lap trinh',
      courseId: 'intro-prog',
      className: '22CT111',
      classId: 1,
      startDate: '2024-11-25',
      dueDate: '2024-12-05',
      submittedCount: 5,
      totalStudents: 20,
      averageScore: 0,
      lateSubmissions: 0,
      updatedAt: '2024-12-01'
    },
    {
      id: 3,
      title: 'OOP: Ke thua va da hinh',
      description: 'Xay dung class, interface, override methods, polymorphism.',
      difficulty: 'Hard',
      status: 'upcoming',
      course: 'Lap trinh huong doi tuong',
      courseId: 'oop',
      className: '22CT112',
      classId: 3,
      startDate: '2024-12-10',
      dueDate: '2024-12-20',
      submittedCount: 0,
      totalStudents: 18,
      averageScore: 0,
      lateSubmissions: 0,
      updatedAt: '2024-12-01'
    },
    {
      id: 4,
      title: 'Data Structures: Stack & Queue',
      description: 'Cai dat stack, queue; ung dung trong bai toan ngoac dung.',
      difficulty: 'Medium',
      status: 'active',
      course: 'Cau truc du lieu',
      courseId: 'data-struct-algo',
      className: '22CT113',
      classId: 8,
      startDate: '2024-11-28',
      dueDate: '2024-12-08',
      submittedCount: 9,
      totalStudents: 16,
      averageScore: 0,
      lateSubmissions: 1,
      updatedAt: '2024-12-02'
    },
    {
      id: 5,
      title: 'Machine Learning mini project',
      description: 'Xay dung model phan loai don gian (SVM/Logistic).',
      difficulty: 'Hard',
      status: 'draft',
      course: 'Machine Learning',
      courseId: 'ml',
      className: '22CT201',
      classId: 11,
      startDate: '2024-12-15',
      dueDate: '2024-12-30',
      submittedCount: 0,
      totalStudents: 12,
      averageScore: 0,
      lateSubmissions: 0,
      updatedAt: '2024-12-01'
    }
  ]
};

export const mockStudentTrackingData = {
  students: []
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
    // Lớp 22CT111
    {
      id: 1,
      name: '22CT111',
      course: 'Nhập môn lập trình',
      courseId: 'intro-prog',
      enrolledStudents: 3,
      schedule: 'Thứ 2, 4 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 85,
      averageScore: 7.8,
      activeAssignments: 3,
      instructor: 'TS. Nguyễn Văn An'
    },
    {
      id: 2,
      name: '22CT111',
      course: 'Kĩ thuật lập trình',
      courseId: 'prog-technique',
      enrolledStudents: 3,
      schedule: 'Thứ 3, 5 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 80,
      averageScore: 7.6,
      activeAssignments: 2,
      instructor: 'TS. Nguyễn Văn An'
    },
    {
      id: 3,
      name: '22CT111',
      course: 'Lập trình hướng đối tượng',
      courseId: 'oop',
      enrolledStudents: 3,
      schedule: 'Thứ 6 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 78,
      averageScore: 7.5,
      activeAssignments: 2,
      instructor: 'TS. Nguyễn Văn An'
    },
    {
      id: 4,
      name: '22CT111',
      course: 'Cấu trúc dữ liệu và giải thuật',
      courseId: 'data-struct-algo',
      enrolledStudents: 3,
      schedule: 'Thứ 7 - 8:00-11:00',
      location: 'Phòng Lab 301',
      duration: '12 tuần',
      status: 'active',
      completionRate: 75,
      averageScore: 7.3,
      activeAssignments: 3,
      instructor: 'TS. Nguyễn Văn An'
    },
    // Lớp 22CT112
    {
      id: 5,
      name: '22CT112',
      course: 'Nhập môn lập trình',
      courseId: 'intro-prog',
      enrolledStudents: 4,
      schedule: 'Thứ 2, 4 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 82,
      averageScore: 7.6,
      activeAssignments: 2,
      instructor: 'TS. Trần Thị Bình'
    },
    {
      id: 6,
      name: '22CT112',
      course: 'Kĩ thuật lập trình',
      courseId: 'prog-technique',
      enrolledStudents: 4,
      schedule: 'Thứ 3, 5 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 78,
      averageScore: 7.5,
      activeAssignments: 3,
      instructor: 'TS. Trần Thị Bình'
    },
    {
      id: 7,
      name: '22CT112',
      course: 'Lập trình hướng đối tượng',
      courseId: 'oop',
      enrolledStudents: 4,
      schedule: 'Thứ 6 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 76,
      averageScore: 7.4,
      activeAssignments: 2,
      instructor: 'TS. Trần Thị Bình'
    },
    {
      id: 8,
      name: '22CT112',
      course: 'Cấu trúc dữ liệu và giải thuật',
      courseId: 'data-struct-algo',
      enrolledStudents: 4,
      schedule: 'Thứ 7 - 13:30-16:30',
      location: 'Phòng Lab 302',
      duration: '12 tuần',
      status: 'active',
      completionRate: 74,
      averageScore: 7.2,
      activeAssignments: 3,
      instructor: 'TS. Trần Thị Bình'
    },
    // Lớp 22CT113
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
      completionRate: 80,
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
      completionRate: 75,
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
      completionRate: 72,
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
      completionRate: 70,
      averageScore: 6.9,
      activeAssignments: 3,
      instructor: 'TS. Lê Văn Cường'
    }
  ],
  
  // Dữ liệu chi tiết cho từng lớp học (key là classId)
  classDetails: {
    // Lớp 1-4: 22CT111 (3 sinh viên)
    1: {
      students: [
        { id: 1, name: 'Nguyễn Văn Minh', studentId: 'SV001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 },
        { id: 2, name: 'Trần Thị Hương', studentId: 'SV002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 },
        { id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }
      ],
    assignments: [
        { id: 1, title: 'Bài tập 1: Biến và Kiểu dữ liệu', description: 'Làm quen với các kiểu dữ liệu cơ bản', status: 'completed', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 3, averageScore: 7.8 },
        { id: 2, title: 'Bài tập 2: Cấu trúc điều khiển', description: 'Làm việc với câu lệnh if-else và vòng lặp', status: 'active', startDate: '25/11/2024', dueDate: '05/12/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.2 }
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
    2: { 
      students: [
        { id: 1, name: 'Nguyễn Văn Minh', studentId: 'SV001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 }, 
        { id: 2, name: 'Trần Thị Hương', studentId: 'SV002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 }, 
        { id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }
      ], 
      assignments: [
        { id: 1, title: 'Bài tập 1: Con trỏ cơ bản', description: 'Làm việc với con trỏ', status: 'completed', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 3, averageScore: 7.6 }
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
    3: { students: [{ id: 1, name: 'Nguyễn Văn Minh', studentId: 'SV001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 }, { id: 2, name: 'Trần Thị Hương', studentId: 'SV002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 }, { id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }], assignments: [{ id: 1, title: 'Bài tập 1: Lớp và đối tượng', description: 'Tạo class cơ bản', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.5 }], schedule: [{ title: 'Buổi 1: OOP cơ bản', description: 'Giới thiệu OOP', type: 'lecture', date: '04/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 9.0, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] },
    4: { students: [{ id: 1, name: 'Nguyễn Văn Minh', studentId: 'SV001', email: 'minh.nv@student.edu.vn', phone: '0901234567', status: 'active', completionRate: 90, averageScore: 8.5, completedAssignments: 8, totalAssignments: 10, scoreChange: 0.5 }, { id: 2, name: 'Trần Thị Hương', studentId: 'SV002', email: 'huong.tt@student.edu.vn', phone: '0901234568', status: 'active', completionRate: 85, averageScore: 8.0, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.2 }, { id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }], assignments: [{ id: 1, title: 'Bài tập 1: Danh sách liên kết', description: 'Cài đặt linked list', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.3 }], schedule: [{ title: 'Buổi 1: Linked List', description: 'Giới thiệu danh sách liên kết', type: 'lecture', date: '04/11/2024', time: '8:00 - 11:00', location: 'Phòng Lab 301', status: 'completed', attendanceRate: 8.8, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] },
    5: { students: [{ id: 5, name: 'Vũ Đức Thành', studentId: 'SV005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.3 }, { id: 4, name: 'Phạm Thị Lan', studentId: 'SV004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 }, { id: 7, name: 'Đặng Văn Hùng', studentId: 'SV007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 }, { id: 8, name: 'Bùi Thị Ngọc', studentId: 'SV008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.4 }], assignments: [{ id: 1, title: 'Bài tập 1: HTML/CSS cơ bản', description: 'Tạo trang web đầu tiên', status: 'completed', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 4, totalStudents: 4, averageScore: 7.6 }], schedule: [{ title: 'Buổi 1: HTML cơ bản', description: 'Giới thiệu HTML', type: 'lecture', date: '04/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 9.1, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] }] },
    6: { students: [{ id: 5, name: 'Vũ Đức Thành', studentId: 'SV005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.3 }, { id: 4, name: 'Phạm Thị Lan', studentId: 'SV004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 }, { id: 7, name: 'Đặng Văn Hùng', studentId: 'SV007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 }, { id: 8, name: 'Bùi Thị Ngọc', studentId: 'SV008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.4 }], assignments: [{ id: 1, title: 'Bài tập 1: Functions', description: 'Làm việc với functions', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 4, averageScore: 7.5 }], schedule: [{ title: 'Buổi 1: Functions', description: 'Giới thiệu functions', type: 'lecture', date: '04/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.9, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] }] },
    7: { students: [{ id: 5, name: 'Vũ Đức Thành', studentId: 'SV005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.3 }, { id: 4, name: 'Phạm Thị Lan', studentId: 'SV004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 }, { id: 7, name: 'Đặng Văn Hùng', studentId: 'SV007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 }, { id: 8, name: 'Bùi Thị Ngọc', studentId: 'SV008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.4 }], assignments: [{ id: 1, title: 'Bài tập 1: Classes', description: 'Tạo classes', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 4, averageScore: 7.4 }], schedule: [{ title: 'Buổi 1: Classes', description: 'Giới thiệu classes', type: 'lecture', date: '04/11/2024', time: '13:30 - 16:30', location: 'Phòng Lab 302', status: 'completed', attendanceRate: 8.7, attendedStudents: 4, absentStudents: 0, lateStudents: 0, materials: [] }] },
    8: { 
      students: [
        { id: 5, name: 'Vũ Đức Thành', studentId: 'SV005', email: 'thanh.vd@student.edu.vn', phone: '0901234571', status: 'active', completionRate: 95, averageScore: 9.0, completedAssignments: 9, totalAssignments: 10, scoreChange: 0.3 }, 
        { id: 4, name: 'Phạm Thị Lan', studentId: 'SV004', email: 'lan.pt@student.edu.vn', phone: '0901234570', status: 'active', completionRate: 78, averageScore: 7.5, completedAssignments: 6, totalAssignments: 10, scoreChange: 0.2 }, 
        { id: 7, name: 'Đặng Văn Hùng', studentId: 'SV007', email: 'hung.dv@student.edu.vn', phone: '0901234573', status: 'active', completionRate: 72, averageScore: 7.2, completedAssignments: 5, totalAssignments: 10, scoreChange: -0.1 }, 
        { id: 8, name: 'Bùi Thị Ngọc', studentId: 'SV008', email: 'ngoc.bt@student.edu.vn', phone: '0901234574', status: 'active', completionRate: 89, averageScore: 8.4, completedAssignments: 7, totalAssignments: 10, scoreChange: 0.4 }
      ], 
      assignments: [
        { id: 1, title: 'Bài tập 1: Stack & Queue', description: 'Cài đặt stack và queue', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 3, totalStudents: 4, averageScore: 7.2 }
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
    9: { students: [{ id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }, { id: 6, name: 'Hoàng Thị Mai', studentId: 'SV006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.1 }, { id: 9, name: 'Lý Minh Tuấn', studentId: 'SV009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 5.5, completedAssignments: 3, totalAssignments: 10, scoreChange: -0.6 }], assignments: [{ id: 1, title: 'Bài tập 1: Cơ bản', description: 'Bài tập cơ bản', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.4 }], schedule: [{ title: 'Buổi 1: Cơ bản', description: 'Giới thiệu', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 8.3, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] },
    10: { students: [{ id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }, { id: 6, name: 'Hoàng Thị Mai', studentId: 'SV006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.1 }, { id: 9, name: 'Lý Minh Tuấn', studentId: 'SV009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 5.5, completedAssignments: 3, totalAssignments: 10, scoreChange: -0.6 }], assignments: [{ id: 1, title: 'Bài tập 1: Advanced', description: 'Bài tập nâng cao', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.2 }], schedule: [{ title: 'Buổi 1: Advanced', description: 'Nội dung nâng cao', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 8.1, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] },
    11: { students: [{ id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }, { id: 6, name: 'Hoàng Thị Mai', studentId: 'SV006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.1 }, { id: 9, name: 'Lý Minh Tuấn', studentId: 'SV009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 5.5, completedAssignments: 3, totalAssignments: 10, scoreChange: -0.6 }], assignments: [{ id: 1, title: 'Bài tập 1: OOP', description: 'Bài tập OOP', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 7.0 }], schedule: [{ title: 'Buổi 1: OOP', description: 'Lập trình OOP', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 7.9, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] },
    12: { students: [{ id: 3, name: 'Lê Hoàng Nam', studentId: 'SV003', email: 'nam.lh@student.edu.vn', phone: '0901234569', status: 'at_risk', completionRate: 45, averageScore: 6.0, completedAssignments: 4, totalAssignments: 10, scoreChange: -0.4 }, { id: 6, name: 'Hoàng Thị Mai', studentId: 'SV006', email: 'mai.ht@student.edu.vn', phone: '0901234572', status: 'completed', completionRate: 100, averageScore: 9.2, completedAssignments: 10, totalAssignments: 10, scoreChange: 0.1 }, { id: 9, name: 'Lý Minh Tuấn', studentId: 'SV009', email: 'tuan.lm@student.edu.vn', phone: '0901234575', status: 'at_risk', completionRate: 38, averageScore: 5.5, completedAssignments: 3, totalAssignments: 10, scoreChange: -0.6 }], assignments: [{ id: 1, title: 'Bài tập 1: Algorithms', description: 'Bài tập thuật toán', status: 'active', startDate: '15/11/2024', dueDate: '22/11/2024', submittedCount: 2, totalStudents: 3, averageScore: 6.9 }], schedule: [{ title: 'Buổi 1: Algorithms', description: 'Giới thiệu thuật toán', type: 'lecture', date: '04/11/2024', time: '13:30 - 17:00', location: 'Phòng Lab 201', status: 'completed', attendanceRate: 7.7, attendedStudents: 3, absentStudents: 0, lateStudents: 0, materials: [] }] }
  }
};


