import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import AvatarUpload from '../../components/User/AvatarUpload';
import { useAuth } from '../../hooks/useAuth';

// Component LoadingSpinner inline để tránh lỗi import
const LoadingSpinner = ({ message = 'Đang tải...' }) => (
  <div className="flex flex-col items-center justify-center p-8">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-sm text-gray-600">{message}</p>
  </div>
);

const UserEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser, updateUserAvatar } = useAuth();

  const [userInfo, setUserInfo] = useState({
    userName: '',
    name: '',
    dayOfBirth: '',
    role: '',
    departmentID: '',
    gender: '',
    phoneNumber: '',
    address: '',
    avatar: null,
  });

  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load dữ liệu khi component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load user data, departments, và roles song song từ database
        const [userResponse, departmentsData, rolesData] = await Promise.all([
          userService.getUserById(id),
          userService.getDepartments(),
          userService.getRoles()
        ]);

        const user = userResponse.user;
        
        // Format ngày sinh để hiển thị trong input date
        const formattedDate = user.dayOfBirth 
          ? new Date(user.dayOfBirth).toISOString().split('T')[0] 
          : '';

        setUserInfo({
          userName: user.userName || '',
          name: user.name || '',
          dayOfBirth: formattedDate,
          role: user.role?._id || '',
          departmentID: user.departmentID?._id || '',
          gender: user.gender || '',
          phoneNumber: user.phoneNumber || '',
          address: user.address || '',
          avatar: user.avatar || null,
        });

        // Sử dụng dữ liệu thật từ database
        setDepartments(departmentsData || []);
        setRoles(rolesData || []);

      } catch (err) {
        console.error('Lỗi khi load dữ liệu:', err);
        toast.error(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarUpdate = (updatedUser) => {
    setUserInfo(prev => ({
      ...prev,
      avatar: updatedUser.avatar
    }));

    // Nếu đang chỉnh sửa chính tài khoản của mình, cập nhật navbar
    if (currentUser && currentUser._id === id) {
      updateUserAvatar(updatedUser);
    }
  };

  const handleConfirm = async () => {
    try {
      setSaving(true);

      // Validate dữ liệu
      if (!userInfo.name.trim()) {
        toast.error('Tên cán bộ không được để trống');
        return;
      }
      if (!userInfo.phoneNumber.trim()) {
        toast.error('Số điện thoại không được để trống');
        return;
      }
      if (!userInfo.dayOfBirth) {
        toast.error('Ngày sinh không được để trống');
        return;
      }
      if (!userInfo.gender) {
        toast.error('Vui lòng chọn giới tính');
        return;
      }
      if (!userInfo.role) {
        toast.error('Vui lòng chọn vai trò');
        return;
      }
      if (!userInfo.departmentID) {
        toast.error('Vui lòng chọn phòng ban');
        return;
      }

      // Chuẩn bị dữ liệu để gửi lên server
      const updateData = {
        name: userInfo.name.trim(),
        gender: userInfo.gender,
        phoneNumber: userInfo.phoneNumber.trim(),
        dayOfBirth: userInfo.dayOfBirth,
        address: userInfo.address.trim(),
        role: userInfo.role,
        departmentID: userInfo.departmentID,
      };

      await userService.updateUser(id, updateData);
      
      // Hiển thị thông báo thành công
      toast.success('Cập nhật thông tin người dùng thành công!');
      
      // Chuyển về trang danh sách sau 1.5 giây
      setTimeout(() => {
        navigate('/users');
      }, 1500);

    } catch (err) {
      console.error('Lỗi khi cập nhật:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Có lỗi xảy ra khi cập nhật thông tin';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-full font-sans">
        <LoadingSpinner message="Đang tải thông tin người dùng..." />
      </div>
    );
  }

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
            <AvatarUpload
              userId={id}
              currentAvatar={userInfo.avatar}
              onAvatarUpdate={handleAvatarUpdate}
              size="large"
            />
          </div>

          {/* Thông tin người dùng */}
          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tên đăng nhập - readonly */}
            <div>
              <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                Tên đăng nhập
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={userInfo.userName}
                readOnly
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Tên cán bộ */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Tên cán bộ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={userInfo.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập tên cán bộ"
              />
            </div>

            {/* Số điện thoại */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={userInfo.phoneNumber}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập số điện thoại"
              />
            </div>

            {/* Địa chỉ */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Địa chỉ
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={userInfo.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nhập địa chỉ"
              />
            </div>

            {/* Ngày sinh */}
            <div>
              <label htmlFor="dayOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                Ngày sinh <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="dayOfBirth"
                name="dayOfBirth"
                value={userInfo.dayOfBirth}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Giới tính */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Giới tính <span className="text-red-500">*</span>
              </label>
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
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Vai trò <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="role"
                  name="role"
                  value={userInfo.role}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none pr-10 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.description || role.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Phòng ban */}
            <div>
              <label htmlFor="departmentID" className="block text-sm font-medium text-gray-700 mb-1">
                Phòng ban <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  id="departmentID"
                  name="departmentID"
                  value={userInfo.departmentID}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none pr-10 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Chọn phòng ban</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            onClick={handleCancel}
            type="button"
            disabled={saving}
            className="flex items-center px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            type="button"
            disabled={saving}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </>
            ) : (
              <>
                <CheckIcon className="h-5 w-5 mr-2" />
                Lưu
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserEditPage;