// Trang danh sách văn bản

import React, { useState, useEffect } from 'react';
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

import { useDocuments } from '../../hooks/useDocuments';

// Mock data for filter options
const mockDocumentTypes = [
    { value: '', label: 'Tất cả loại VB' },
    { value: 'Báo cáo', label: 'Báo cáo' },
    { value: 'Công văn', label: 'Công văn' },
    { value: 'Quyết định', label: 'Quyết định' },
    { value: 'Thông báo', label: 'Thông báo' },
    { value: 'Kế hoạch', label: 'Kế hoạch' },
];

const mockUrgencyLevels = [
    { value: '', label: 'Tất cả mức độ khẩn' },
    { value: 'Khẩn', label: 'Khẩn' },
    { value: 'Thường', label: 'Thường' },
    { value: 'Hỏa tốc', label: 'Hỏa tốc' },
];

const mockConfidentialityLevels = [
    { value: '', label: 'Tất cả mức độ bảo mật' },
    { value: 'Thường', label: 'Thường' },
    { value: 'Mật', label: 'Mật' },
    { value: 'Tối mật', label: 'Tối mật' },
];

const mockStatuses = [
    { value: '', label: 'Tất cả trạng thái' },
    { value: 'Tiếp nhận', label: 'Tiếp nhận' },
    { value: 'Đang xử lý', label: 'Đang xử lý' },
    { value: 'Phối hợp', label: 'Phối hợp' },
    { value: 'Nhận để biết', label: 'Nhận để biết' },
    { value: 'Hoàn thành', label: 'Hoàn thành' },
    { value: 'Đã xem', label: 'Đã xem' }, // Thêm trạng thái 'Đã xem' nếu có
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
  const { documents, loading, error, fetchDocuments } = useDocuments();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Tiếp nhận');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDocumentType, setFilterDocumentType] = useState('');
  const [filterUrgencyLevel, setFilterUrgencyLevel] = useState('');
  const [filterConfidentialityLevel, setFilterConfidentialityLevel] = useState('');

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Gắn filterStatus với activeTab
  useEffect(() => {
      setFilterStatus(activeTab === 'Tiếp nhận' ? '' : activeTab);
  }, [activeTab]);

  const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
          fetchDocuments(searchQuery, filterStatus, filterDocumentType, filterUrgencyLevel, filterConfidentialityLevel);
          setCurrentPage(1);
      }
  };

  useEffect(() => {
      const handler = setTimeout(() => {
          fetchDocuments(searchQuery, filterStatus, filterDocumentType, filterUrgencyLevel, filterConfidentialityLevel);
          setCurrentPage(1);
      }, 500);
      return () => clearTimeout(handler);
  }, [searchQuery, filterStatus, filterDocumentType, filterUrgencyLevel, filterConfidentialityLevel, fetchDocuments]);

  const handleResetSearch = () => {
      setSearchQuery('');
      // fetchDocuments('', filterStatus, filterDocumentType, filterUrgencyLevel, filterConfidentialityLevel); // Kích hoạt lại fetch qua useEffect
      setCurrentPage(1);
  };

  const handleFilterChange = (field, value) => {
      if (field === 'status') setFilterStatus(value);
      if (field === 'documentType') setFilterDocumentType(value);
      if (field === 'urgencyLevel') setFilterUrgencyLevel(value);
      if (field === 'confidentialityLevel') setFilterConfidentialityLevel(value);
  };

  const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
  };

  const handleResetFilters = () => {
      setFilterStatus('');
      setFilterDocumentType('');
      setFilterUrgencyLevel('');
      setFilterConfidentialityLevel('');
  };

  // Calculate total pages and data for the current page
  const totalPages = Math.ceil(documents.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = documents.slice(startIndex, endIndex);

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
    navigate(`/documents/detail/${document._id}`);
  };

  const handleEditDocument = (document) => {
    navigate(`/documents/edit/${document._id}`);
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
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              type="text"
              placeholder="Tìm kiếm theo tên văn bản đến, số văn bản đến,..."
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

        {showFilterPanel && (
          <div className="p-4 border border-gray-200 rounded-lg mb-2 flex flex-wrap items-center gap-4 text-xs">
              <span className="font-semibold text-gray-700">Bộ lọc:</span>
              <select
                  className="border border-gray-300 rounded-lg p-1"
                  value={filterDocumentType}
                  onChange={(e) => handleFilterChange('documentType', e.target.value)}
              >
                  {mockDocumentTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
              </select>
              <select
                  className="border border-gray-300 rounded-lg p-1"
                  value={filterUrgencyLevel}
                  onChange={(e) => handleFilterChange('urgencyLevel', e.target.value)}
              >
                  {mockUrgencyLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
              </select>
              <select
                  className="border border-gray-300 rounded-lg p-1"
                  value={filterConfidentialityLevel}
                  onChange={(e) => handleFilterChange('confidentialityLevel', e.target.value)}
              >
                  {mockConfidentialityLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
              </select>
              <select
                  className="border border-gray-300 rounded-lg p-1"
                  value={filterStatus}
                  onChange={(e) => {
                      handleFilterChange('status', e.target.value);
                      setActiveTab(e.target.value || 'Tiếp nhận');
                  }}
              >
                  {mockStatuses.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                  ))}
              </select>
              {(filterDocumentType || filterUrgencyLevel || filterConfidentialityLevel || filterStatus) && (
                  <button onClick={handleResetFilters} className="text-red-500 hover:underline">Xóa bộ lọc</button>
              )}
          </div>
      )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-2 overflow-x-auto whitespace-nowrap">
          {mockStatuses.filter(s => s.value !== '').map(tab => (
            <button
               key={tab.value}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-1 border-b-2 font-medium text-xs
                ${activeTab === tab.value
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
            >
              {tab.label}
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
          <span>{`${startIndex + 1} - ${Math.min(endIndex, currentData.length)} of ${currentData.length} Pages`}</span>
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