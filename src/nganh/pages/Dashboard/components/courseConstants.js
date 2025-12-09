import { COURSE_NAMES, CLASS_LIST } from '../../../data/coursePerformanceData';

export const CLASS_OPTIONS = [
  { value: 'all', label: 'Tất cả lớp' },
  ...CLASS_LIST.map((className) => ({ value: className, label: className }))
];

export const COURSE_DEFINITIONS = [
  {
    key: 'intro',
    name: COURSE_NAMES.INTRO,
    dataKey: COURSE_NAMES.INTRO,
    skills: [
      { key: 'ifElse', label: 'If / Else', threshold: 72 },
      { key: 'forWhile', label: 'Vòng lặp For/While', threshold: 70 },
      { key: 'function', label: 'Hàm & Tham số', threshold: 74 },
      { key: 'array', label: 'Mảng 1 chiều', threshold: 68 },
      { key: 'string', label: 'Xử lý Chuỗi', threshold: 66 },
      { key: 'debug', label: 'Debug cơ bản', threshold: 65 }
    ]
  },
  {
    key: 'tech',
    name: COURSE_NAMES.TECH,
    dataKey: COURSE_NAMES.TECH,
    skills: [
      { key: 'advancedFunction', label: 'Hàm nâng cao', threshold: 74 },
      { key: 'arrayMatrix', label: 'Mảng & Ma trận', threshold: 70 },
      { key: 'pointer', label: 'Con trỏ', threshold: 66 },
      { key: 'struct', label: 'Struct & Kiểu tự định nghĩa', threshold: 68 },
      { key: 'fileIO', label: 'Xử lý File', threshold: 65 },
      { key: 'recursion', label: 'Đệ quy', threshold: 64 },
      { key: 'debugTesting', label: 'Debug & Testing', threshold: 70 }
    ]
  },
  {
    key: 'data',
    name: COURSE_NAMES.DATA,
    dataKey: COURSE_NAMES.DATA,
    skills: [
      { key: 'linkedList', label: 'Danh sách liên kết', threshold: 72 },
      { key: 'stackQueue', label: 'Stack & Queue', threshold: 70 },
      { key: 'tree', label: 'Cây nhị phân', threshold: 66 },
      { key: 'graph', label: 'Đồ thị', threshold: 62 },
      { key: 'sort', label: 'Thuật toán sắp xếp', threshold: 74 },
      { key: 'search', label: 'Tìm kiếm', threshold: 70 }
    ]
  },
  {
    key: 'oop',
    name: COURSE_NAMES.OOP,
    dataKey: COURSE_NAMES.OOP,
    skills: [
      { key: 'classObject', label: 'Lớp & Đối tượng', threshold: 75 },
      { key: 'encapsulation', label: 'Đóng gói', threshold: 72 },
      { key: 'inheritance', label: 'Kế thừa', threshold: 70 },
      { key: 'polymorphism', label: 'Đa hình', threshold: 68 },
      { key: 'abstraction', label: 'Trừu tượng hóa', threshold: 66 },
      { key: 'designPattern', label: 'Mẫu thiết kế cơ bản', threshold: 64 }
    ]
  }
];
