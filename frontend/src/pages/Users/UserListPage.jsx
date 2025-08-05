// Trang danh sách người dùng

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

// Import component DataTable
import DataTable from "../../components/Table/DataTable";

// Mock data và cấu hình cột cho người dùng
const usersData = [
  {
    userName: 'john.doe',
    name: 'John Doe',
    gender: 'Male',
    phoneNumber: '0987654321',
    dayOfBirth: '1990-01-15',
    departmentID: 'IT Department',
    role: 'Admin',
    isLocked: false
  },
  {
    userName: 'jane.smith',
    name: 'Jane Smith',
    gender: 'Female',
    phoneNumber: '0123456789',
    dayOfBirth: '1992-05-20',
    departmentID: 'HR Department',
    role: 'User',
    isLocked: true
  },
  {
    userName: 'peter.jones',
    name: 'Peter Jones',
    gender: 'Male',
    phoneNumber: '0912345678',
    dayOfBirth: '1988-11-01',
    departmentID: 'Marketing Department',
    role: 'User',
    isLocked: false
  },
];

const userColumns = [
  { key: 'userName', header: 'Tên người dùng', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'name', header: 'Tên đầy đủ', sortable: true, widthClass: 'min-w-[300px]' },
  { key: 'gender', header: 'Giới tính', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'phoneNumber', header: 'Số điện thoại', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'dayOfBirth', header: 'Ngày sinh', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'departmentID', header: 'Phòng ban', sortable: true, widthClass: 'min-w-[300px]' },
  { key: 'role', header: 'Vai trò', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'isLocked', header: 'Trạng thái', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'action', header: 'Thao tác', sortable: false, widthClass: 'min-w-[120px] text-center', sticky: true },
];

const UserListPage = () => {
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate total pages and data for the current page
  const totalPages = Math.ceil(usersData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = usersData.slice(startIndex, endIndex);

  // Event handlers for pagination
  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
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
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="relative w-full sm:w-96 text-xs">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên người dùng, tên đầy đủ,..."
              className="w-full h-8 pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex flex-wrap space-x-3 h-8">
            <button className="h-8 flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Lọc
            </button>
            <button className="h-8 flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Xuất file
            </button>
            <button className="h-8 flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm người dùng
            </button>
          </div>
        </div>
        
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
          <span>{`${startIndex + 1} - ${Math.min(endIndex, usersData.length)} of ${usersData.length} người dùng`}</span>
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