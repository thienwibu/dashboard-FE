import { Palette, Sun, Moon, Monitor, Globe, Type, Layout } from 'lucide-react';
import { useState } from 'react';

const AppearanceSettings = () => {
  const [settings, setSettings] = useState({
    theme: 'light',
    language: 'vi',
    fontSize: 'medium',
    layout: 'default',
    compactMode: false,
    showAvatars: true,
    animationsEnabled: true
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Đã lưu cài đặt giao diện!');
    }, 1000);
  };

  const themes = [
    { value: 'light', label: 'Sáng', icon: Sun, description: 'Giao diện sáng, dễ đọc' },
    { value: 'dark', label: 'Tối', icon: Moon, description: 'Giảm mỏi mắt vào ban đêm' },
    { value: 'auto', label: 'Tự động', icon: Monitor, description: 'Theo hệ thống' }
  ];

  const languages = [
    { value: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'fr', label: 'Français', flag: '🇫🇷' }
  ];

  const fontSizes = [
    { value: 'small', label: 'Nhỏ', size: '14px' },
    { value: 'medium', label: 'Vừa', size: '16px' },
    { value: 'large', label: 'Lớn', size: '18px' }
  ];

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Palette className="text-purple-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Chủ đề giao diện</h3>
            <p className="text-sm text-gray-600">Chọn chủ đề phù hợp với bạn</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((theme) => {
            const Icon = theme.icon;
            const isSelected = settings.theme === theme.value;
            
            return (
              <button
                key={theme.value}
                onClick={() => handleChange('theme', theme.value)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-2 rounded-lg ${
                    isSelected ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={isSelected ? 'text-blue-600' : 'text-gray-600'} size={20} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{theme.label}</h4>
                </div>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Globe className="text-blue-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Ngôn ngữ</h3>
            <p className="text-sm text-gray-600">Chọn ngôn ngữ hiển thị</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.value}
              onClick={() => handleChange('language', lang.value)}
              className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                settings.language === lang.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl">{lang.flag}</span>
              <span className="font-medium text-gray-900">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-50 rounded-lg">
            <Type className="text-green-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Kích thước chữ</h3>
            <p className="text-sm text-gray-600">Điều chỉnh kích thước văn bản</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {fontSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => handleChange('fontSize', size.value)}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.fontSize === size.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div style={{ fontSize: size.size }} className="font-medium text-gray-900 mb-1">
                Aa
              </div>
              <div className="text-sm text-gray-600">{size.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Display Options */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Layout className="text-orange-600" size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Tùy chọn hiển thị</h3>
            <p className="text-sm text-gray-600">Tùy chỉnh giao diện theo ý muốn</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Chế độ thu gọn</h4>
              <p className="text-sm text-gray-600">Giảm khoảng cách giữa các phần tử</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.compactMode}
                onChange={() => handleToggle('compactMode')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Hiển thị ảnh đại diện</h4>
              <p className="text-sm text-gray-600">Hiển thị ảnh đại diện trong danh sách</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAvatars}
                onChange={() => handleToggle('showAvatars')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Hiệu ứng chuyển động</h4>
              <p className="text-sm text-gray-600">Bật/tắt animation và transitions</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.animationsEnabled}
                onChange={() => handleToggle('animationsEnabled')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        </button>
      </div>
    </div>
  );
};

export default AppearanceSettings;

