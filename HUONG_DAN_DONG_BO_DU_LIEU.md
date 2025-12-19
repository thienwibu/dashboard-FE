# HƯỚNG DẪN ĐỒNG BỘ DỮ LIỆU HỆ THỐNG

## ✅ TIẾN ĐỘ CẬP NHẬT

- [x] **dataService.js** - Service tập trung ✅
- [x] **Dashboard** - Trang chủ ✅
- [x] **LearningPath** - Lộ trình học ✅
- [x] **ModuleDetail** - Chi tiết môn học ✅
- [x] **ClassManagement** - Quản lý lớp học ✅
- [ ] **AssignmentManagement** - Quản lý bài tập ⏳
- [ ] **StudentTracking** - Theo dõi sinh viên ⏳
- [ ] **Reports** - Báo cáo ⏳

## 🎯 VẤN ĐỀ ĐÃ GIẢI QUYẾT

Trước đây dữ liệu không đồng bộ vì:
- Mỗi trang tự load dữ liệu từ mockData và localStorage
- Số sinh viên không cập nhật khi thêm/xóa
- Dữ liệu môn học không nhất quán giữa các trang

## ✅ GIẢI PHÁP

Tạo **dataService** - service tập trung quản lý TẤT CẢ dữ liệu:

### File: `src/giangvien/services/dataService.js`

**Chức năng chính:**

1. **getStudents()** - Lấy danh sách sinh viên thực tế
2. **getClasses()** - Lấy danh sách lớp học
3. **getTotalStudents()** - Tính tổng số sinh viên
4. **getModules()** - Lấy tất cả môn học (mock + custom) với số liệu THỰC TẾ
5. **getModuleById(id)** - Lấy thông tin 1 môn học
6. **addModule(data)** - Thêm môn học mới
7. **updateModule(id, data)** - Cập nhật môn học
8. **deleteModule(id)** - Xóa môn học
9. **getOverviewStats()** - Lấy thống kê tổng quan
10. **refresh()** - Trigger event để các component reload

## 📊 CÁCH HOẠT ĐỘNG

### 1. Tính Số Sinh Viên Động

```javascript
// Trước đây (CỨNG)
students: course.enrolledStudents // Số cố định từ mockData

// Bây giờ (ĐỘNG)
students: dataService.getTotalStudents() // Số thực tế từ localStorage
```

### 2. Tính Số Sinh Viên Theo Lớp

```javascript
// Nếu môn học chọn lớp cụ thể
if (module.selectedClasses && module.selectedClasses.length > 0) {
  moduleStudents = module.selectedClasses.reduce((sum, classId) => {
    return sum + dataService.getStudentCountByClass(classId);
  }, 0);
}
```

### 3. Đồng Bộ Tự Động

```javascript
// Khi có thay đổi
dataService.refresh(); // Trigger event

// Component tự động reload
useEffect(() => {
  const handleRefresh = () => loadData();
  window.addEventListener('dataRefresh', handleRefresh);
  return () => window.removeEventListener('dataRefresh', handleRefresh);
}, []);
```

## 🔧 CÁC TRANG ĐÃ CẬP NHẬT

### ✅ LearningPathSimple.jsx
- Sử dụng `dataService.getModules()`
- Số sinh viên tự động cập nhật
- Lắng nghe event refresh

### ✅ ModuleDetail.jsx  
- Sử dụng `dataService.getModuleById()`
- Hiển thị số sinh viên thực tế
- Lắng nghe event refresh

### ⏳ CẦN CẬP NHẬT THÊM

1. **Dashboard** - Cập nhật stats tổng quan
2. **ClassManagement** - Đồng bộ số sinh viên
3. **CourseMonitoring** - Hiển thị số liệu thực tế
4. **StudentTracking** - Đồng bộ danh sách sinh viên

## 💡 HƯỚNG DẪN SỬ DỤNG

### Import Service

```javascript
import dataService from '../../services/dataService';
```

### Lấy Dữ Liệu

```javascript
const [modules, setModules] = useState([]);
const [totalStudents, setTotalStudents] = useState(0);

useEffect(() => {
  loadData();
  
  // Lắng nghe refresh
  const handleRefresh = () => loadData();
  window.addEventListener('dataRefresh', handleRefresh);
  return () => window.removeEventListener('dataRefresh', handleRefresh);
}, []);

const loadData = () => {
  const allModules = dataService.getModules();
  const total = dataService.getTotalStudents();
  
  setModules(allModules);
  setTotalStudents(total);
};
```

### Thêm/Sửa/Xóa Dữ Liệu

```javascript
// Thêm môn học
const handleAdd = (newModule) => {
  dataService.addModule(newModule);
  dataService.refresh(); // Trigger refresh
};

// Cập nhật
const handleUpdate = (id, updates) => {
  dataService.updateModule(id, updates);
  dataService.refresh();
};

// Xóa
const handleDelete = (id) => {
  dataService.deleteModule(id);
  dataService.refresh();
};
```

### Lấy Thống Kê

```javascript
const stats = dataService.getOverviewStats();
console.log(stats);
// {
//   totalModules: 5,
//   completedModules: 1,
//   inProgressModules: 3,
//   pendingModules: 1,
//   totalStudents: 45,
//   totalClasses: 3,
//   averageProgress: 65
// }
```

## 🎯 LỢI ÍCH

✅ **Dữ liệu nhất quán** - Tất cả trang dùng chung 1 nguồn
✅ **Tự động cập nhật** - Thêm sinh viên → số liệu tự động thay đổi
✅ **Dễ bảo trì** - Chỉ sửa 1 chỗ (dataService)
✅ **Performance tốt** - Cache và optimize tập trung
✅ **Dễ debug** - Log tập trung, dễ theo dõi

## 🚀 ROADMAP

- [x] Tạo dataService
- [x] Cập nhật LearningPath
- [x] Cập nhật ModuleDetail
- [ ] Cập nhật Dashboard
- [ ] Cập nhật ClassManagement
- [ ] Cập nhật CourseMonitoring
- [ ] Cập nhật StudentTracking
- [ ] Test toàn bộ hệ thống
- [ ] Optimize performance

## 📝 LƯU Ý

1. **Luôn dùng dataService** - Không truy cập trực tiếp localStorage
2. **Gọi refresh() sau mỗi thay đổi** - Để các component cập nhật
3. **Lắng nghe event** - Để component tự động reload
4. **Test kỹ** - Đảm bảo số liệu chính xác
