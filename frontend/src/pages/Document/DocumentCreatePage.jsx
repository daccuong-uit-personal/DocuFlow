// Trang tạo mới văn bản

import React, { useState } from 'react';

const DocumentCreatePage = () => {
    // State để quản lý danh sách các tệp đính kèm
    const [attachedFiles, setAttachedFiles] = useState([
        'Siêu nhân GAO.docx',
        'Báo cáo quý.pdf',
    ]);
    
    // State để theo dõi tệp nào đang được hover
    const [hoveredFile, setHoveredFile] = useState(null);

    // Hàm xử lý khi xóa tệp
    const handleRemoveFile = (fileNameToRemove) => {
        setAttachedFiles(attachedFiles.filter(fileName => fileName !== fileNameToRemove));
    };


  return (
    <div className=" bg-gray-100 min-h-full">
      
      {/* Header và Breadcrumb */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold mb-2 text-gray-800">Tạo văn bản đến</h1>
        </div>
        <div className="flex space-x-2">
          <button className="h-8 flex items-center px-4 py-2 mb-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            Chuyển xử lý
          </button>
          <button className="h-8 flex items-center px-8 py-2 mb-1 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
            Lưu
          </button>
        </div>
      </div>

      {/* Form chính */}
      <div className="bg-white rounded-xl shadow-md p-4">
        
        {/* Hàng 1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số văn bản</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số văn bản</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị gửi</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Đơn vị nhận</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>

        {/* Hàng 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày VB</label>
            <input 
              type="date" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày nhận VB</label>
            <input 
              type="date" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày vào sổ</label>
            <input 
              type="date" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Hạn trả lời</label>
            <input 
              type="date" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>

        {/* Hàng 3 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Số phụ</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức nhận</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Độ mật</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Độ khẩn</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>

        {/* Hàng 4 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Loại VB</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Lĩnh vực</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Người ký</label>
            <input 
              type="text" 
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>
        
        {/* Hàng Trích yếu */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Trích yếu</label>
          <textarea 
            rows="4" 
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        {/* Hàng Tệp đính kèm */}
        <div className="mt-6 flex flex-row items-center space-x-4">
          {/* Container giới hạn chiều rộng và cho scroll ngang */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex flex-row space-x-2 w-max pb-2">
              <label className="text-sm font-medium text-gray-700 self-center sticky left-0 z-10">Tệp đính kèm</label>
              <button className="sticky left-0 z-10 h-8 w-max flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                Đính kèm
              </button>
              {attachedFiles.map((fileName, index) => (
                <div 
                  key={index}
                  className="relative h-8 p-2 pr-8 border border-gray-300 bg-white rounded-full flex items-center transition-all duration-200"
                  onMouseEnter={() => setHoveredFile(fileName)}
                  onMouseLeave={() => setHoveredFile(null)}
                >
                  <span>{fileName}</span>

                  {hoveredFile === fileName && (
                    <button 
                      onClick={() => handleRemoveFile(fileName)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-1 w-6 h-6 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-200"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCreatePage;