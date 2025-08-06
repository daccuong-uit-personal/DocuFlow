import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

const UserEditPage = () => {
  // Khởi tạo hook useNavigate
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    username: 'nguyendaccuong',
    fullName: 'Nguyễn Đắc Cường',
    dateOfBirth: '1990-01-01',
    role: '',
    department: '',
    gender: 'Nam',
    phoneNumber: '0123456789',
    address: 'Số 123, Đường ABC, Quận XYZ, TP.HCM',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = () => {
    console.log('Thông tin được cập nhật:', userInfo);
  };

  const handleCancel = () => {
    console.log('Đã hủy chỉnh sửa');
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
        <h1 className="text-lg font-semibold text-gray-800">Chỉnh sửa người dùng</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Ảnh đại diện */}
          <div className="md:col-span-1 flex flex-col items-center">
            <img
              src="https://placehold.co/150x150/cccccc/ffffff?text=AV"
              alt="Ảnh đại diện"
              className="w-36 h-36 rounded-full mb-4 object-cover"
            />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-150">
              Thay đổi ảnh
            </button>
          </div>

          {/* Thông tin người dùng */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 'username', label: 'Tên đăng nhập' },
              { id: 'fullName', label: 'Tên cán bộ' },
              { id: 'phoneNumber', label: 'Số điện thoại' },
              { id: 'address', label: 'Địa chỉ' },
            ].map(({ id, label }) => (
              <div key={id}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <input
                  type="text"
                  id={id}
                  name={id}
                  value={userInfo[id]}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}

            {/* Ngày sinh */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={userInfo.dateOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Giới tính */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <div className="relative">
                <select
                  id="gender"
                  name="gender"
                  value={userInfo.gender}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none pr-10 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Vai trò */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <input
                type="text"
                id="role"
                name="role"
                value={userInfo.role}
                onChange={handleChange}
                placeholder="Nhập vai trò"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
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
                onChange={handleChange}
                placeholder="Nhập phòng ban"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleCancel}
            type="button"
            className="flex items-center px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            type="button"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;
