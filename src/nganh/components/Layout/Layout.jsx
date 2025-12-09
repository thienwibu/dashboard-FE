import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useTheme } from '../../contexts/ThemeContext';
import '../../theme.css';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <div
      className={`nganh-theme ${isDarkMode ? 'dark' : ''} flex h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}
    >
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main
          className={`flex-1 overflow-x-hidden overflow-y-auto px-4 sm:px-6 lg:px-10 py-6 transition-colors ${
            isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
          }`}
        >
          <div className="w-full max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
