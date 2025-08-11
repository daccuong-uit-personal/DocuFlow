import React, { useState, useEffect } from 'react';
import { XMarkIcon, EyeIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

// Component này nhận attachments và isEditMode từ props
const AttachmentsList = ({ attachments, isEditMode, onRemoveFile }) => {
    // State để quản lý danh sách file, cho phép chỉnh sửa
    const [attachedFiles, setAttachedFiles] = useState(attachments || []);
    const [hoveredFile, setHoveredFile] = useState(null);

    // Sử dụng useEffect để khởi tạo state khi prop attachments thay đổi
    useEffect(() => {
        setAttachedFiles(attachments || []);
    }, [attachments]);

    // Hàm tiện ích để trích xuất tên file từ URL
    const extractFileName = (url) => {
        try {
            const urlObject = new URL(url);
            // Lấy phần cuối cùng của path
            const pathSegments = urlObject.pathname.split('/');
            return pathSegments[pathSegments.length - 1];
        } catch (e) {
            // Trường hợp không phải URL hợp lệ, trả về nguyên giá trị
            return url;
        }
    };
    
    // Hàm xử lý việc xóa file
    const handleRemoveFile = (fileToRemove) => {
        const updatedFiles = attachedFiles.filter(fileName => fileName !== fileToRemove);
        setAttachedFiles(updatedFiles);
        // Nếu có hàm callback onRemoveFile, gọi nó để thông báo ra ngoài
        if (onRemoveFile) {
            onRemoveFile(fileToRemove);
        }
    };
    
    const getAbsoluteUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        // Mặc định backend phục vụ tĩnh tại /uploads
        const base = 'http://localhost:8000/';
        return url.startsWith('uploads') ? base + url : base + 'uploads/documents/' + url;
    };

    const handlePreview = (url) => {
        const absolute = getAbsoluteUrl(url);
        window.open(absolute, '_blank', 'noopener,noreferrer');
    };

    const handleDownload = (url) => {
        const absolute = getAbsoluteUrl(url);
        const link = document.createElement('a');
        link.href = absolute;
        link.download = extractFileName(absolute);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {attachedFiles.map((fileUrl, index) => (
                <div
                    key={index}
                    className="relative h-8 p-2 border border-gray-300 bg-white rounded-full flex items-center transition-all duration-200"
                    onMouseEnter={() => setHoveredFile(fileUrl)}
                    onMouseLeave={() => setHoveredFile(null)}
                >
                    <span className="text-xs mr-2">{extractFileName(fileUrl)}</span>
                    <button
                        type="button"
                        onClick={() => handlePreview(fileUrl)}
                        title="Xem trước"
                        className="text-blue-600 hover:text-blue-800 mr-1"
                    >
                        <EyeIcon className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        onClick={() => handleDownload(fileUrl)}
                        title="Tải xuống"
                        className="text-gray-700 hover:text-gray-900 mr-4"
                    >
                        <ArrowDownTrayIcon className="h-4 w-4" />
                    </button>

                    {isEditMode && hoveredFile === fileUrl && (
                        <button
                            onClick={() => handleRemoveFile(fileUrl)}
                            className="absolute right-0 top-1/2 transform -translate-y-1/2 -mr-1 w-6 h-6 rounded-full flex items-center justify-center text-red-500 hover:bg-gray-200"
                        >
                            <XMarkIcon className="h-4 w-4" />
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AttachmentsList;