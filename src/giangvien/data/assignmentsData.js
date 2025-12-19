/**
 * Danh sách 20 bài tập chung cho tất cả sinh viên (4 môn × 5 bài tập)
 * Bài tập được giao cho tất cả 10 sinh viên từ 3 lớp: 22CT111, 22CT112, 22CT113
 *
 * Sinh viên và trạng thái nộp bài:
 * - SV 1 (Nguyễn Văn Minh): 18/20 bài - tốt
 * - SV 2 (Trần Thị Hương): 17/20 bài - tốt
 * - SV 3 (Lê Hoàng Nam): 8/20 bài - CÓ NGUY CƠ (12 bài missing)
 * - SV 4 (Phạm Thị Lan): 16/20 bài - khá
 * - SV 5 (Vũ Đức Thành): 19/20 bài - xuất sắc
 * - SV 6 (Hoàng Thị Mai): 20/20 bài - hoàn thành
 * - SV 7 (Đặng Văn Hùng): 14/20 bài - trung bình
 * - SV 8 (Bùi Thị Ngọc): 18/20 bài - tốt
 * - SV 9 (Lý Minh Tuấn): 8/20 bài - CÓ NGUY CƠ (12 bài missing)
 * - SV 10 (Ngô Thị Thu): 18/20 bài - tốt
 *
 * Tổng: 156/200 bài = 78% submission rate
 */

// Danh sách bài tập đầy đủ - CHUNG cho tất cả lớp (10 sinh viên)
export const ASSIGNMENTS_LIST = [
  // ========== MÔN 1: NHẬP MÔN LẬP TRÌNH (5 bài) ==========
  {
    id: 1,
    title: 'Biến và Kiểu dữ liệu',
    description: 'Làm quen với các kiểu dữ liệu cơ bản và cách khai báo biến',
    instructions:
      'Khai báo biến, các kiểu dữ liệu int/float/string/boolean, nhập xuất dữ liệu',
    course: 'Nhập môn lập trình',
    courseId: 'intro-prog',
    status: 'completed',
    startDate: '2024-09-15T08:00:00',
    dueDate: '2024-09-22T23:59:00',
    updatedAt: '2024-09-23T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 3, // SV 3, 9 nộp muộn + 1 SV khác
    averageScore: 7.8,
    maxScore: 10,
  },
  {
    id: 2,
    title: 'Cấu trúc điều khiển',
    description: 'Làm việc với câu lệnh if-else và switch-case',
    instructions: 'Viết chương trình kiểm tra điều kiện, switch-case, nested if',
    course: 'Nhập môn lập trình',
    courseId: 'intro-prog',
    status: 'completed',
    startDate: '2024-09-25T08:00:00',
    dueDate: '2024-10-02T23:59:00',
    updatedAt: '2024-10-03T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 2, // SV 3, 9 nộp muộn
    averageScore: 7.5,
    maxScore: 10,
  },
  {
    id: 3,
    title: 'Vòng lặp',
    description: 'Sử dụng for, while, do-while để giải quyết bài toán',
    instructions: 'Tính tổng dãy số, in bảng cửu chương, tìm số nguyên tố',
    course: 'Nhập môn lập trình',
    courseId: 'intro-prog',
    status: 'completed',
    startDate: '2024-10-05T08:00:00',
    dueDate: '2024-10-12T23:59:00',
    updatedAt: '2024-10-13T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 1,
    averageScore: 7.8,
    maxScore: 10,
  },
  {
    id: 4,
    title: 'Hàm và thủ tục',
    description: 'Xây dựng và sử dụng hàm trong chương trình',
    instructions: 'Viết hàm tính toán, truyền tham số, giá trị trả về',
    course: 'Nhập môn lập trình',
    courseId: 'intro-prog',
    status: 'completed',
    startDate: '2024-10-15T08:00:00',
    dueDate: '2024-10-22T23:59:00',
    updatedAt: '2024-10-23T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 2,
    averageScore: 8.0,
    maxScore: 10,
  },
  {
    id: 5,
    title: 'Mảng một chiều',
    description: 'Làm việc với mảng và các thao tác cơ bản',
    instructions: 'Khai báo mảng, duyệt mảng, tìm min/max, sắp xếp cơ bản',
    course: 'Nhập môn lập trình',
    courseId: 'intro-prog',
    status: 'active',
    startDate: '2024-12-01T08:00:00',
    dueDate: '2024-12-20T23:59:00',
    updatedAt: '2024-12-15T10:00:00',
    totalStudents: 10,
    submittedCount: 6, // SV 3, 9, 7, 4 chưa nộp (bài active)
    lateSubmissions: 0,
    averageScore: 8.2,
    maxScore: 10,
  },

  // ========== MÔN 2: KĨ THUẬT LẬP TRÌNH (5 bài) ==========
  {
    id: 6,
    title: 'Con trỏ cơ bản',
    description: 'Làm quen với con trỏ và địa chỉ bộ nhớ',
    instructions: 'Khai báo con trỏ, toán tử &, *, truyền tham chiếu',
    course: 'Kĩ thuật lập trình',
    courseId: 'prog-technique',
    status: 'completed',
    startDate: '2024-09-20T08:00:00',
    dueDate: '2024-09-27T23:59:00',
    updatedAt: '2024-09-28T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 4, // SV 3, 9 + 2 SV khác nộp muộn
    averageScore: 7.2,
    maxScore: 10,
  },
  {
    id: 7,
    title: 'Con trỏ và mảng',
    description: 'Sử dụng con trỏ để thao tác với mảng',
    instructions: 'Duyệt mảng bằng con trỏ, pointer arithmetic, mảng con trỏ',
    course: 'Kĩ thuật lập trình',
    courseId: 'prog-technique',
    status: 'completed',
    startDate: '2024-10-01T08:00:00',
    dueDate: '2024-10-08T23:59:00',
    updatedAt: '2024-10-09T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 3, // SV 3, 9 + 1 SV khác nộp muộn
    averageScore: 7.4,
    maxScore: 10,
  },
  {
    id: 8,
    title: 'Cấp phát động',
    description: 'Quản lý bộ nhớ với malloc, calloc, free',
    instructions: 'Cấp phát động, giải phóng bộ nhớ, tránh memory leak',
    course: 'Kĩ thuật lập trình',
    courseId: 'prog-technique',
    status: 'completed',
    startDate: '2024-10-10T08:00:00',
    dueDate: '2024-10-17T23:59:00',
    updatedAt: '2024-10-18T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 1,
    averageScore: 7.5,
    maxScore: 10,
  },
  {
    id: 9,
    title: 'File I/O',
    description: 'Đọc và ghi file trong C/C++',
    instructions: 'Mở/đóng file, đọc/ghi text file, binary file',
    course: 'Kĩ thuật lập trình',
    courseId: 'prog-technique',
    status: 'completed',
    startDate: '2024-10-20T08:00:00',
    dueDate: '2024-10-27T23:59:00',
    updatedAt: '2024-10-28T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 1,
    averageScore: 8.0,
    maxScore: 10,
  },
  {
    id: 10,
    title: 'Struct và Union',
    description: 'Làm việc với kiểu dữ liệu tự định nghĩa',
    instructions: 'Định nghĩa struct, truy cập thành viên, mảng struct',
    course: 'Kĩ thuật lập trình',
    courseId: 'prog-technique',
    status: 'active',
    startDate: '2024-12-05T08:00:00',
    dueDate: '2024-12-25T23:59:00',
    updatedAt: '2024-12-18T10:00:00',
    totalStudents: 10,
    submittedCount: 6, // SV 3, 9, 7, 4 chưa nộp (bài active)
    lateSubmissions: 0,
    averageScore: 7.8,
    maxScore: 10,
  },

  // ========== MÔN 3: LẬP TRÌNH HƯỚNG ĐỐI TƯỢNG (5 bài) ==========
  {
    id: 11,
    title: 'Lớp và đối tượng',
    description: 'Tạo class và khởi tạo đối tượng',
    instructions: 'Định nghĩa class, constructor, destructor, tạo object',
    course: 'Lập trình hướng đối tượng',
    courseId: 'oop',
    status: 'completed',
    startDate: '2024-09-25T08:00:00',
    dueDate: '2024-10-02T23:59:00',
    updatedAt: '2024-10-03T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 2, // SV 3, 9 nộp muộn
    averageScore: 7.6,
    maxScore: 10,
  },
  {
    id: 12,
    title: 'Đóng gói và trừu tượng',
    description: 'Encapsulation và Abstraction trong OOP',
    instructions: 'Private/public, getter/setter, abstract class',
    course: 'Lập trình hướng đối tượng',
    courseId: 'oop',
    status: 'completed',
    startDate: '2024-10-05T08:00:00',
    dueDate: '2024-10-12T23:59:00',
    updatedAt: '2024-10-13T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 3, // SV 3, 9 + 1 SV khác nộp muộn
    averageScore: 7.5,
    maxScore: 10,
  },
  {
    id: 13,
    title: 'Kế thừa',
    description: 'Inheritance và các loại kế thừa',
    instructions: 'Single/multiple inheritance, override methods, super',
    course: 'Lập trình hướng đối tượng',
    courseId: 'oop',
    status: 'completed',
    startDate: '2024-10-15T08:00:00',
    dueDate: '2024-10-22T23:59:00',
    updatedAt: '2024-10-23T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 1,
    averageScore: 7.9,
    maxScore: 10,
  },
  {
    id: 14,
    title: 'Đa hình',
    description: 'Polymorphism và virtual functions',
    instructions: 'Virtual functions, pure virtual, upcasting/downcasting',
    course: 'Lập trình hướng đối tượng',
    courseId: 'oop',
    status: 'completed',
    startDate: '2024-10-25T08:00:00',
    dueDate: '2024-11-01T23:59:00',
    updatedAt: '2024-11-02T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 1,
    averageScore: 7.8,
    maxScore: 10,
  },
  {
    id: 15,
    title: 'Design Patterns cơ bản',
    description: 'Singleton, Factory, Observer patterns',
    instructions: 'Áp dụng các design patterns phổ biến vào bài toán thực tế',
    course: 'Lập trình hướng đối tượng',
    courseId: 'oop',
    status: 'active',
    startDate: '2024-12-10T08:00:00',
    dueDate: '2024-12-30T23:59:00',
    updatedAt: '2024-12-18T10:00:00',
    totalStudents: 10,
    submittedCount: 5, // SV 3, 9, 7, 4, 2 chưa nộp (bài active)
    lateSubmissions: 0,
    averageScore: 8.0,
    maxScore: 10,
  },

  // ========== MÔN 4: CẤU TRÚC DỮ LIỆU VÀ GIẢI THUẬT (5 bài) ==========
  {
    id: 16,
    title: 'Danh sách liên kết',
    description: 'Linked List đơn và đôi',
    instructions: 'Cài đặt linked list, thêm/xóa node, duyệt danh sách',
    course: 'Cấu trúc dữ liệu và giải thuật',
    courseId: 'data-struct-algo',
    status: 'completed',
    startDate: '2024-10-01T08:00:00',
    dueDate: '2024-10-08T23:59:00',
    updatedAt: '2024-10-09T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 2, // SV 3, 9 nộp muộn
    averageScore: 7.5,
    maxScore: 10,
  },
  {
    id: 17,
    title: 'Stack và Queue',
    description: 'Cài đặt và ứng dụng Stack, Queue',
    instructions: 'Cài đặt stack/queue bằng mảng và linked list, ứng dụng',
    course: 'Cấu trúc dữ liệu và giải thuật',
    courseId: 'data-struct-algo',
    status: 'completed',
    startDate: '2024-10-10T08:00:00',
    dueDate: '2024-10-17T23:59:00',
    updatedAt: '2024-10-18T10:00:00',
    totalStudents: 10,
    submittedCount: 10, // Tất cả 10 SV đều nộp
    lateSubmissions: 2, // SV 3, 9 nộp muộn
    averageScore: 7.6,
    maxScore: 10,
  },
  {
    id: 18,
    title: 'Cây nhị phân',
    description: 'Binary Tree và các phép duyệt',
    instructions: 'Cài đặt binary tree, duyệt preorder/inorder/postorder',
    course: 'Cấu trúc dữ liệu và giải thuật',
    courseId: 'data-struct-algo',
    status: 'completed',
    startDate: '2024-10-20T08:00:00',
    dueDate: '2024-10-27T23:59:00',
    updatedAt: '2024-10-28T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 1,
    averageScore: 7.8,
    maxScore: 10,
  },
  {
    id: 19,
    title: 'Sắp xếp và tìm kiếm',
    description: 'Các thuật toán sorting và searching',
    instructions: 'Bubble sort, quick sort, binary search, linear search',
    course: 'Cấu trúc dữ liệu và giải thuật',
    courseId: 'data-struct-algo',
    status: 'completed',
    startDate: '2024-11-01T08:00:00',
    dueDate: '2024-11-08T23:59:00',
    updatedAt: '2024-11-09T10:00:00',
    totalStudents: 10,
    submittedCount: 8, // SV 3, 9 chưa nộp
    lateSubmissions: 1,
    averageScore: 7.5,
    maxScore: 10,
  },
  {
    id: 20,
    title: 'Đồ thị cơ bản',
    description: 'Graph và các thuật toán BFS, DFS',
    instructions: 'Biểu diễn đồ thị, duyệt BFS/DFS, tìm đường đi',
    course: 'Cấu trúc dữ liệu và giải thuật',
    courseId: 'data-struct-algo',
    status: 'active',
    startDate: '2024-12-15T08:00:00',
    dueDate: '2025-01-05T23:59:00',
    updatedAt: '2024-12-18T10:00:00',
    totalStudents: 10,
    submittedCount: 4, // SV 3, 9, 7, 4, 2, 1 chưa nộp (bài active mới)
    lateSubmissions: 0,
    averageScore: 8.5,
    maxScore: 10,
  },
];

// Export hàm helper để tính toán stats
export const calculateAssignmentStats = () => {
  const total = ASSIGNMENTS_LIST.length;
  const active = ASSIGNMENTS_LIST.filter((a) => a.status === 'active').length;
  const completed = ASSIGNMENTS_LIST.filter(
    (a) => a.status === 'completed'
  ).length;
  const overdue = ASSIGNMENTS_LIST.filter((a) => a.status === 'overdue').length;

  const totalSubmissions = ASSIGNMENTS_LIST.reduce(
    (sum, a) => sum + a.submittedCount,
    0
  );
  const totalPossible = ASSIGNMENTS_LIST.reduce(
    (sum, a) => sum + a.totalStudents,
    0
  );
  const avgSubmissionRate = Math.round((totalSubmissions / totalPossible) * 100);

  const avgScore =
    ASSIGNMENTS_LIST.reduce((sum, a) => sum + a.averageScore, 0) / total;

  return {
    totalAssignments: total,
    activeAssignments: active,
    completedAssignments: completed,
    overdueAssignments: overdue,
    averageSubmissionRate: avgSubmissionRate,
    averageScore: Math.round(avgScore * 10) / 10,
  };
};
