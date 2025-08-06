// Trang chi tiết và chỉnh sửa người dùng
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import các icon cần thiết
import { PencilIcon, CheckIcon, XMarkIcon, KeyIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const UserDetailPage = () => {
  // Khởi tạo hook useNavigate
  const navigate = useNavigate();

  // Khởi tạo với dữ liệu mẫu
  const [userInfo, setUserInfo] = useState({
    username: 'nguyendaccuong',
    fullName: 'Nguyễn Đắc Cường',
    dateOfBirth: '1990-01-01',
    role: 'Admin',
    department: 'Phòng CNTT',
    gender: 'Nam',
    phoneNumber: '0123456789',
    address: 'Số 123, Đường ABC, Quận XYZ, TP.HCM',
  });

  const [isEditing, setIsEditing] = useState(false);

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

  const handleConfirm = () => {
    console.log('Thông tin đã được xác nhận và sẽ được lưu:', userInfo);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log('Hủy chỉnh sửa');
    setIsEditing(false);
  };

  const handleChangePassword = () => {
    console.log('Chuyển đến trang đổi mật khẩu');
  };

  // Thêm hàm xử lý Quay lại
  const handleGoBack = () => {
      navigate(-1);
  };

  return (
    <div className="bg-gray-100 min-h-full font-sans">
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={handleGoBack} 
          className="p-1 rounded-full text-gray-700 hover:bg-gray-300"
          title="Quay lại"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Thông tin tài khoản</h1>
      </div>
      
      {/* Profile Information Section */}
      <div className="bg-white p-4 rounded-xl shadow-md">
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
                name="username"
                value={userInfo.username}
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
                name="fullName"
                value={userInfo.fullName}
                onChange={handleChange}
                readOnly={!isEditing}
                placeholder={isEditing ? "Nhập tên cán bộ" : ""}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${!isEditing ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={userInfo.dateOfBirth}
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
        {/* <div className="flex justify-end space-x-4 mt-8">
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
        </div> */}
      </div>
    </div>
  );
};

export default UserDetailPage;
