import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  PencilSquareIcon,
  TrashIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { LockClosedIcon, LockOpenIcon } from '@heroicons/react/24/solid';
import { formatDate } from '../../utils/helper';

// Reusable DataTable component
const DataTable = ({ data, columns, onRowView, onRowEdit, onRowDelete, onRowClick, selectedItems, onSelectOne, onSelectAll, onRowToggleLock, lockingUserId 
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const navigate = useNavigate();

  const selectAllCheckboxRef = useRef(null);

  useEffect(() => {
    if (selectAllCheckboxRef.current) {
      const isIndeterminate = selectedItems.length > 0 && selectedItems.length < data.length;
      selectAllCheckboxRef.current.indeterminate = isIndeterminate;
    }
  }, [selectedItems, data.length]);

  // Xử lý sắp xếp ngày tháng
  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) return 0;

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

  return (
    <div className="overflow-x-auto overflow-y-auto h-[60vh] rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 table-fixed">
        <thead className="bg-gray-50">
          <tr>
            <th className="sticky left-0 bg-white z-20 px-4 py-2 text-left">
              <input
                type="checkbox"
                className="form-checkbox rounded text-blue-500 w-3 h-3"
                ref={selectAllCheckboxRef}
                onClick={(e) => e.stopPropagation()}
                onChange={onSelectAll}
                checked={selectedItems.length === data.length && data.length > 0}
              />
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
            <tr key={index}
              onClick={() => onRowClick && onRowClick(item)}
              className='cursor-pointer hover:bg-gray-100'>
              <td className="sticky left-0 z-20 bg-white/70 px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="form-checkbox rounded text-blue-500  w-3 h-3" checked={selectedItems.includes(item._id)} onChange={(e) => onSelectOne(e, item._id)} />
              </td>
              {columns.map((column) => (
                <td key={column.key} className={`px-4 py-3 text-xs text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis 
                  ${column.widthClass}
                  ${column.sticky ? 'sticky right-0 bg-white z-10' : ''}`}>
                  <div className="h-[40px] overflow-y-auto">
                    {column.key === 'action' ? (
                      <div className="flex items-center justify-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        {onRowEdit && (
                          <button onClick={() => onRowEdit(item)} className="text-gray-500 hover:text-gray-700">
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                        )}
                        {onRowToggleLock && (
                          <button 
                            onClick={() => onRowToggleLock(item)} 
                            className={`${item.isLocked ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'} ${lockingUserId === item._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={lockingUserId === item._id || item.role?.name === 'admin'}
                            title={item.role?.name === 'admin' ? 'Không thể khóa tài khoản admin' : (item.isLocked ? 'Mở khóa tài khoản' : 'Khóa tài khoản')}
                          >
                            {lockingUserId === item._id ? (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                            ) : item.isLocked ? (
                              <LockClosedIcon className="h-5 w-5" />
                            ) : (
                              <LockOpenIcon className="h-5 w-5" />
                            )}
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
                    ) : (column.key === 'isLocked') ? (
                      <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                        item[column.key] ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item[column.key] ? 'Đã khóa' : 'Bình thường'}
                      </span>
                    ) : (column.key === 'recivedDate' || column.key === 'recordedDate' || column.key === 'dueDate') ? (
                      formatDate(item[column.key])
                    ) : (column.key === 'dayOfBirth') ? (
                      formatDate(item[column.key])
                    ) : (column.key === 'departmentID' || column.key === 'role') ? (
                      column.render ? column.render(item[column.key]) : item[column.key]?.name
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