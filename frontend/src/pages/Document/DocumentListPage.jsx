// Trang danh sách văn bản

import React from "react";
import { PlusIcon, AdjustmentsHorizontalIcon, ArrowDownTrayIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// Import component DataTable
import DataTable from "../../components/Table/DataTable"; 

// Dữ liệu mẫu (sample data)
const ordersData = [
  {
    id: '021231',
    name: 'Kanky Kitadakate (Green)',
    image: 'https://via.placeholder.com/40/0000FF/FFFFFF?text=P1', // Placeholder image
    customer: 'Leslie Alexander',
    price: '$21.78',
    date: '04/17/23',
    payment: 'Paid',
    status: 'Hoàn thành',
  },
  {
    id: '021231',
    name: 'Story Honzo (Cream)',
    image: 'https://via.placeholder.com/40/FF0000/FFFFFF?text=P2', // Placeholder image
    customer: 'Leslie Alexander',
    price: '$21.78',
    date: '04/17/23',
    payment: 'Unpaid',
    status: 'Cancelled',
  },
  {
    id: '021231',
    name: 'Kanky Kitadakate (Green)',
    image: 'https://via.placeholder.com/40/FFFF00/000000?text=P3', // Placeholder image
    customer: 'Leslie Alexander',
    price: '$21.78',
    date: '04/17/23',
    payment: 'Paid',
    status: 'Hoàn thành',
  },
  {
    id: '021231',
    name: 'Story Honzo (Cream)',
    image: 'https://via.placeholder.com/40/008000/FFFFFF?text=P4', // Placeholder image
    customer: 'Leslie Alexander',
    price: '$21.78',
    date: '04/17/23',
    payment: 'Unpaid',
    status: 'Cancelled',
  },
  {
    id: '021231',
    name: 'Kanky Kitadakate (Green)',
    image: 'https://via.placeholder.com/40/4B0082/FFFFFF?text=P5', // Placeholder image
    customer: 'Leslie Alexander',
    price: '$21.78',
    date: '04/17/23',
    payment: 'Paid',
    status: 'Hoàn thành',
  },
  // Thêm các mục dữ liệu khác ở đây
];

// Định nghĩa các cột
const ordersColumns = [
  { header: 'Số văn bản', key: 'documentNumber', sortable: true },
  { header: 'Customer', key: 'customer', sortable: true },
  { header: 'Price', key: 'price', sortable: true },
  { header: 'Date', key: 'date', sortable: true },
  { header: 'Payment', key: 'payment', sortable: true },
  { header: 'Status', key: 'status', sortable: true },
  { header: 'Action', key: 'action', sortable: false },
];

const DocumentListPage = () => {
  return (
    <div className="p-0 bg-gray-100">
      <h1 className="text-lg font-semibold mb-0">Documents List</h1>
      
      {/* Breadcrumbs */}
      <nav className="flex text-gray-500 mb-4 text-xs" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <a href="#" className="text-gray-700 hover:text-blue-600">Documents</a>
          </li>
          <li className="inline-flex items-center">
            <svg className="w-3 h-3 text-gray-400 mx-1" fill="currentColor" viewBox="0 0 20 20"><path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path></svg>
            <a href="#" className="text-gray-700 hover:text-blue-600">Documents List</a>
          </li>
        </ol>
      </nav>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-md p-4">
        
        {/* Search, Filter, Export, New Order */}
        <div className="flex justify-between items-center mb-3">
          <div className="relative w-96 text-xs">
            <input
              type="text"
              placeholder="Search for Iid, name product"
              className="w-full h-8 pl-10 pr-4 py-2 border rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>

          <div className="flex space-x-3 h-8">
            <button className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
            <button className="flex items-center px-4 py-2 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-lg shadow-sm hover:bg-blue-700">
              <PlusIcon className="h-5 w-5 mr-2" />
              New Order
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-2">
          <button className="px-6 py-1 border-b-2 border-blue-600 text-blue-600 font-medium text-xs">
            Tiếp nhận
          </button>
          <button className="px-6 py-1 border-b-2 border-transparent text-gray-500 font-medium text-xs hover:text-gray-700 hover:border-gray-300">
            Đang xử lý
          </button>
          <button className="px-6 py-1 border-b-2 border-transparent text-gray-500 font-medium text-xs hover:text-gray-700 hover:border-gray-300">
            Phối hợp
          </button>          
          <button className="px-6 py-1 border-b-2 border-transparent text-gray-500 font-medium text-xs hover:text-gray-700 hover:border-gray-300">
            Nhận để biết
          </button>
          <button className="px-6 py-1 border-b-2 border-transparent text-gray-500 font-medium text-xs hover:text-gray-700 hover:border-gray-300">
            Hoàn thành
          </button>
        </div>

        {/* Sử dụng component DataTable */}
        <DataTable data={ordersData} columns={ordersColumns} />

        {/* Pagination */}
        <div className="flex justify-between items-center mt-4 text-xs text-gray-600">
          <span>1 - 10 of 13 Pages</span>
          <div className="flex items-center space-x-2">
            <span>The page on</span>
            <select className="border border-gray-300 rounded-lg p-1 text-xs">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentListPage;