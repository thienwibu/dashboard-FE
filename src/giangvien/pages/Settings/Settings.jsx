import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Palette, Shield } from 'lucide-react';
import ProfileSettings from './components/ProfileSettings';
import NotificationSettings from './components/NotificationSettings';
import AppearanceSettings from './components/AppearanceSettings';
import SecuritySettings from './components/SecuritySettings';
import ExportDataModal from './components/ExportDataModal';
import ImportDataModal from './components/ImportDataModal';
import DeleteAccountModal from './components/DeleteAccountModal';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);

  const tabs = [
    {
      id: 'profile',
      label: 'Hồ sơ',
      icon: User,
      component: ProfileSettings,
      description: 'Quản lý thông tin cá nhân'
    },
    {
      id: 'notifications',
      label: 'Thông báo',
      icon: Bell,
      component: NotificationSettings,
      description: 'Cấu hình thông báo'
    },
    {
      id: 'appearance',
      label: 'Giao diện',
      icon: Palette,
      component: AppearanceSettings,
      description: 'Tùy chỉnh giao diện'
    },
    {
      id: 'security',
      label: 'Bảo mật',
      icon: Shield,
      component: SecuritySettings,
      description: 'Cài đặt bảo mật'
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <SettingsIcon className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Cài đặt</h1>
              <p className="text-gray-600 mt-1">
                Quản lý tài khoản và tùy chỉnh hệ thống
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${isActive ? 'text-blue-700' : 'text-gray-900'}`}>
                          {tab.label}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {tab.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>

               {/* Quick Actions */}
               <div className="mt-6 pt-6 border-t border-gray-100">
                 <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3 px-4">
                   Hành động nhanh
                 </h4>
                 <div className="space-y-1">
                   <button 
                     onClick={() => setIsExportModalOpen(true)}
                     className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                   >
                     Xuất dữ liệu
                   </button>
                   <button 
                     onClick={() => setIsImportModalOpen(true)}
                     className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                   >
                     Nhập dữ liệu
                   </button>
                   <button 
                     onClick={() => setIsDeleteAccountModalOpen(true)}
                     className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                   >
                     Xóa tài khoản
                   </button>
                 </div>
               </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExportDataModal 
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
      
      <ImportDataModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
      
      <DeleteAccountModal 
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
      />
    </div>
  );
};

export default Settings;

