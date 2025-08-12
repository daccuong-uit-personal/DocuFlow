import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  TrashIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

// Import component DataTable
import DataTable from "../../components/Table/DataTable";

import DocumentProcessPage from './DocumentProcessPage';

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
  { value: 'Bình thường', label: 'Bình thường' },
  { value: 'Mật', label: 'Mật' },
  { value: 'Tối mật', label: 'Tối mật' },
];

const mockStatuses = [
  // Trạng thái mặc định cho tất cả các văn bản
  { value: '', label: 'Tất cả trạng thái' },

  // Trạng thái khi văn bản mới được tạo, chờ gửi đi hoặc xử lý
  { value: 'Draft', label: 'Khởi tạo' },

  // Trạng thái khi văn bản đang chờ sự phê duyệt từ cấp trên
  { value: 'PendingApproval', label: 'Chờ duyệt' },

  // Trạng thái khi văn bản đã được duyệt và đang được xử lý bởi một hoặc nhiều người
  { value: 'Processing', label: 'Đang xử lý' },

  // Trạng thái khi văn bản đã được hoàn thành tất cả các bước trong quy trình
  { value: 'Completed', label: 'Hoàn thành' },

  // Trạng thái khi văn bản bị từ chối phê duyệt
  { value: 'Rejected', label: 'Bị từ chối' },

  // Trạng thái khi văn bản bị hủy bỏ trước khi hoàn thành
  { value: 'Canceled', label: 'Hủy' },

  // Trạng thái đặc thù cho các văn bản phối hợp giữa các đơn vị
  { value: 'Coordination', label: 'Phối hợp' },

  // Trạng thái đặc thù cho các văn bản chỉ cần nhận để đọc và không cần xử lý
  { value: 'ForInformation', label: 'Nhận để biết' },
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
  { key: 'lastReturnReason', header: 'Lý do trả lại', sortable: false, widthClass: 'min-w-[250px]' },
  { key: 'status', header: 'Trạng thái', sortable: true, widthClass: 'min-w-[200px]' },
  { key: 'action', header: 'Thao tác', sortable: false, widthClass: 'min-w-[120px] text-center', sticky: true },
];


const DocumentListPage = () => {
  const { documents, loading, error, fetchDocuments, deleteDocuments } = useDocuments();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDocumentType, setFilterDocumentType] = useState('');
  const [filterUrgencyLevel, setFilterUrgencyLevel] = useState('');
  const [filterConfidentialityLevel, setFilterConfidentialityLevel] = useState('');

  const [filterRecivedDateFrom, setFilterRecivedDateFrom] = useState('');
  const [filterRecivedDateTo, setFilterRecivedDateTo] = useState('');

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

  const handleOpenProcessModal = () => setIsProcessModalOpen(true);
  const handleCloseProcessModal = () => setIsProcessModalOpen(false);

  // ----------------------------------------------------
  // 👉 CÁC STATE MỚI ĐỂ QUẢN LÝ CHECKBOX
  const [selectedDocumentIds, setSelectedDocumentIds] = useState([]);
  // ----------------------------------------------------

  const handleCreateDocument = () => {
    navigate('/documents/create');
  };

  useEffect(() => {
    setFilterStatus(activeTab === 'Craft' ? '' : activeTab);
  }, [activeTab]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      fetchDocuments(searchQuery, filterStatus, filterDocumentType, filterUrgencyLevel, filterConfidentialityLevel);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDocuments(
        searchQuery,
        filterStatus,
        filterDocumentType,
        filterUrgencyLevel,
        filterConfidentialityLevel,
        filterRecivedDateFrom,
        filterRecivedDateTo
      );
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [
    searchQuery,
    filterStatus,
    filterDocumentType,
    filterUrgencyLevel,
    filterConfidentialityLevel,
    filterRecivedDateFrom,
    filterRecivedDateTo,
    fetchDocuments
  ]);
  const handleToggleFilterPanel = () => {
    setShowFilterPanel(prev => !prev);
  };

  const handleResetSearch = () => {
    setSearchQuery('');
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
    setFilterRecivedDateFrom('');
    setFilterRecivedDateTo('');
  };

  // Sắp xếp các văn bản theo recordedDate (Ngày ghi sổ) mới nhất đến cũ nhất
  const sortedDocuments = useMemo(() => {
    if (!documents) {
      return [];
    }
    // Tạo bản sao để không làm thay đổi mảng ban đầu
    const sorted = [...documents].sort((a, b) => {
      return new Date(b.recordedDate) - new Date(a.recordedDate);
    });
    return sorted;
  }, [documents]); 

  // Calculate total pages and data for the current page
  const totalPages = Math.ceil(sortedDocuments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedDocuments.slice(startIndex, endIndex);

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
    console.log('Bấm nút "Chi tiết"');
    navigate(`/documents/detail/${document._id}`);
  };

  const handleEditDocument = (document) => {
    console.log('Bấm nút "Chỉnh sửa"');
    navigate(`/documents/edit/${document._id}`);
  };

  // ----------------------------------------------------
  // 👉 HÀM XỬ LÝ XÓA MỘT ITEM DUY NHẤT
  const handleDeleteDocument = (document) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa văn bản không?`)) {
      deleteDocuments([document._id]);
      setSelectedDocumentIds([]);
      console.log('Xóa văn bản có ID:', document._id);
    } else {
      console.log('Hủy xóa.');
    }
  };
  // ----------------------------------------------------

  // ----------------------------------------------------
  // 👉 HÀM NHẬN SỰ THAY ĐỔI TỪ DATATABLE
  const handleSelectionChange = (ids) => {
    setSelectedDocumentIds(ids);
  };
  // ----------------------------------------------------

  // ----------------------------------------------------
  // 👉 CÁC HÀM MỚI ĐƯỢC THÊM VÀO ĐỂ TRUYỀN XUỐNG DATATABLE
  // Xử lý khi chọn/bỏ chọn tất cả các dòng
  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      const allIds = currentData.map(item => item._id);
      setSelectedDocumentIds(allIds);
    } else {
      setSelectedDocumentIds([]);
    }
  };

  // Xử lý khi chọn/bỏ chọn một dòng
  const handleSelectOne = (e, id) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSelectedDocumentIds(prevSelected => [...prevSelected, id]);
    } else {
      setSelectedDocumentIds(prevSelected => prevSelected.filter(itemId => itemId !== id));
    }
  };
  // ----------------------------------------------------


  // ----------------------------------------------------
  // HÀM XỬ LÝ KHI NHẤN NÚT CHUYỂN
  const handleTransferDocuments = () => {
    if (selectedDocumentIds.length > 0) {
      handleOpenProcessModal();
      console.log('Chuyển các văn bản có IDs:', selectedDocumentIds);
    } else {
      console.log('Không có văn bản nào được chọn để chuyển.');
    }
  };
  // ----------------------------------------------------

  const handleDeleteSelectedDocuments = () => {
    if (selectedDocumentIds.length > 0) {
      if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedDocumentIds.length} văn bản không?`)) {
        deleteDocuments(selectedDocumentIds);
        setSelectedDocumentIds([]);
        console.log('Xóa các văn bản có IDs:', selectedDocumentIds);
      }
    } else {
      console.log('Không có văn bản nào được chọn để xóa.');
    }
  };

  return (
    <div className="bg-gray-100 min-h-full font-sans">
      <h1 className="text-lg font-semibold mb-2 text-gray-800">Danh sách văn bản</h1>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-md p-4">

        {/* Search, Filter, Export, New Order */}
        <div className="flex flex-wrap justify-between items-center mb-0 gap-2">
          <div className="relative w-full sm:w-80 text-xs">
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
            <div className="flex items-center gap-2 text-xs">
              {/* Nhóm input "Ngày nhận từ" */}
              <div className="h-8 relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <span className="bg-gray-100 text-gray-500 px-2 py-2 h-full flex items-center">
                  Ngày nhận từ:
                </span>
                <input
                  type="date"
                  value={filterRecivedDateFrom}
                  onChange={(e) => setFilterRecivedDateFrom(e.target.value)}
                  className="pl-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Nhóm input "đến" */}
              <div className=" h-8 relative flex items-center border border-gray-300 rounded-lg overflow-hidden">
                <span className="bg-gray-100 text-gray-500 px-2 py-2 h-full flex items-center">
                  đến:
                </span>
                <input
                  type="date"
                  value={filterRecivedDateTo}
                  onChange={(e) => setFilterRecivedDateTo(e.target.value)}
                  className="pl-2 py-1 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={handleToggleFilterPanel}
              className="h-8 flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Lọc
            </button>

            {selectedDocumentIds.length > 0 ? (
              <>
                <button
                  onClick={handleDeleteSelectedDocuments}
                  className="h-8 flex items-center px-1  py-2 text-xs font-medium text-red-600 bg-white border border-red-600 rounded-lg shadow-sm hover:bg-red-50">
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Xóa ({selectedDocumentIds.length})
                </button>
                <button
                  onClick={handleTransferDocuments}
                  className="h-8 flex items-center px-1 py-2 text-xs font-medium text-green-600 bg-white border border-green-600 rounded-lg shadow-sm hover:bg-green-50">
                  <ArrowRightCircleIcon className="h-5 w-5 mr-2" />
                  Chuyển ({selectedDocumentIds.length})
                </button>
              </>
            ) : (
              // RENDER NÚT THÊM KHI KHÔNG CÓ GÌ ĐƯỢC CHỌN
              <button
                onClick={handleCreateDocument}
                className="h-8 flex items-center px-1 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
                <PlusIcon className="h-5 w-5 mr-2" />
                Thêm văn bản đến
              </button>
            )}
          </div>
        </div>

        {/* ✨ Panel lọc nâng cao */}
        {showFilterPanel && (
          <div className="p-4 mb-0 flex flex-wrap items-center gap-4 text-xs">
            <span className="font-semibold text-gray-700">Bộ lọc:</span>
            <select
              className="border border-gray-300 rounded-lg p-1"
              value={filterDocumentType}
              onChange={(e) => handleFilterChange('documentType', e.target.value)}
            >
              {mockDocumentTypes.map(type => (<option key={type.value} value={type.value}>{type.label}</option>))}
            </select>
            <select
              className="border border-gray-300 rounded-lg p-1"
              value={filterUrgencyLevel}
              onChange={(e) => handleFilterChange('urgencyLevel', e.target.value)}
            >
              {mockUrgencyLevels.map(level => (<option key={level.value} value={level.value}>{level.label}</option>))}
            </select>
            <select
              className="border border-gray-300 rounded-lg p-1"
              value={filterConfidentialityLevel}
              onChange={(e) => handleFilterChange('confidentialityLevel', e.target.value)}
            >
              {mockConfidentialityLevels.map(level => (<option key={level.value} value={level.value}>{level.label}</option>))}
            </select>

            {(filterDocumentType || filterUrgencyLevel || filterConfidentialityLevel || filterRecivedDateFrom || filterRecivedDateTo) && (
              <button onClick={handleResetFilters} className="text-red-500 hover:underline">Xóa bộ lọc</button>
            )}
            <button onClick={() => setShowFilterPanel(false)} className="text-gray-500 hover:text-gray-800">
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-2 overflow-x-auto whitespace-nowrap">
          {mockStatuses.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
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
            onRowClick={handleViewDocument}
            selectedItems={selectedDocumentIds}
            onSelectAll={handleSelectAll}
            onSelectOne={handleSelectOne}
          />
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap justify-between items-center mt-4 text-xs text-gray-600 gap-2">
          <span>{`${startIndex + 1} - ${Math.min(endIndex, currentData.length)} of ${currentData.length} Trang`}</span>
          <div className="flex items-center space-x-2">
            <span>Số dòng hiển thị</span>
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
        <DocumentProcessPage
          isOpen={isProcessModalOpen}
          onClose={handleCloseProcessModal}
          documentIds={selectedDocumentIds}
          mode={'delegate'}
        />
      </div>
    </div>
  );
};

export default DocumentListPage;
