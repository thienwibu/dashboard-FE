import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

const DepartmentOverview = () => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
      {/* Empty - Hoạt Động Nghiên Cứu & Đào Tạo đã được xóa */}
    </div>
  );
};

export default DepartmentOverview;
