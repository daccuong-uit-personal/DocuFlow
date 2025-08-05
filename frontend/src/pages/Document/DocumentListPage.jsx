// Trang danh sách văn bản

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

// Mock data and column configuration for demonstration purposes
const ordersData = [
  { documentNumber: '#12345', documentBook: 'VB đến 2023', sendingUnit: 'Sở Kế hoạch và Đầu tư', recivingUnit: 'Văn phòng UBND Tỉnh', recivedDate: '2023-10-26', recordedDate: '2023-10-26', dueDate: '2023-11-05', receivingMethod: 'Bưu điện', urgencyLevel: 'Khẩn', confidentialityLevel: 'Thường', documentType: 'Báo cáo', category: 'Hành chính', signer: 'Nguyễn Văn A', summary: 'Báo cáo tình hình kinh tế - xã hội quý III năm 2023', status: 'Đang xử lý' },
  { documentNumber: '#12346', documentBook: 'VB đến 2023', sendingUnit: 'Sở Tài chính', recivingUnit: 'Văn phòng UBND Tỉnh', recivedDate: '2023-10-25', recordedDate: '2023-10-25', dueDate: '2023-11-01', receivingMethod: 'Trực tiếp', urgencyLevel: 'Thường', confidentialityLevel: 'Mật', documentType: 'Công văn', category: 'Tài chính', signer: 'Trần Thị B', summary: 'Công văn về việc đề xuất dự toán ngân sách năm 2024', status: 'Hoàn thành' },
  { documentNumber: '#12347', documentBook: 'VB đến 2023', sendingUnit: 'Sở Giao thông Vận tải', recivingUnit: 'Văn phòng UBND Tỉnh', recivedDate: '2023-10-24', recordedDate: '2023-10-24', dueDate: '2023-10-30', receivingMethod: 'Fax', urgencyLevel: 'Hỏa tốc', confidentialityLevel: 'Tối mật', documentType: 'Quyết định', category: 'Xây dựng', signer: 'Lê Văn C', summary: 'Quyết định phê duyệt dự án xây dựng cầu vượt', status: 'Đang xử lý' },
  { documentNumber: '#12347', documentBook: 'VB đến 2023', sendingUnit: 'Sở Giao thông Vận tải', recivingUnit: 'Văn phòng UBND Tỉnh', recivedDate: '2023-10-24', recordedDate: '2023-10-24', dueDate: '2023-10-30', receivingMethod: 'Fax', urgencyLevel: 'Hỏa tốc', confidentialityLevel: 'Tối mật', documentType: 'Quyết định', category: 'Xây dựng', signer: 'Lê Văn C', summary: 'Quyết định phê duyệt dự án xây dựng cầu vượt', status: 'Đang xử lý' },
];

const ordersColumns = [
  { key: 'documentNumber', header: 'Số VB', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'documentBook', header: 'Sổ VB', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'sendingUnit', header: 'Đơn vị gửi', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'recivingUnit', header: 'Đơn vị nhận', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'recivedDate', header: 'Ngày nhận', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'recordedDate', header: 'Ngày ghi sổ', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'dueDate', header: 'Hạn xử lý', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'receivingMethod', header: 'Cách nhận', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'urgencyLevel', header: 'Mức độ khẩn', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'confidentialityLevel', header: 'Mức độ bảo mật', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'documentType', header: 'Loại VB', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'category', header: 'Lĩnh vực', sortable: true, widthClass: 'min-w-[250px]' },
  { key: 'signer', header: 'Người ký', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'summary', header: 'Trích yếu', sortable: true, widthClass: 'min-w-[350px]' },
  { key: 'status', header: 'Trạng thái', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'action', header: 'Thao tác', sortable: false, widthClass: 'min-w-[120px] text-center', sticky: true },
];

const DocumentListPage = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Tiếp nhận');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calculate total pages and data for the current page
  const totalPages = Math.ceil(ordersData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = ordersData.slice(startIndex, endIndex);

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

  const handleViewDocument = (document) => {
    navigate(`/documents/detail`);
  };

  const handleEditDocument = (document) => {
    navigate(`/documents/edit`);
  };
  
  const handleDeleteDocument = (document) => {
    // Logic xóa văn bản
    console.log('Xóa văn bản:', document.id);
  };

  return (
    <div className="bg-gray-100 min-h-full font-sans">
      <h1 className="text-lg font-semibold mb-2 text-gray-800">Danh sách văn bản</h1>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-md p-4">

        {/* Search, Filter, Export, New Order */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="relative w-full sm:w-96 text-xs">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên văn bản đến, số văn bản đến,..."
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
            <button className="h-8 flex items-center px-4 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
              <PlusIcon className="h-5 w-5 mr-2" />
              Thêm văn bản đến
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-2 overflow-x-auto whitespace-nowrap">
          {['Tiếp nhận', 'Đang xử lý', 'Phối hợp', 'Nhận để biết', 'Hoàn thành'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-1 border-b-2 font-medium text-xs
                ${activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Sử dụng component DataTable */}
        <div>
          <DataTable 
            data={currentData} 
            columns={ordersColumns}
            onRowView={handleViewDocument}
            onRowEdit={handleEditDocument}
            onRowDelete={handleDeleteDocument}
          />

        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap justify-between items-center mt-4 text-xs text-gray-600 gap-2">
          <span>{`${startIndex + 1} - ${Math.min(endIndex, ordersData.length)} of ${ordersData.length} Pages`}</span>
          <div className="flex items-center space-x-2">
            <span>The page on</span>
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

export default DocumentListPage;