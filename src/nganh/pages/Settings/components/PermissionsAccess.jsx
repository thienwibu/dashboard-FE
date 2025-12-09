import React, { useState } from 'react';
import { Shield, Edit, Check, X } from 'lucide-react';

const PermissionsAccess = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'TS. Nguyễn Văn An',
      role: 'Trưởng ngành',
      permissions: 'Toàn quyền',
      note: ''
    },
    {
      id: 2,
      name: 'TS. Trần Thị Bình',
      role: 'Giảng viên',
      permissions: 'Giảng dạy, nhập điểm',
      note: ''
    },
    {
      id: 3,
      name: 'ThS. Lê Văn Cường',
      role: 'Cố vấn học tập',
      permissions: 'Xem báo cáo sinh viên',
      note: ''
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userPermissions, setUserPermissions] = useState({
    classManagement: false,
    studentManagement: false,
    deleteCourse: false,
    sendRiskNotification: false
  });

  const permissionLabels = {
    classManagement: 'Quản lý lớp',
    studentManagement: 'Quản lý sinh viên',
    deleteCourse: 'Xóa khóa học',
    sendRiskNotification: 'Gửi thông báo rủi ro'
  };

  const handleEditPermissions = (user) => {
    setSelectedUser(user);
    // Mock permissions based on role
    if (user.role === 'Trưởng ngành') {
      setUserPermissions({
        classManagement: true,
        studentManagement: true,
        deleteCourse: true,
        sendRiskNotification: true
      });
    } else if (user.role === 'Giảng viên') {
      setUserPermissions({
        classManagement: true,
        studentManagement: true,
        deleteCourse: false,
        sendRiskNotification: true
      });
    } else {
      setUserPermissions({
        classManagement: false,
        studentManagement: false,
        deleteCourse: false,
        sendRiskNotification: false
      });
    }
    setShowModal(true);
  };

  const handleSavePermissions = () => {
    alert(`Đã cập nhật quyền cho ${selectedUser.name}`);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Phân quyền & Truy cập</h2>
        <p className="text-sm text-gray-600">Hiển thị danh sách người dùng theo vai trò</p>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quyền
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ghi chú
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(user.name.indexOf('.') + 2)}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-600">{user.permissions}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-400">{user.note || '-'}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleEditPermissions(user)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <Edit className="h-4 w-4" />
                    Chỉnh sửa quyền
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Permissions Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa quyền</h3>
                  <p className="text-sm text-gray-600">{selectedUser.name}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {Object.entries(userPermissions).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {permissionLabels[key]}
                    </span>
                    <button
                      onClick={() =>
                        setUserPermissions((prev) => ({ ...prev, [key]: !prev[key] }))
                      }
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        value
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {value ? (
                        <>
                          <Check className="h-4 w-4" />
                          Cho phép
                        </>
                      ) : (
                        <>
                          <X className="h-4 w-4" />
                          Từ chối
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSavePermissions}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermissionsAccess;

