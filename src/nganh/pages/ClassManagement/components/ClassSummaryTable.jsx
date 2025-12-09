import React, { useState, useEffect, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Eye } from 'lucide-react';
import { coursePerformanceData } from '../../../data/coursePerformanceData';

const ClassSummaryTable = ({ classes = [], onClassClick }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filteredClasses, setFilteredClasses] = useState(classes);

  // Update filteredClasses when classes prop changes
  useEffect(() => {
    setFilteredClasses(classes);
  }, [classes]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));

    const sorted = [...filteredClasses].sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      if (key === 'riskLevel') {
        const riskOrder = { 'high': 3, 'medium': 2, 'low': 1 };
        aVal = riskOrder[a.riskLevel] || 0;
        bVal = riskOrder[b.riskLevel] || 0;
      }

      if (typeof aVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
    });

    setFilteredClasses(sorted);
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="h-3 w-3 text-blue-600" />
      : <ArrowDown className="h-3 w-3 text-blue-600" />;
  };

  const getRiskBadge = (riskLevel) => {
    const styles = {
      low: 'bg-green-100 text-green-700',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-red-100 text-red-700'
    };
    const labels = {
      low: 'Thấp',
      medium: 'Trung bình',
      high: 'Cao'
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[riskLevel] || styles.low}`}>
        {labels[riskLevel] || riskLevel}
      </span>
    );
  };

  const handleExport = () => {
    alert('Tính năng xuất Excel sẽ được triển khai');
  };

  // Transform classes data và nhóm theo lớp
  const classStudentCounts = useMemo(() => {
    const counters = {};
    coursePerformanceData.students.forEach((student) => {
      counters[student.className] = (counters[student.className] || 0) + 1;
    });
    return counters;
  }, []);

  const transformData = filteredClasses.map(cls => ({
    id: cls.id,
    name: cls.name || '',
    course: cls.course || cls.courseName || '',
    instructor: cls.instructor || 'N/A',
    studentCount: classStudentCounts[cls.name] || cls.enrolledStudents || cls.studentCount || 0,
    averageProgress: cls.completionRate || cls.averageProgress || 0,
    riskLevel: cls.riskLevel || 'low',
    note: cls.note || '-'
  }));

  // Nhóm dữ liệu theo tên lớp
  const groupedData = useMemo(() => {
    const groups = {};
    transformData.forEach(item => {
      if (!groups[item.name]) {
        groups[item.name] = [];
      }
      groups[item.name].push(item);
    });
    return groups;
  }, [transformData]);

  // Flatten lại nhưng giữ thông tin nhóm
  const tableData = useMemo(() => {
    const result = [];
    Object.entries(groupedData).forEach(([className, items]) => {
      // Thêm một row header cho mỗi nhóm
      result.push({
        isGroupHeader: true,
        className,
        itemCount: items.length
      });
      // Thêm các items của nhóm
      items.forEach(item => result.push(item));
    });
    return result;
  }, [groupedData]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Tổng hợp lớp học</h3>
          <p className="text-sm text-gray-600">Dễ lọc, sắp xếp, xuất báo cáo</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Download className="h-4 w-4" />
          Xuất báo cáo
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-1">
                  Tên lớp
                  {getSortIcon('name')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('course')}
              >
                <div className="flex items-center gap-1">
                  Môn học
                  {getSortIcon('course')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('instructor')}
              >
                <div className="flex items-center gap-1">
                  Giảng viên
                  {getSortIcon('instructor')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('studentCount')}
              >
                <div className="flex items-center gap-1">
                  Số SV
                  {getSortIcon('studentCount')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('averageProgress')}
              >
                <div className="flex items-center gap-1">
                  Tiến độ TB
                  {getSortIcon('averageProgress')}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('riskLevel')}
              >
                <div className="flex items-center gap-1">
                  Rủi ro
                  {getSortIcon('riskLevel')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi chú
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableData.map((item, index) => {
              // Render group header
              if (item.isGroupHeader) {
                return (
                  <tr
                    key={`group-${item.className}`}
                    className="bg-blue-50 hover:bg-blue-100 transition-colors border-t-2 border-blue-200"
                  >
                    <td colSpan={9} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-1 bg-blue-600 rounded-full"></div>
                        <span className="text-sm font-bold text-blue-900">
                          Lớp {item.className} ({item.itemCount} môn học)
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              }

              // Render normal row với màu nền xen kẽ theo nhóm
              const groupIndex = tableData.slice(0, index).filter(i => i.isGroupHeader).length;
              const isEvenGroup = groupIndex % 2 === 0;
              
              return (
                <tr
                  key={item.id}
                  className={`transition-colors border-l-4 ${
                    isEvenGroup 
                      ? 'bg-white hover:bg-gray-50 border-transparent' 
                      : 'bg-gray-50 hover:bg-gray-100 border-transparent'
                  }`}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 pl-8">
                    {item.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {item.course || item.courseName || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {item.instructor}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {item.studentCount}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>{item.averageProgress || 0}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-full rounded-full ${
                            (item.averageProgress || 0) >= 80 ? 'bg-green-500' :
                            (item.averageProgress || 0) >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${item.averageProgress || 0}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getRiskBadge(item.riskLevel || 'low')}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                    {item.note || '-'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      onClick={() => onClassClick?.(item)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye className="h-4 w-4" />
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSummaryTable;

