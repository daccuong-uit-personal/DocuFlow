import React, { useState, useEffect } from 'react';

import { PencilIcon, CheckIcon, XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

// Import modal đổi mật khẩu
import ChangePasswordForm from '../components/User/ChangePasswordForm';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  // State cục bộ để quản lý dữ liệu trong form
  const [userInfo, setUserInfo] = useState({
    userName: '',
    name: '',
    dayOfBirth: '',
    role: '',
    department: '',
    gender: '',
    phoneNumber: '',
    address: '',
  });

  
  useEffect(() => {
    if (user) {
      setUserInfo({
        userName: user.userName || '',
        name: user.name || '',
        dayOfBirth: user.dayOfBirth ? new Date(user.dayOfBirth).toISOString().split('T')[0] : '',
        role: user.role?.name || '',
        department: user.departmentID.description || '',
        gender: user.gender || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
      });
    }
  }, [user]);

  // Hiển thị loading nếu chưa có user
  if (!user) {
    return <div>Đang tải thông tin...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
    console.log(value);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Gọi hàm updateUser từ AuthContext để cập nhật thông tin
      const updatedData = {
        userName: userInfo.userName,
        name: userInfo.name,
        gender: userInfo.gender,
        phoneNumber: userInfo.phoneNumber,
        address: userInfo.address,
        // Không thể cập nhật role, department từ đây
      };
      if (userInfo.dayOfBirth) {
        updatedData.dayOfBirth = new Date(userInfo.dayOfBirth).toISOString();
      }
      await updateUser(updatedData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Đặt lại state cục bộ về giá trị ban đầu từ AuthContext
    setUserInfo({
      userName: user.userName || '',
      name: user.name || '',
      dayOfBirth: user.dayOfBirth ? new Date(user.dayOfBirth).toISOString().split('T')[0] : '',
      role: user.role?.name || '',
      department: user.departmentID || '',
      gender: user.gender || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
    });
    setIsEditing(false);
  };

  // Hàm mở modal đổi mật khẩu
  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  // Hàm đóng modal đổi mật khẩu
  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
    // Có thể thêm logic thông báo hoặc tải lại dữ liệu sau khi đóng modal
  };

  // Hàm xử lý khi đổi mật khẩu thành công (từ modal)
  const handleConfirmPasswordChange = () => {
    console.log('Mật khẩu đã được đổi thành công!');
    setShowChangePasswordModal(false); // Đóng modal sau khi đổi thành công
    // Có thể thêm thông báo thành công cho người dùng
  };

  return (
    <div className="bg-gray-100 min-h-full font-sans p-6">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">Thông tin tài khoản</h1>

      {/* Profile Information Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ảnh đại diện */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col items-center">
            <img src="https://placehold.co/150x150/cccccc/ffffff?text=AV" alt="Ảnh đại diện" className="w-36 h-36 rounded-full mb-4 object-cover" />
            {isEditing && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150 ease-in-out">
                Thay đổi ảnh
              </button>
            )}
          </div>

          {/* Các trường thông tin */}
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên đăng nhập */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="userName"
                value={userInfo.userName}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập tên đăng nhập" : ""}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
            </div>

            {/* Tên cán bộ */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Tên cán bộ</label>
              <input
                type="text"
                id="fullName"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập tên cán bộ" : ""}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label htmlFor="dayOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                id="dayOfBirth"
                name="dayOfBirth"
                value={userInfo.dayOfBirth}
                onChange={handleChange}
                readOnly={!isEditing}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
            </div>

            {/* Giới tính */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              {isEditing ? (
                <div className="relative">
                  <select
                    id="gender"
                    name="gender"
                    value={userInfo.gender}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none pr-10"
                  >
                    <option value="">Chọn giới tính</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                  <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              ) : (
                <input
                  type="text"
                  id="gender"
                  name="gender"
                  value={userInfo.gender}
                  readOnly
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
                />
              )}
            </div>

            {/* Vai trò */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <input
                type="text"
                id="role"
                name="role"
                value={userInfo.role}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập số điện thoại" : ""}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
            </div>

            {/* Phòng ban */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <input
                type="text"
                id="department"
                name="department"
                value={userInfo.department}
                readOnly
                placeholder="Nhập phòng ban"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <input
                type="text"
                id="address"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập địa chỉ" : ""}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                type="button"
                className="flex items-center px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                type="button"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                Xác nhận
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleChangePassword} // Gọi hàm mở modal
                type="button"
                className="flex items-center px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                <KeyIcon className="h-5 w-5 mr-2" />
                Đổi mật khẩu
              </button>
              <button
                onClick={handleEdit}
                type="button"
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                Chỉnh sửa
              </button>
            </>
          )}
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      <ChangePasswordForm
        isOpen={showChangePasswordModal}
        onClose={handleCloseChangePasswordModal}
        onConfirm={handleConfirmPasswordChange}
      />
    </div>
  );
};

export default ProfilePage;
