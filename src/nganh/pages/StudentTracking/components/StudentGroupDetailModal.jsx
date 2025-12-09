import React, { useState } from 'react';
import { X, Download, User } from 'lucide-react';

const StudentGroupDetailModal = ({ isOpen, onClose, groupData, students = [] }) => {
  const [selectedStudents, setSelectedStudents] = useState([]);

  if (!isOpen || !groupData) return null;

  const handleSelectAll = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(s => s.id));
    }
  };

  const handleExport = () => {
    alert(`Xuất ${selectedStudents.length} sinh viên ra Excel`);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Chi tiết nhóm: {groupData.group || 'N/A'}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {students.length} sinh viên | Điểm TB: {groupData.averageScore?.toFixed(1) || '0.0'}/10 | Tiến độ: {groupData.averageProgress || 0}%
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              disabled={selectedStudents.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4" />
              <span>Xuất Excel ({selectedStudents.length})</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedStudents.length === students.length && students.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Chọn tất cả</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map((student) => (
              <div
                key={student.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedStudents.includes(student.id)
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                }`}
                onClick={() => {
                  setSelectedStudents(prev =>
                    prev.includes(student.id)
                      ? prev.filter(id => id !== student.id)
                      : [...prev, student.id]
                  );
                }}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={selectedStudents.includes(student.id)}
                    onChange={() => {}}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-gray-400" />
                      <h4 className="font-semibold text-gray-900">{student.name}</h4>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{student.studentId || student.email}</p>
                    <div className="flex items-center gap-4 text-xs">
                      <span className="text-gray-600">
                        Điểm: <span className="font-semibold">{student.averageScore?.toFixed(1) || '0.0'}/10</span>
                      </span>
                      <span className="text-gray-600">
                        Tiến độ: <span className="font-semibold">{student.completionRate || 0}%</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {students.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p>Không có dữ liệu sinh viên</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentGroupDetailModal;

