// Bảng hiển thị dữ liệu (danh sách người dùng, văn bản)

import React, { useState } from 'react';
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';

const DataTable = ({ data, columns }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig.key) {
      return 0;
    }
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig.key) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  // Hàm xử lý khi nhấn vào các nút hành động
  const handleView = (item) => {
    console.log('Xem:', item);
  };

  const handleEdit = (item) => {
    console.log('Sửa:', item);
  };

  const handleDelete = (item) => {
    console.log('Xóa:', item);
  };

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
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-10 px-4 py-3 text-left">
              <input type="checkbox" className="form-checkbox rounded text-blue-500" />
            </th>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && requestSort(column.key)}
                className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer ${
                  column.key === 'action' ? 'text-center' : ''
                }`}
              >
                <div className="flex items-center">
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
                <td key={column.key} className="px-4 py-3 text-xs text-gray-900">
                  {column.key === 'product' ? (
                    <div className="flex items-center">
                      <img src={item.image} alt={item.name} className="h-10 w-10 rounded-md mr-3 object-cover" />
                      <div>
                        <div className="text-gray-900 font-medium">{item.id}</div>
                        <div className="text-gray-500">{item.name}</div>
                      </div>
                    </div>
                  ) : column.key === 'payment' || column.key === 'status' ? (
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(
                        item[column.key]
                      )}`}
                    >
                      {item[column.key]}
                    </span>
                  ) : column.key === 'action' ? (
                    <div className="flex items-center justify-center space-x-2">
                      <button onClick={() => handleView(item)} className="text-blue-500 hover:text-blue-700">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleEdit(item)} className="text-gray-500 hover:text-gray-700">
                        <PencilSquareIcon className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(item)} className="text-red-500 hover:text-red-700">
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    item[column.key]
                  )}
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