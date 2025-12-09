import React from 'react';
import { Download, RefreshCw } from 'lucide-react';

const DashboardHeader = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Quản Lý Ngành</h1>
        <p className="text-gray-600 mt-1">Quản lý toàn diện khoa Công Nghệ Thông Tin - Giảng viên, sinh viên và hoạt động đào tạo</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">
          <button className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Làm mới</span>
          </button>
          
          <button className="btn-primary flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
      </div>
    </div>
  );
};

export default DashboardHeader;