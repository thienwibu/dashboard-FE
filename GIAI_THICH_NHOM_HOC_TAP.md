# GIẢI THÍCH CHỈ SỐ NHÓM HỌC TẬP (DT056)

## 📊 CÁC CHỈ SỐ HIỂN THỊ TRONG NHÓM HỌC TẬP

### 1. **Tiến độ nhóm (group.progress)**
**Hiện tại:** Đang hardcode trong data.js (75%, 60%, 50%)

**Cách tính nên là:**
```
Tiến độ nhóm (%) = (Số bài tập đã hoàn thành / Tổng số bài tập) × 100
```

**Ví dụ:**
- Nhóm 1: 3/5 bài tập hoàn thành → 3/5 × 100 = **60%** (không phải 75%)
- Nhóm 2: 2/5 bài tập hoàn thành → 2/5 × 100 = **40%** (không phải 60%)
- Nhóm 3: 2/5 bài tập hoàn thành → 2/5 × 100 = **40%** (không phải 50%)

**Hoặc có thể tính phức tạp hơn:**
```
Tiến độ nhóm = (
  (Tỉ lệ bài tập hoàn thành × 0.6) + 
  (Tỉ lệ thành viên hoàn thành bài tập × 0.3) + 
  (Tỉ lệ tham gia buổi họp × 0.1)
) × 100
```

---

### 2. **Số thành viên (group.members.length)**
**Nguồn dữ liệu:** `group.members[]` trong data.js

**Hiển thị:**
- Tên thành viên
- MSSV
- Vai trò: Leader hoặc Member
- Badge "👑 Leader" cho leader
- "(Bạn)" nếu là user hiện tại

**Ví dụ:**
- Nhóm 1: 3 thành viên (Nguyễn Văn An - Leader, Trần Văn B, Lê Thị C)
- Nhóm 2: 3 thành viên (Nguyễn Văn An, Phạm Văn D - Leader, Hoàng Thị E)
- Nhóm 3: 3 thành viên (Nguyễn Văn An, Trần Văn B, Hoàng Thị E - Leader)

---

### 3. **Bài tập (group.assignments)**
**Cấu trúc:**
```javascript
assignments: {
  completed: 3,  // Số bài tập đã hoàn thành
  total: 5       // Tổng số bài tập
}
```

**Hiển thị:** `completed/total hoàn thành`

**Ví dụ:**
- Nhóm 1: 3/5 hoàn thành
- Nhóm 2: 2/5 hoàn thành
- Nhóm 3: 2/5 hoàn thành

**Cách tính:**
- Đếm số bài tập mà **TẤT CẢ** thành viên trong nhóm đã hoàn thành
- Hoặc đếm số bài tập mà **ÍT NHẤT 1** thành viên đã hoàn thành
- Hoặc tính trung bình: `(Tổng số bài tập hoàn thành của tất cả thành viên) / (Số thành viên × Tổng số bài tập)`

---

### 4. **Buổi họp tiếp theo (group.nextMeeting)**
**Nguồn dữ liệu:** `group.nextMeeting` (ISO date string)

**Format:** `"2025-11-25T14:00:00"`

**Hiển thị:** 
- Format: `dd/MM/yyyy HH:mm`
- Ví dụ: "25/11/2025 14:00"

**Cách lấy:**
- Từ lịch học của khóa học
- Hoặc từ lịch đặt của nhóm
- Hoặc tính từ buổi họp cuối cùng + khoảng thời gian (ví dụ: 1 tuần)

---

### 5. **Trạng thái nhóm (group.status)**
**Giá trị:** `"active"` hoặc `"inactive"`

**Hiển thị:**
- Badge "Hoạt động" (màu xanh) nếu `active`
- Badge "Tạm dừng" (màu xám) nếu `inactive`

**Logic xác định:**
- `active`: Nhóm đang hoạt động, có buổi họp sắp tới
- `inactive`: Nhóm tạm dừng, không có hoạt động

---

## 🔄 LOGIC TÍNH TOÁN ĐỀ XUẤT

### Cách 1: Tính từ Bài tập (Đơn giản)
```javascript
const calculateGroupProgress = (group) => {
  const { completed, total } = group.assignments;
  return Math.round((completed / total) * 100);
};
```

**Kết quả:**
- Nhóm 1: 3/5 → 60%
- Nhóm 2: 2/5 → 40%
- Nhóm 3: 2/5 → 40%

---

### Cách 2: Tính từ Tiến độ cá nhân (Chi tiết)
```javascript
const calculateGroupProgress = (group, membersProgress) => {
  // membersProgress: [{ mssv, courseProgress, assignmentsCompleted }]
  
  // Lấy tiến độ trung bình của các thành viên
  const avgMemberProgress = membersProgress
    .filter(m => group.members.some(gm => gm.mssv === m.mssv))
    .reduce((sum, m) => sum + m.courseProgress, 0) / group.members.length;
  
  // Lấy tỉ lệ bài tập hoàn thành
  const assignmentRatio = group.assignments.completed / group.assignments.total;
  
  // Kết hợp: 70% từ bài tập, 30% từ tiến độ cá nhân
  return Math.round((assignmentRatio * 0.7 + avgMemberProgress / 100 * 0.3) * 100);
};
```

---

### Cách 3: Tính từ Nhiều yếu tố (Phức tạp)
```javascript
const calculateGroupProgress = (group, groupData) => {
  const {
    assignmentsCompleted,    // Số bài tập đã hoàn thành
    assignmentsTotal,         // Tổng số bài tập
    meetingsAttended,         // Số buổi họp đã tham gia
    meetingsTotal,            // Tổng số buổi họp
    membersActive,            // Số thành viên tích cực
    membersTotal              // Tổng số thành viên
  } = groupData;
  
  // Trọng số:
  const assignmentWeight = 0.5;  // 50% từ bài tập
  const meetingWeight = 0.3;      // 30% từ buổi họp
  const participationWeight = 0.2; // 20% từ sự tham gia
  
  const assignmentScore = (assignmentsCompleted / assignmentsTotal) * 100;
  const meetingScore = (meetingsAttended / meetingsTotal) * 100;
  const participationScore = (membersActive / membersTotal) * 100;
  
  return Math.round(
    assignmentScore * assignmentWeight +
    meetingScore * meetingWeight +
    participationScore * participationWeight
  );
};
```

---

## 📝 DỮ LIỆU NGUỒN

### Hiện tại (Mock Data):
```javascript
// data.js
export const studyGroups = [
  {
    id: 1,
    name: "Nhóm Lập trình Cơ bản",
    courseId: 1,
    courseName: "Nhập môn Lập trình",
    members: [...],
    progress: 75,  // ⚠️ Hardcode - cần tính toán
    assignments: { completed: 3, total: 5 },
    nextMeeting: "2025-11-25T14:00:00",
    status: "active"
  }
];
```

### Nên có (Từ Backend):
```javascript
// API Response
{
  id: 1,
  name: "Nhóm Lập trình Cơ bản",
  courseId: 1,
  courseName: "Nhập môn Lập trình",
  members: [
    {
      id: 1,
      name: "Nguyễn Văn An",
      mssv: "SV2023001",
      role: "Leader",
      assignmentsCompleted: 3,  // Số bài tập đã làm
      courseProgress: 60         // Tiến độ cá nhân trong khóa học
    }
  ],
  assignments: {
    completed: 3,  // Tổng số bài tập nhóm đã hoàn thành
    total: 5        // Tổng số bài tập nhóm cần làm
  },
  meetings: {
    attended: 4,    // Số buổi họp đã tham gia
    total: 6        // Tổng số buổi họp
  },
  nextMeeting: "2025-11-25T14:00:00",
  status: "active",
  // progress sẽ được tính toán từ các chỉ số trên
}
```

---

## 🔧 CẬP NHẬT CODE ĐỀ XUẤT

### Option 1: Tính toán trong Component
```javascript
// Courses.jsx
{studyGroups.map((group) => {
  // Tính tiến độ từ bài tập
  const calculatedProgress = Math.round(
    (group.assignments.completed / group.assignments.total) * 100
  );
  
  // Sử dụng calculatedProgress thay vì group.progress
  const displayProgress = calculatedProgress;
  
  return (
    // ... render với displayProgress
  );
})}
```

### Option 2: Tính toán trong data.js
```javascript
// data.js
export const studyGroups = studyGroupsRaw.map(group => ({
  ...group,
  // Tính toán progress từ assignments
  progress: Math.round((group.assignments.completed / group.assignments.total) * 100)
}));
```

---

## 📊 TÓM TẮT CÁC CHỈ SỐ

| Chỉ số | Nguồn | Cách tính | Ví dụ |
|--------|-------|-----------|-------|
| **Tiến độ nhóm** | `group.progress` hoặc tính từ `assignments` | `(completed/total) × 100` | 3/5 = 60% |
| **Số thành viên** | `group.members.length` | Đếm số phần tử trong mảng | 3 thành viên |
| **Bài tập hoàn thành** | `group.assignments.completed` | Đếm từ backend hoặc tính tổng | 3/5 |
| **Tổng bài tập** | `group.assignments.total` | Từ khóa học hoặc cấu hình | 5 bài |
| **Buổi họp tiếp theo** | `group.nextMeeting` | Từ lịch học hoặc lịch nhóm | 25/11/2025 14:00 |
| **Trạng thái** | `group.status` | `"active"` hoặc `"inactive"` | Hoạt động |

---

## ❓ CÂU HỎI THƯỜNG GẶP

### Q1: Tiến độ nhóm 75% có nghĩa là gì?
**A:** Hiện tại đang hardcode. Nên hiểu là: Nhóm đã hoàn thành 75% công việc (bài tập, dự án, ...)

### Q2: Làm sao biết nhóm đã hoàn thành bao nhiêu bài tập?
**A:** Từ `group.assignments.completed / group.assignments.total`. Ví dụ: 3/5 = 60%

### Q3: Tiến độ nhóm có liên quan đến tiến độ cá nhân không?
**A:** Có thể có. Có thể tính trung bình tiến độ cá nhân của tất cả thành viên.

### Q4: Làm sao cập nhật tiến độ nhóm?
**A:** 
- Tự động: Khi có thành viên nộp bài tập → cập nhật `assignments.completed`
- Thủ công: Leader hoặc giảng viên cập nhật

---

**Tài liệu được tạo để giải thích logic tính toán • Cập nhật: 2025-11-23**

