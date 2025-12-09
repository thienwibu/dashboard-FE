import React, { useState, useRef, useEffect } from 'react';

const PanelLeftDashed = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <rect width="18" height="18" x="3" y="3" rx="2"></rect>
    <path d="M9 14v1"></path>
    <path d="M9 19v2"></path>
    <path d="M9 3v2"></path>
    <path d="M9 9v1"></path>
  </svg>
);

const Check = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SidebarControl = ({ mode, onModeChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const modes = [
    { value: 'expanded', label: 'Expanded' },
    { value: 'collapsed', label: 'Collapsed' },
    { value: 'hover', label: 'Expand on hover' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleModeSelect = (value) => {
    onModeChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-600 hover:text-gray-900"
        title="Sidebar control"
      >
        <PanelLeftDashed className="h-3.5 w-3.5" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">
            Sidebar control
          </div>
          {modes.map((item) => (
            <button
              key={item.value}
              onClick={() => handleModeSelect(item.value)}
              className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <span>{item.label}</span>
              {mode === item.value && (
                <Check className="h-4 w-4 text-primary-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarControl;

