import React from 'react';
import { Users, Download, Grid, BarChart3, Filter } from 'lucide-react';

const StudentTrackingHeader = ({
  totalStudents,
  filteredCount,
  onExport,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Theo Dõi Sinh Viên</h1>
          <p className="text-lg text-gray-600 mt-2">
            Quản lý và theo dõi tiến độ học tập của {totalStudents} sinh viên
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'grid'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Grid className="h-4 w-4" />
              <span>Lưới</span>
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'list'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <Users className="h-4 w-4" />
              <span>Danh sách</span>
            </button>
            <button
              onClick={() => onViewModeChange('analytics')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'analytics'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Phân tích</span>
            </button>
          </div>

          <button
            onClick={onExport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </div>

      {filteredCount !== totalStudents && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-primary-600" />
            <span className="text-primary-800 font-medium">
              Đang hiển thị {filteredCount} trong tổng số {totalStudents} sinh viên
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTrackingHeader;