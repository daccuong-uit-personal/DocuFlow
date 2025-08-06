// Trang danh sách người dùng

import React, { use, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

// Import component DataTable
import DataTable from "../../components/Table/DataTable";

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

  const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            fetchUsers(searchQuery, filterDepartment, filterRole, filterGender, filterIsLocked);
            setCurrentPage(1);
        }
    };
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers( searchQuery, filterDepartment, filterRole, filterGender, filterIsLocked);
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
      // fetchUsers('', '', '', '', '');
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
    navigate(`/users/detail`);
  };

  const handleEditUser = (user) => {
    navigate(`/users/edit`);
  };
  
  const handleDeleteUser = (user) => {
    // Logic xóa người dùng
    console.log('Xóa người dùng:', user.id);
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
            <button className="h-8 flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm người dùng
            </button>
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
    </div>
  );
};

export default UserListPage;