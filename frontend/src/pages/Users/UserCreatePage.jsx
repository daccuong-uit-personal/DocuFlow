
import React, { useState, useEffect, useContext } from 'react';
import { XMarkIcon, UserPlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';

const UserCreatePage = () => {
  const [roles, setRoles] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [errorRoles, setErrorRoles] = useState(null);

  const { user, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    const fetchRoles = async () => {
      if (authLoading) {
        return;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        setErrorRoles("Bạn chưa đăng nhập hoặc không có quyền truy cập. Vui lòng đăng nhập.");
        setLoadingRoles(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Không được phép truy cập. Vui lòng đăng nhập lại.");
          }
          if (response.status === 403) {
            throw new Error("Bạn không có quyền để thực hiện hành động này.");
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setRoles(data);
      } catch (error) {
        console.error("Could not fetch roles:", error);
        setErrorRoles(`Không thể tải danh sách vai trò: ${error.message}`);
      } finally {
        setLoadingRoles(false);
      }
    };

    if (!authLoading) {
      fetchRoles();
    }
  }, [user, authLoading]);

  return (
    <div>
      {/* Form Cấp tài khoản */}
      <div className="bg-gray-100 min-h-full font-sans">
        <h1 className="text-lg font-semibold mb-2 text-gray-800">Cấp tài khoản</h1>

      <div className="bg-white p-4 rounded-xl shadow-md">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên đăng nhập */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          {/* Giới tính */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
            <div className="relative">
              <select
                id="gender"
                name="gender"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none pr-10"
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          {/* Mật khẩu */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              id="password"
              name="password"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập mật khẩu"
            />
          </div>
          {/* Số điện thoại */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập số điện thoại"
            />
          </div>
          {/* Tên cán bộ */}
          <div>
            <label htmlFor="officerName" className="block text-sm font-medium text-gray-700 mb-1">Tên cán bộ</label>
            <input
              type="text"
              id="officerName"
              name="officerName"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập tên cán bộ"
            />
          </div>
          {/* Địa chỉ */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              id="address"
              name="address"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập địa chỉ"
            />
          </div>
          {/* Ngày sinh */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input
              type="date"
              id="dob"
              name="dob"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Phòng ban */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
            <input
              type="text"
              id="department"
              name="department"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Nhập phòng ban"
            />
          </div>
          {/* Vai trò */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <div className="relative">
              {loadingRoles || authLoading ? ( // Hiển thị loading nếu AuthContext đang tải hoặc vai trò đang tải
                <p className="text-gray-500 text-sm mt-1">Đang tải vai trò...</p>
              ) : errorRoles ? (
                <p className="text-red-500 text-sm mt-1">{errorRoles}</p>
              ) : (
                <select
                  id="role"
                  name="role"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.description}
                    </option>
                  ))}
                </select>
              )}
              {!loadingRoles && !errorRoles && (
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            className="flex items-center px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Hủy
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            <UserPlusIcon className="h-5 w-5 mr-2" />
            Tạo tài khoản
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserCreatePage;
