import { Shield, Lock, Key, Smartphone, AlertTriangle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const SecuritySettings = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      alert('Đổi mật khẩu thành công!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    }, 1000);
  };

  const activeSessions = [
    {
      device: 'Chrome on Windows',
      location: 'TP. Hồ Chí Minh, Vietnam',
      ip: '171.235.xxx.xxx',
      lastActive: '5 phút trước',
      current: true
    },
    {
      device: 'Safari on iPhone',
      location: 'TP. Hồ Chí Minh, Vietnam',
      ip: '171.235.xxx.xxx',
      lastActive: '2 giờ trước',
      current: false
    }
  ];

  const loginHistory = [
    {
      date: '27/10/2024 14:30',
      device: 'Chrome on Windows',
      location: 'TP. Hồ Chí Minh',
      status: 'success'
    },
    {
      date: '27/10/2024 09:15',
      device: 'Safari on iPhone',
      location: 'TP. Hồ Chí Minh',
      status: 'success'
    },
    {
      date: '26/10/2024 18:45',
      device: 'Unknown Browser',
      location: 'Hà Nội',
      status: 'failed'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Lock className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Đổi mật khẩu</h3>
            <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu hiện tại
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xác nhận mật khẩu mới
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isChangingPassword ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
          </button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <Smartphone className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Xác thực hai yếu tố (2FA)</h3>
            <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản</p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">Trạng thái 2FA</h4>
            <p className="text-sm text-gray-600">
              {twoFactorEnabled 
                ? 'Đã bật - Tài khoản của bạn được bảo vệ tốt hơn'
                : 'Chưa bật - Khuyến nghị bật để tăng bảo mật'}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        {twoFactorEnabled && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-blue-600 mt-0.5" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-900">2FA đã được kích hoạt</p>
                <p className="text-sm text-blue-700 mt-1">
                  Mã xác thực sẽ được gửi qua ứng dụng Authenticator mỗi khi đăng nhập
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Security Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Shield className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tùy chọn bảo mật</h3>
            <p className="text-sm text-gray-600">Cấu hình các tùy chọn bảo mật</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Cảnh báo đăng nhập</h4>
              <p className="text-sm text-gray-600">Nhận thông báo khi có đăng nhập mới</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={loginAlerts}
                onChange={() => setLoginAlerts(!loginAlerts)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <label className="block font-medium text-gray-900 mb-2">
              Thời gian tự động đăng xuất
            </label>
            <select
              value={sessionTimeout}
              onChange={(e) => setSessionTimeout(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="15">15 phút</option>
              <option value="30">30 phút</option>
              <option value="60">1 giờ</option>
              <option value="120">2 giờ</option>
              <option value="never">Không giới hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Phiên đăng nhập đang hoạt động</h3>
        
        <div className="space-y-3">
          {activeSessions.map((session, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{session.device}</h4>
                    {session.current && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        Hiện tại
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{session.location}</p>
                  <p className="text-sm text-gray-500">IP: {session.ip} • {session.lastActive}</p>
                </div>
                {!session.current && (
                  <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Đăng xuất
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Login History */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Lịch sử đăng nhập</h3>
        
        <div className="space-y-2">
          {loginHistory.map((log, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center gap-3">
                {log.status === 'success' ? (
                  <CheckCircle className="text-green-600" size={18} />
                ) : (
                  <AlertTriangle className="text-red-600" size={18} />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">{log.device}</p>
                  <p className="text-xs text-gray-600">{log.location} • {log.date}</p>
                </div>
              </div>
              <span className={`text-xs font-medium ${
                log.status === 'success' ? 'text-green-600' : 'text-red-600'
              }`}>
                {log.status === 'success' ? 'Thành công' : 'Thất bại'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;

