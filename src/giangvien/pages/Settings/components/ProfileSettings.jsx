import { User, Mail, Phone, MapPin, Calendar, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';

const ProfileSettings = () => {
  const [profile, setProfile] = useState({
    fullName: 'TS. Võ Đại Nhân',
    email: 'nhan354a@gmail.com',
    phone: '0901234567',
    position: 'Giảng viên',
    department: 'Khoa Công nghệ Thông tin',
    location: 'TP. Hồ Chí Minh',
    joinDate: '01/09/2020',
    bio: 'Giảng viên chuyên ngành Khoa học Máy tính với hơn 10 năm kinh nghiệm giảng dạy.'
  });

  useEffect(() => {
    // Lấy thông tin từ sessionStorage
    const userData = sessionStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setProfile(prev => ({
        ...prev,
        fullName: user?.full_name || prev.fullName,
        email: user?.email || prev.email
      }));
    }
  }, []);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
      alert('Cập nhật thông tin thành công!');
    }, 1000);
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Ảnh đại diện</h3>
        
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              NA
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors">
              <Camera size={16} className="text-gray-600" />
            </button>
          </div>
          
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">{profile.fullName}</h4>
            <p className="text-sm text-gray-600 mb-3">{profile.position} - {profile.department}</p>
            
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                Tải ảnh lên
              </button>
              <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
                Xóa ảnh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
          
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Họ và tên
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} />
              Email
            </label>
            {isEditing ? (
              <input
                type="email"
                value={profile.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} />
              Số điện thoại
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.phone}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} />
              Địa điểm
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.location}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Chức vụ
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.position}
                onChange={(e) => handleChange('position', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.position}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <User size={16} />
              Khoa/Phòng ban
            </label>
            {isEditing ? (
              <input
                type="text"
                value={profile.department}
                onChange={(e) => handleChange('department', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-900">{profile.department}</p>
            )}
          </div>
        </div>

        {/* Bio */}
        <div className="mt-6">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            Giới thiệu
          </label>
          {isEditing ? (
            <textarea
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-900">{profile.bio}</p>
          )}
        </div>

        {/* Join Date */}
        <div className="mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={16} />
            <span>Tham gia từ: <strong className="text-gray-900">{profile.joinDate}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;

