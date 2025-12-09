import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI, decodeJWT, setAccessToken, clearAccessToken, hashPassword } from '../../services/api';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Kiểm tra xem input là email hay MSSV (nếu là số thì là MSSV)
      const loginData = { password: formData.password };
      const isNumeric = /^\d+$/.test(formData.email);
      
      if (isNumeric) {
        loginData.mssv = formData.email;
      } else {
        loginData.email = formData.email;
      }
      
      const hashedPassword = await hashPassword(formData.password);
      console.log('🔐 Attempting login...');
      const response = await authAPI.login({ ...loginData, password: hashedPassword });
      console.log('✅ Login response received:', response);
      
      // Check response structure
      if (!response || !response.data) {
        console.error('❌ Invalid login response structure:', response);
        setError('Phản hồi từ server không hợp lệ');
        setLoading(false);
        return;
      }
      
      if (!response.data.access_token) {
        console.error('❌ No access token in response:', response);
        setError('Không nhận được access token từ server');
        setLoading(false);
        return;
      }
      
      // Clear old data first để tránh xung đột
      clearAccessToken();
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('dashboardType');
      
      // Lưu access token vào bộ nhớ tạm (in-memory) và sessionStorage (tạm thời để dùng khi refresh)
      console.log('💾 Saving access token to memory and sessionStorage...');
      setAccessToken(response.data.access_token);
      // Lưu tạm vào sessionStorage để dùng khi refresh token (sẽ xóa sau khi refresh thành công)
      sessionStorage.setItem('temp_access_token', response.data.access_token);
      sessionStorage.setItem('user', JSON.stringify(response.data.user));
      console.log('✅ Access token saved to memory and sessionStorage');
      console.log('🔍 Verifying temp_access_token in sessionStorage:', sessionStorage.getItem('temp_access_token') ? 'EXISTS' : 'MISSING');

      // Decode JWT để lấy role
      const decodedToken = decodeJWT(response.data.access_token);
      
      if (!decodedToken) {
        setError('Không thể decode token');
        setLoading(false);
        return;
      }

      const userRole = decodedToken.role;
      console.log('👤 User role:', userRole);

      // Update auth state
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }

      // Redirect based on role
      // Lưu dashboard type vào sessionStorage TRƯỚC KHI navigate
      let dashboardType = 'teacher'; // default
      if (userRole === 'sinh_vien' || userRole === 'student') {
        dashboardType = 'student';
      } else if (userRole === 'giang_vien' || userRole === 'teacher') {
        dashboardType = 'teacher';
      } else if (userRole === 'manage_nghanh') {
        dashboardType = 'nghanh';
      }
      
      console.log('💾 Saving dashboardType to sessionStorage:', dashboardType);
      sessionStorage.setItem('dashboardType', dashboardType);
      console.log('✅ DashboardType saved, verifying...', sessionStorage.getItem('dashboardType'));
      
      // Force page reload to ensure state is synced with sessionStorage
      // This also ensures access token is preserved in memory (via temp_access_token)
        window.location.href = '/';
    } catch (err) {
      setError(err.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2">
            Hệ thống Quản lý
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Học Lập Trình</p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
            Đăng nhập
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-4 flex items-center gap-2 text-danger-600 bg-danger-50 border border-danger-200 rounded-lg p-3">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email hoặc MSSV
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Nhập email hoặc MSSV"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Nhập mật khẩu"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <span className="text-gray-600 dark:text-gray-400">Chưa có tài khoản? </span>
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-semibold transition-colors"
            >
              Đăng ký ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

