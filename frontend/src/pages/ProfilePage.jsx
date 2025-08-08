import React, { useState, useEffect } from 'react';

import { PencilIcon, CheckIcon, XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import Avatar from '../components/common/Avatar';
import AvatarUpload from '../components/User/AvatarUpload';

// Import modal đổi mật khẩu
import ChangePasswordForm from '../components/User/ChangePasswordForm';

const ProfilePage = () => {
  const { user, updateUser, updateUserAvatar } = useAuth();
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
        role: user.role?.description || user.role?.name || '',
        department: user.departmentID?.name || '',
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
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      // Validate dữ liệu
      if (!userInfo.name.trim()) {
        toast.error('Tên cán bộ không được để trống');
        setLoading(false);
        return;
      }
      if (!userInfo.phoneNumber.trim()) {
        toast.error('Số điện thoại không được để trống');
        setLoading(false);
        return;
      }

      // Gọi hàm updateUser từ AuthContext để cập nhật thông tin
      const updatedData = {
        name: userInfo.name.trim(),
        phoneNumber: userInfo.phoneNumber.trim(),
        address: userInfo.address.trim(),
      };
      
      // Thêm các trường optional nếu có giá trị
      if (userInfo.gender) {
        updatedData.gender = userInfo.gender;
      }
      if (userInfo.dayOfBirth) {
        updatedData.dayOfBirth = userInfo.dayOfBirth;
      }

      await updateUser(updatedData);
      setIsEditing(false);
      toast.success('Cập nhật thông tin thành công!');
    } catch (error) {
      console.error("Failed to update user:", error);
      const errorMessage = error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại.';
      toast.error(errorMessage);
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
      role: user.role?.description || user.role?.name || '',
      department: user.departmentID?.name || '',
      gender: user.gender || '',
      phoneNumber: user.phoneNumber || '',
      address: user.address || '',
    });
    setIsEditing(false);
  };

  // Hàm xử lý cập nhật avatar
  const handleAvatarUpdate = (updatedUser) => {
    updateUserAvatar(updatedUser);
    // toast.success('Cập nhật ảnh đại diện thành công!');
  };

  // Hàm mở modal đổi mật khẩu
  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  // Hàm đóng modal đổi mật khẩu
  const handleCloseChangePasswordModal = () => {
    setShowChangePasswordModal(false);
  };

  // Hàm xử lý khi đổi mật khẩu thành công (từ modal)
  const handleConfirmPasswordChange = () => {
    console.log('Mật khẩu đã được đổi thành công!');
    toast.success('Đổi mật khẩu thành công!');
    setShowChangePasswordModal(false);
  };

  return (
    <div className="bg-gray-100 min-h-full font-sans">
      <h1 className="text-lg font-semibold mb-2 text-gray-800">Thông tin tài khoản</h1>

      {/* Profile Information Section */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ảnh đại diện */}
          <div className="md:col-span-1 lg:col-span-1 flex flex-col items-center">
            {isEditing ? (
              <AvatarUpload
                userId={user._id}
                currentAvatar={user.avatar}
                onAvatarUpdate={handleAvatarUpdate}
                size="large"
              />
            ) : (
              <Avatar 
                src={user.avatar}
                alt="Ảnh đại diện"
                size="xlarge"
                className="w-36 h-36 mb-4 border-4 border-gray-200 shadow-lg"
              />
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
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Tên cán bộ */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên cán bộ {isEditing && <span className="text-red-500">*</span>}
              </label>
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
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại {isEditing && <span className="text-red-500">*</span>}
              </label>
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
                disabled={loading}
                className="flex items-center px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
              >
                <XMarkIcon className="h-5 w-5 mr-2" />
                Hủy
              </button>
              <button
                onClick={handleConfirm}
                type="button"
                disabled={loading}
                className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <CheckIcon className="h-5 w-5 mr-2" />
                    Xác nhận
                  </>
                )}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleChangePassword}
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