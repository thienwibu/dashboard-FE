import React, { useState } from 'react';
import { Settings as SettingsIcon, Cog, Shield, Link2, FileText } from 'lucide-react';
import IndustryInfo from './components/IndustryInfo';
import GeneralConfiguration from './components/GeneralConfiguration';
import PermissionsAccess from './components/PermissionsAccess';
import IntegrationData from './components/IntegrationData';
import ReportsMonitoring from './components/ReportsMonitoring';
import { useTheme } from '../../contexts/ThemeContext';
import { mockDashboardData } from '../../data/mockData';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const { isDarkMode } = useTheme();

  // 4 tab chính cho cấu hình ngành
  const tabs = [
    {
      id: 'general',
      label: 'Cấu hình chung',
      icon: Cog,
      component: GeneralConfiguration,
      description: 'Ngưỡng rủi ro, chu kỳ cập nhật'
    },
    {
      id: 'permissions',
      label: 'Phân quyền & Truy cập',
      icon: Shield,
      component: PermissionsAccess,
      description: 'Quản lý quyền người dùng'
    },
    {
      id: 'integration',
      label: 'Tích hợp & Dữ liệu',
      icon: Link2,
      component: IntegrationData,
      description: 'Kết nối LMS, xuất dữ liệu'
    },
    {
      id: 'reports',
      label: 'Báo cáo & Giám sát',
      icon: FileText,
      component: ReportsMonitoring,
      description: 'Tần suất báo cáo, người nhận'
    }
  ];

  // Tính toán thông tin ngành từ mock data
  const departmentInfo = {
    name: 'Khoa Công nghệ Thông tin',
    code: 'CNTT',
    totalTeachers: mockDashboardData?.departmentOverview?.totalTeachers || 25,
    totalStudents: mockDashboardData?.departmentOverview?.totalStudents || 350,
    totalCourses: mockDashboardData?.courseMonitoring?.length || 12,
    manager: 'TS. Nguyễn Văn An'
  };

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <SettingsIcon className="text-white" size={32} />
            </div>
            <div>
              <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Cấu hình Ngành</h1>
              <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Cấu hình hệ thống, phân quyền và quản lý dữ liệu toàn ngành
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
             <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-sm border ${isDarkMode ? 'border-gray-700' : 'border-gray-100'} p-2`}>
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
                          ? isDarkMode 
                            ? 'bg-blue-900 text-blue-200 border-l-4 border-blue-500'
                            : 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                          : isDarkMode
                            ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon size={20} className={isActive ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-gray-400' : 'text-gray-400')} />
                      <div className="flex-1 min-w-0">
                        <p className={`font-medium ${isActive ? (isDarkMode ? 'text-blue-200' : 'text-blue-700') : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                          {tab.label}
                        </p>
                        <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {tab.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </nav>

            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Thông tin ngành */}
            <IndustryInfo departmentInfo={departmentInfo} />
            
            {/* Tab content */}
            {ActiveComponent && <ActiveComponent />}
          </div>
        </div>
      </div>

      {/* Modals đã được loại bỏ để đơn giản hóa cho quản lý ngành */}
    </div>
  );
};

export default Settings;

