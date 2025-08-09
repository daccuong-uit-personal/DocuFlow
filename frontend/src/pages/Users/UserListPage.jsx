// Trang danh sách người dùng

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from "@heroicons/react/24/outline";

// Import component DataTable
import DataTable from "../../components/Table/DataTable";
import userService from '../../services/userService';

import { useUsers } from '../../hooks/useUsers';

const mockDepartments = [
  { _id: '', name: 'Tất cả phòng ban' },
  { _id: 'Phòng Kế hoạch Tài chính', name: 'Phòng Kế hoạch Tài chính' },
  { _id: 'Phòng Công nghệ thông tin', name: 'Phòng Công nghệ thông tin' },
];
const mockRoles = [
  { _id: '', name: 'Tất cả vai trò' },
  { _id: 'admin', name: 'admin' },
  { _id: 'giam_doc', name: 'giam_doc' },
];
const mockGenders = [
  { value: '', label: 'Tất cả giới tính' },
  { value: 'Nam', label: 'Nam' },
  { value: 'Nữ', label: 'Nữ' },
  { value: 'Khác', label: 'Khác' },
];

const userColumns = [
  { key: 'userName', header: 'Tên người dùng', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'name', header: 'Tên đầy đủ', sortable: true, widthClass: 'min-w-[300px]' },
  { key: 'gender', header: 'Giới tính', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'phoneNumber', header: 'Số điện thoại', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'dayOfBirth', header: 'Ngày sinh', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'departmentID', header: 'Phòng ban', sortable: true, widthClass: 'min-w-[300px]', render: (departmentID) => departmentID?.name },
  { key: 'role', header: 'Vai trò', sortable: true, widthClass: 'min-w-[200px]', render: (role) => role?.description },
  { key: 'isLocked', header: 'Trạng thái', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'action', header: 'Thao tác', sortable: false, widthClass: 'min-w-[120px] text-center', sticky: true },
];

// Component Modal xác nhận xóa
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, user, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="flex items-center mb-4">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Xác nhận xóa người dùng</h3>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            Bạn có chắc chắn muốn xóa người dùng này không?
          </p>
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="font-medium text-gray-900">{user?.name}</p>
            <p className="text-sm text-gray-600">@{user?.userName}</p>
            <p className="text-sm text-gray-600">{user?.departmentID?.name}</p>
          </div>
          <p className="text-red-600 text-sm mt-2 font-medium">
            ⚠️ Hành động này không thể hoàn tác!
          </p>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xóa...
              </>
            ) : (
              'Xóa người dùng'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const UserListPage = () => {
  const { users, loading, error, fetchUsers } = useUsers();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterGender, setFilterGender] = useState('');
  const [filterIsLocked, setFilterIsLocked] = useState('');

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // States cho modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);

  // State cho toggle lock
  const [lockingUserId, setLockingUserId] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchUsers(searchQuery, filterDepartment, filterRole, filterGender, filterIsLocked);
      setCurrentPage(1);
    }
  };
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers(searchQuery, filterDepartment, filterRole, filterGender, filterIsLocked);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery, filterDepartment, filterRole, filterGender, filterIsLocked, fetchUsers]);

  const handleResetSearch = () => {
    setSearchQuery('');
    fetchUsers('');
    setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
    if (field === 'departmentID') setFilterDepartment(value);
    if (field === 'role') setFilterRole(value);
    if (field === 'gender') setFilterGender(value);
    if (field === 'isLocked') setFilterIsLocked(value);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleResetFilters = () => {
    setFilterDepartment('');
    setFilterRole('');
    setFilterGender('');
    setFilterIsLocked('');
  };

  // Calculate total pages and data for the current page
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = users.slice(startIndex, endIndex);

  // Event handlers for pagination
  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const handleViewUser = (user) => {
    navigate(`/users/detail/${user._id}`);
  };

  const handleEditUser = (user) => {
    // Chuyển hướng đến trang chỉnh sửa với id của người dùng
    navigate(`/users/edit/${user._id}`);
  };

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  // Thêm hàm mới để xử lý toggle lock
  const handleToggleLock = async (user) => {
    try {
      setLockingUserId(user._id);
      
      const response = await userService.toggleLockStatus(user._id);
      
      // Hiển thị thông báo thành công
      const action = response.user.isLocked ? 'Khóa' : 'Mở khóa';
      toast.success(`${action} tài khoản thành công!`);
      
      // Refresh danh sách người dùng
      await fetchUsers(searchQuery, filterDepartment, filterRole, filterGender, filterIsLocked);
      
    } catch (error) {
      console.error('Lỗi khi toggle lock:', error);
      toast.error(error || 'Có lỗi xảy ra khi thay đổi trạng thái tài khoản');
    } finally {
      setLockingUserId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setIsDeleting(true);
      
      await userService.deleteUser(userToDelete._id);
      
      // Hiển thị thông báo thành công
      toast.success(`Xóa người dùng thành công!`);
      
      // Refresh danh sách người dùng
      await fetchUsers(searchQuery, filterDepartment, filterRole, filterGender, filterIsLocked);
      
      // Đóng modal
      setShowDeleteModal(false);
      setUserToDelete(null);
      
    } catch (error) {
      console.error('Lỗi khi xóa người dùng:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa người dùng');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  // ----------------------------------------------------
  // CÁC HÀM MỚI ĐƯỢC THÊM VÀO ĐỂ TRUYỀN XUỐNG DATATABLE
  // Xử lý khi chọn/bỏ chọn tất cả các dòng
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allIds = currentData.map(item => item._id);
      setSelectedUserIds(allIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  // Xử lý khi chọn/bỏ chọn một dòng
  const handleSelectOne = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedUserIds(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedUserIds(prevSelected => prevSelected.filter(itemId => itemId !== id));
    }
  };
  // ----------------------------------------------------

  const handleDeleteSelectedUsers = () => {
    if (selectedUserIds.length > 0) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedUserIds.length} người dùng đã chọn không?`)) {
        console.log('Xóa các người dùng có IDs:', selectedUserIds);
        // Thêm logic xóa nhiều người dùng tại đây
        setSelectedUserIds([]);
      }
    } else {
      console.log('Không có người dùng nào được chọn để xóa.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-full font-sans">
      <h1 className="text-lg font-semibold mb-2 text-gray-800">Danh sách người dùng</h1>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-md p-2">

        {/* Search, Filter, Export, New User */}
        <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
          <div className="relative w-full sm:w-96 text-xs">
            <input
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Tìm kiếm theo tên người dùng, tên đầy đủ,..."
              className="w-full h-8 pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            {searchQuery && (
              <button
                onClick={handleResetSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <XMarkIcon />
              </button>
            )}
          </div>

          <div className="flex flex-wrap space-x-3 h-8">
            <button
              className="h-8 flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
              onClick={() => setShowFilterPanel(!showFilterPanel)}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Lọc
            </button>
            {selectedUserIds.length > 0 ? (
              <button
                onClick={handleDeleteSelectedUsers}
                className="h-8 flex items-center px-1 py-2 text-xs font-medium text-red-600 bg-white border border-red-600 rounded-lg shadow-sm hover:bg-red-50"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                Xóa ({selectedUserIds.length})
              </button>
            ) : (
              <button className="h-8 flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
                <PlusIcon className="h-5 w-5 mr-2" />
                Thêm người dùng
              </button>
            )}
          </div>
        </div>
        {showFilterPanel && (
          <div className="p-4 border border-gray-200 rounded-lg mb-2 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-gray-700">Bộ lọc:</span>
            <select
              className="border border-gray-300 rounded-lg p-1"
              value={filterDepartment}
              onChange={(e) => handleFilterChange('departmentID', e.target.value)}
            >
              {mockDepartments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg p-1"
              value={filterRole}
              onChange={(e) => handleFilterChange('role', e.target.value)}
            >
              {mockRoles.map(role => (
                <option key={role._id} value={role._id}>{role.name}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg p-1"
              value={filterGender}
              onChange={(e) => handleFilterChange('gender', e.target.value)}
            >
              {mockGenders.map(gender => (
                <option key={gender.value} value={gender.value}>{gender.label}</option>
              ))}
            </select>
            <select
              className="border border-gray-300 rounded-lg p-1"
              value={filterIsLocked}
              onChange={(e) => handleFilterChange('isLocked', e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="false">Bình thường</option>
              <option value="true">Đã khóa</option>
            </select>
            {(filterDepartment || filterRole || filterGender || filterIsLocked) && (
              <button onClick={handleResetFilters} className="text-red-500 hover:underline">Xóa bộ lọc</button>
            )}
          </div>
        )}

        {/* DataTable */}
        <div>
          <DataTable
            data={currentData}
            columns={userColumns}
            onRowView={handleViewUser}
            onRowEdit={handleEditUser}
            onRowDelete={handleDeleteUser}
            onRowToggleLock={handleToggleLock}
            onRowClick={handleViewUser}
            selectedItems={selectedUserIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
            lockingUserId={lockingUserId}
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap justify-between items-center mt-4 text-xs text-gray-600 gap-2">
          <span>{`${startIndex + 1} - ${Math.min(endIndex, users.length)} of ${users.length} người dùng`}</span>
          <div className="flex items-center space-x-2">
            <span>Hiển thị</span>
            <select
              className="border border-gray-300 rounded-lg p-1 text-xs"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
            <div className="flex space-x-1">
              <button
                className="p-1 border rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="h-4 w-4" />
              </button>
              <button
                className="p-1 border rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal xác nhận xóa */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        user={userToDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default UserListPage;