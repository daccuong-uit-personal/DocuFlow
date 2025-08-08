import React, { useState, useEffect, useContext } from 'react';
import { XMarkIcon, UserPlusIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const UserCreatePage = () => {
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [errorRoles, setErrorRoles] = useState(null);
  const [errorDepartments, setErrorDepartments] = useState(null);

  const { user, loading: authLoading } = useContext(AuthContext);

  // Dữ liệu mẫu
  const [formData, setFormData] = useState({
    username: '',
    gender: '',
    password: '',
    phone: '',
    officerName: '',
    address: '',
    dob: '',
    department: '',
    role: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lấy vai trò và phòng ban
  useEffect(() => {
    const fetchDropdownData = async () => {
      if (authLoading) {
        return;
      }

      const token = localStorage.getItem('token');

      if (!token) {
        toast.error("Bạn chưa đăng nhập hoặc không có quyền truy cập!");
        setErrorRoles("Bạn chưa đăng nhập hoặc không có quyền truy cập!");
        setErrorDepartments("Bạn chưa đăng nhập hoặc không có quyền truy cập!");
        setLoadingRoles(false);
        setLoadingDepartments(false);
        return;
      }

      // Lấy role
      try {
        const rolesResponse = await fetch('http://localhost:8000/api/roles', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!rolesResponse.ok) {
          if (rolesResponse.status === 401) throw new Error("Không được phép truy cập vai trò!");
          if (rolesResponse.status === 403) throw new Error("Bạn không có quyền xem danh sách vai trò!");
          throw new Error(`HTTP error! status: ${rolesResponse.status}`);
        }
        const rolesData = await rolesResponse.json();
        setRoles(rolesData);
      } catch (error) {
        console.error("Could not fetch roles:", error);
        setErrorRoles(`Không thể tải danh sách vai trò: ${error.message}`);
        toast.error(`Không thể tải danh sách vai trò: ${error.message}`);
      } finally {
        setLoadingRoles(false);
      }

      // Lấy department
      try {
        const departmentsResponse = await fetch('http://localhost:8000/api/departments', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
        });

        if (!departmentsResponse.ok) {
          if (departmentsResponse.status === 401) throw new Error("Không được phép truy cập phòng ban!");
          if (departmentsResponse.status === 403) throw new Error("Bạn không có quyền xem danh sách phòng ban!");
          throw new Error(`HTTP error! status: ${departmentsResponse.status}`);
        }
        const departmentsData = await departmentsResponse.json();
        setDepartments(departmentsData);
      } catch (error) {
        console.error("Could not fetch departments:", error);
        setErrorDepartments(`Không thể tải danh sách phòng ban: ${error.message}`);
        toast.error(`Không thể tải danh sách phòng ban: ${error.message}`);
      } finally {
        setLoadingDepartments(false);
      }
    };

    if (!authLoading) {
      fetchDropdownData();
    }
  }, [authLoading]);

  // Xử lý thay đổi dữ liệu trong form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate form data
  const validateForm = () => {
    const { username, password, officerName, phone, address, dob, department, role } = formData;
    if (!username || !password || !officerName || !phone || !address || !dob || !department || !role) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return false;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return false;
    }

    if (!/^0\d{9}$/.test(phone)) {
      toast.error("SDT phải bắt đầu bằng số 0 và có 10 số!");
      return false;
    }

    const today = new Date();
    const birthDate = new Date(dob);
    if (birthDate >= today) {
      toast.error("Ngày sinh không được lớn hơn ngày hiện tại!");
      return false;
    }

    return true;
  };

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setIsSubmitting(false);
      toast.error('Bạn chưa đăng nhập hoặc không có quyền truy cập!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userName: formData.username,
          password: formData.password,
          name: formData.officerName,
          gender: formData.gender,
          phoneNumber: formData.phone,
          dayOfBirth: formData.dob,
          address: formData.address,
          departmentID: formData.department,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || `Lỗi khi tạo tài khoản: ${response.statusText}`);
        return;
      }

      toast.success('Tài khoản đã được tạo thành công!');
      setFormData({
        username: '',
        gender: '',
        password: '',
        phone: '',
        officerName: '',
        address: '',
        dob: '',
        department: '',
        role: ''
      });
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(`Lỗi kết nối hoặc lỗi không xác định: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <h1 className="text-lg font-semibold mb-2 text-gray-800">Cấp tài khoản mới</h1>

      <div className="bg-white rounded-xl shadow-md p-4">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tên đăng nhập */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
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
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none pr-10"
              >
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
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
              value={formData.password}
              onChange={handleChange}
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
              value={formData.phone}
              onChange={handleChange}
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
              value={formData.officerName}
              onChange={handleChange}
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
              value={formData.address}
              onChange={handleChange}
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
              value={formData.dob}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Phòng ban */}
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
            <div className="relative">
              {(loadingDepartments || authLoading) ? (
                <p className="text-gray-500 text-sm mt-1">Đang tải phòng ban...</p>
              ) : errorDepartments ? (
                <p className="text-red-500 text-sm mt-1">{errorDepartments}</p>
              ) : (
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Chọn phòng ban</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.description}
                    </option>
                  ))}
                </select>
              )}
              {!(loadingDepartments || errorDepartments) && (
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>

          {/* Vai trò */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <div className="relative">
              {(loadingRoles || authLoading) ? (
                <p className="text-gray-500 text-sm mt-1">Đang tải vai trò...</p>
              ) : errorRoles ? (
                <p className="text-red-500 text-sm mt-1">{errorRoles}</p>
              ) : (
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm appearance-none pr-10"
                >
                  <option value="">Chọn vai trò</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.description}
                    </option>
                  ))}
                </select>
              )}
              {!(loadingRoles || errorRoles) && (
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              )}
            </div>
          </div>
        </form>

        {/* Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={() => {
              setFormData({
                username: '', gender: '', password: '', phone: '',
                officerName: '', address: '', dob: '', department: '', role: ''
              });
              toast.info("Đã hủy thao tác tạo tài khoản.");
            }}
            className="flex items-center px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
          >
            <XMarkIcon className="h-5 w-5 mr-2" />
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <UserPlusIcon className="h-5 w-5 mr-2" />
            )}
            {isSubmitting ? 'Đang tạo...' : 'Tạo tài khoản'}
          </button>
        </div>
      </div>

      {/* ToastContainer để thông báo */}
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default UserCreatePage;
