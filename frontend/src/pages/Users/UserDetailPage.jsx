// userdetailpage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Avatar from '../../components/common/Avatar';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Import service
import userService from '../../services/userService';

const UserDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID người dùng từ URL
  const [userInfo, setUserInfo] = useState(null); // Khởi tạo với giá trị null
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await userService.getUserById(id);
        setUserInfo(response.user); // Cập nhật state với userObject
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]); // Gọi lại useEffect khi id thay đổi

  // Hiển thị trạng thái loading
  if (loading) {
    return (
            <div className="bg-gray-100 min-h-full">
                <LoadingSpinner size="large" message="Đang tải chi tiết người dùng..." />
            </div>
        );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return <div className="text-center mt-8 text-red-500">Lỗi: {error}</div>;
  }

  // Nếu không có thông tin người dùng, có thể hiển thị thông báo
  if (!userInfo) {
    return <div className="text-center mt-8">Không tìm thấy thông tin người dùng.</div>;
  }

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
      
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="md:col-span-1 lg:col-span-1 flex flex-col items-center">
            {/* Sử dụng Avatar component */}
            <Avatar 
              src={userInfo.avatar}
              alt="Ảnh đại diện"
              size="xlarge"
              className="w-36 h-36 mb-4 border-4 border-gray-200 shadow-lg"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên đăng nhập */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={userInfo.userName || ''}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Tên đầy đủ */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Tên đầy đủ</label>
              <input
                type="text"
                id="name"
                name="name"
                value={userInfo.name || ''}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label htmlFor="dayOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                id="dayOfBirth"
                name="dayOfBirth"
                value={userInfo.dayOfBirth ? userInfo.dayOfBirth.substring(0, 10) : ''}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
            
            {/* Giới tính */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <input
                type="text"
                id="gender"
                name="gender"
                value={userInfo.gender || ''}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Vai trò */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
              <input
                type="text"
                id="role"
                name="role"
                value={userInfo.role?.description || ''}
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
                value={userInfo.phoneNumber || ''}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Phòng ban */}
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <input
                type="text"
                id="department"
                name="department"
                value={userInfo.departmentID?.name || ''}
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
                value={userInfo.address || ''}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;