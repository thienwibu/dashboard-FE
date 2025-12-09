# Hướng dẫn Authentication Flow

## 📋 Tổng quan

Hệ thống đã được tích hợp đầy đủ authentication gồm:
- **Login** - Đăng nhập
- **Register** - Đăng ký
- **Forgot Password** - Quên mật khẩu
- **Reset Password** - Đặt lại mật khẩu

## 🏗️ Cấu trúc File

```
src/
├── pages/
│   └── auth/
│       ├── Login.jsx              # Trang đăng nhập
│       ├── Register.jsx           # Trang đăng ký
│       ├── ForgotPassword.jsx     # Trang quên mật khẩu
│       └── ResetPassword.jsx      # Trang đặt lại mật khẩu
├── services/
│   └── api.js                     # API service gọi backend
└── App.jsx                        # Routing chính
```

## 🔑 Authentication Flow

### 1. Login Flow
```
User → /login → Nhập email + password → Backend verify → 
Decode JWT để lấy role → Auto redirect theo role:
- Role 'sinh_vien' → Dashboard Sinh viên
- Role 'giang_vien' → Dashboard Giảng viên  
- Role 'manage_nghanh' → Dashboard Giảng viên
```

### 2. Register Flow
```
User → /register → Nhập thông tin → Backend kiểm tra class →
Tạo MSSV → Gửi email MSSV → Redirect /login
```

### 3. Forgot Password Flow
```
User → /forgot-password → Nhập email → Backend gửi email →
User click link trong email → /reset-password?token=xxx →
Nhập password mới → Backend cập nhật → Redirect /login
```

## 🚀 Cách sử dụng

### 1. Start Backend
```bash
cd be
npm run dev
```

### 2. Start Frontend
```bash
cd DASHBOARD_HocLapTrinh-GiangVien
npm run dev
```

### 3. Truy cập ứng dụng
```
http://localhost:5173 (hoặc port Vite hiển thị)
```

### 4. Routes
- `/login` - Đăng nhập
- `/register` - Đăng ký  
- `/forgot-password` - Quên mật khẩu
- `/reset-password?token=xxx` - Đặt lại mật khẩu (từ email)

## 📧 API Endpoints Backend

### Public Endpoints
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `GET /api/auth/verify-reset-token` - Verify token
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### Private Endpoints
- `GET /api/auth/me` - Lấy thông tin user
- `POST /api/auth/logout` - Đăng xuất

## 🔒 Security Features

1. **Token-based Authentication** - JWT tokens
2. **Password Hashing** - bcrypt
3. **Token Expiration** - 15 phút cho reset password
4. **Session Management** - Lưu trong database
5. **Email Verification** - MSSV gửi qua email

## 📝 Form Fields

### Login
- Email/MSSV
- Password

### Register (Sinh viên)
- Họ và tên *
- Tên lớp *
- Email *
- Password *
- Xác nhận Password *

### Forgot Password
- Email *

### Reset Password
- Password mới *
- Xác nhận Password mới *

## 🧪 Test Flow

1. **Register** → Nhận MSSV qua email
2. **Login** với email + password → Chọn dashboard
3. **Forgot Password** → Check email → Click link
4. **Reset Password** → Nhập password mới
5. **Login** lại với password mới

## ⚠️ Lưu ý

1. Backend phải chạy tại `http://localhost:3001`
2. Email config trong `.env` backend
3. Database phải có table `class` với dữ liệu học sinh
4. Token được lưu trong `localStorage`
5. Sau logout phải clear localStorage

