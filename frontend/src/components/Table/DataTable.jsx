import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

// Reusable DataTable component
const DataTable = ({ data, columns, onRowView, onRowEdit, onRowDelete }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const navigate = useNavigate();

  // Sorting logic for the table data
    const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];
    
    // Xử lý sắp xếp ngày tháng
    if (aValue instanceof Date && bValue instanceof Date) {
      aValue = aValue.getTime();
      bValue = bValue.getTime();
    }
    
    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  

  // Function to request a new sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Function to get the sort direction class for icons
  const getClassNamesFor = (name) => {
    if (!sortConfig.key) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Action handlers
  const handleView = (item) => {
    console.log('Xem:', item);
    navigate(`/documents/detail`);
    // Add your logic to view the item here
  };

  const handleEdit = (item) => {
    console.log('Sửa:', item);
    navigate(`/documents/edit`);
    // Add your logic to edit the item here
  };

  const handleDelete = (item) => {
    console.log('Xóa:', item);
    // Add your logic to delete the item here
  };

  // Helper function to get status-specific CSS classes
  const getStatusClasses = (status) => {
    switch (status) {
      case 'Đang xử lý':
        return 'bg-green-100 text-green-800';
      case 'Unpaid':
        return 'bg-yellow-100 text-yellow-800';
      case 'Hoàn thành':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return '';
    }
  };

  const formatDate = (date) => {
    if (date instanceof Date) {
      return date.toLocaleDateString('vi-VN');
    }
    return date;
  };

  return (
    <div className="overflow-x-auto overflow-y-auto h-[60vh] rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-[40px] px-4 py-1 text-left">
              <input type="checkbox" className="form-checkbox rounded text-blue-500" />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && requestSort(column.key)}
                className={`
                  px-4 py-0 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider
                  ${column.sortable ? 'cursor-pointer' : ''}
                  ${column.widthClass}
                  ${column.key === 'summary' ? 'min-w-[350px]' : 'min-w-[150px]'}
                  ${column.key === 'action' ? 'min-w-[120px] text-center ' : 'text-center'}
                  ${column.sticky ? 'sticky right-0 bg-gray-50 z-10' : ''}
                `}
              >
                <div className="flex items-center ">
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="ml-2">
                      {getClassNamesFor(column.key) === 'asc' && <ArrowUpIcon className="h-3 w-3 text-gray-500" />}
                      {getClassNamesFor(column.key) === 'desc' && <ArrowDownIcon className="h-3 w-3 text-gray-500" />}
                      {sortConfig.key !== column.key && <ArrowUpIcon className="h-3 w-3 text-gray-300" />}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedData.map((item, index) => (
            <tr key={index}>
              <td className="px-4 py-3 whitespace-nowrap">
                <input type="checkbox" className="form-checkbox rounded text-blue-500" />
              </td>
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 text-xs text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis 
                                    ${column.widthClass}
                                    ${column.sticky ? 'sticky right-0 bg-white z-10' : ''}`}>
                  <div className="h-[40px] overflow-y-auto">
                    {column.key === 'action' ? (
                      <div className="flex items-center justify-center space-x-2">
                        {onRowView && (
                          <button onClick={() => onRowView(item)} className="text-blue-500 hover:text-blue-700">
                            <EyeIcon className="h-5 w-5" />
                          </button>
                        )}
                        {onRowEdit && (
                          <button onClick={() => onRowEdit(item)} className="text-gray-500 hover:text-gray-700">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                        )}
                        {onRowDelete && (
                          <button onClick={() => onRowDelete(item)} className="text-red-500 hover:text-red-700">
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    ) : (column.key === 'status') ? (
                      <span
                        className={`px-3 py-0 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                          item[column.key]
                        )}`}
                      >
                        {item[column.key]}
                      </span>
                    ) : (column.key === 'recivedDate' || column.key === 'recordedDate' || column.key === 'dueDate') ? (
                      formatDate(item[column.key])
                    ) : (
                      item[column.key]
                    )}
                    </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;