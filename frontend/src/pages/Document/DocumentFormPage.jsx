import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentFormPage = ({ initialData, isEditMode = false, onSave, onDelegateClick }) => {
    const navigate = useNavigate();

    const transferHistory = [
        {
            id: 1,
            nguoiNhan: 'Phạm Văn Long',
            hanXuLy: '2025-08-10',
            trangThai: 'Đang xử lý',
        },
        {
            id: 2,
            nguoiNhan: 'Lê Thị Mai',
            hanXuLy: '2025-08-08',
            trangThai: 'Đã hoàn thành',
        },
        {
            id: 3,
            nguoiNhan: 'Trần Minh Hùng',
            hanXuLy: '2025-08-07',
            trangThai: 'Đã từ chối',
        },
    ];

    // Hàm xử lý khi bấm nút "Chỉnh sửa"
    const handleEditClick = () => {
        console.log('Bấm nút "Chịnh sửa"');
        // if (initialData && initialData.id) {
        //     navigate(`/documents/edit`);
        // }
        navigate(`/documents/edit`);
    };

    const [attachedFiles, setAttachedFiles] = useState([
        'Siêu nhân GAO.docx',
        'Báo cáo quý.pdf',
    ]);
    
    const [hoveredFile, setHoveredFile] = useState(null);

    const [formData, setFormData] = useState(() => {
        // Kiểm tra nếu initialData tồn tại và có thuộc tính 'document'
        if (initialData && initialData.document) {
            return initialData.document; // Trả về đối tượng document bên trong
        }
        return initialData || {}; // Nếu không có lớp bọc, trả về initialData hoặc đối tượng rỗng
    });
    
    useEffect(() => {
        if (initialData) {
            // Kiểm tra lại lớp bọc khi initialData thay đổi
            if (initialData.document) {
                setFormData(initialData.document); // Cập nhật với đối tượng document đã bóc tách
            } else {
                setFormData(initialData); // Cập nhật với initialData nguyên bản
            }
        }
    }, [initialData]);


    const handleRemoveFile = (fileNameToRemove) => {
        if (isEditMode) {
            setAttachedFiles(attachedFiles.filter(fileName => fileName !== fileNameToRemove));
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveClick = () => {
        if (onSave) {
            onSave(formData);
        }
    };

    const handleCancelClick = () => {
        navigate('/documents/detail');
    }

    // Helper component để render trường input hoặc text
    const renderFormField = (label, name, type = 'text') => (
        <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {isEditMode ? (
                <input
                    type={type}
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
            ) : (
                <div className="mt-1 block w-full p-2 text-gray-800 bg-gray-50 border border-gray-200 rounded-md">
                    {formData[name] || ''}
                </div>
            )}
        </div>
    );

    // Thêm hàm xử lý Quay lại
    const handleGoBack = () => {
        navigate(-1);
    };

    console.log("formData", formData);  

    return (
        <div className="bg-gray-100 min-h-full">
            <div className="flex justify-between items-center">
                <div className="flex items-center ">
                    <button 
                        onClick={handleGoBack} 
                        className="px-2 rounded-full text-gray-700 hover:bg-gray-300 mb-2"
                        title="Quay lại"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>

                    <h1 className="text-lg font-semibold mb-2 text-gray-800">
                        {isEditMode ? "Chỉnh sửa văn bản đến" : "Chi tiết văn bản đến"}
                    </h1>
                </div>
                <div className="flex space-x-2">

                    {isEditMode && (
                        <button onClick={handleCancelClick}
                                className="h-8 flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                            Huỷ
                        </button>
                    )}
                    {!isEditMode && (
                        <button onClick={onDelegateClick}
                                className="h-8 flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                            Chuyển xử lý
                        </button>
                    )}

                    {isEditMode && (
                        <button 
                            onClick={handleSaveClick}
                            className="h-8 flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                        >
                            Lưu
                        </button>
                    )}
                    {!isEditMode && (
                        <button onClick={handleEditClick} 
                                className="h-8 flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-4">
                
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
                    {renderFormField('Số văn bản', 'documentNumber')}
                    {renderFormField('Sổ văn bản', 'documentBook')}
                    {renderFormField('Đơn vị gửi', 'sendingUnit')}
                    {renderFormField('Đơn vị nhận', 'recivingUnit')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
                    {renderFormField('Ngày nhận VB', 'recivedDate', 'date')}
                    {renderFormField('Ngày vào sổ', 'recordedDate', 'date')}
                    {renderFormField('Hạn trả lời', 'dueDate', 'date')}
                    {renderFormField('Trạng thái', 'status')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
                    {renderFormField('Phương thức nhận', 'receivingMethod')}
                    {renderFormField('Độ mật', 'confidentialityLevel')}
                    {renderFormField('Độ khẩn', 'urgencyLevel')}
                    {renderFormField('Người tạo', 'createdBy')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
                    {renderFormField('Loại VB', 'documentType')}
                    {renderFormField('Lĩnh vực', 'category')}
                    {renderFormField('Người ký', 'signer')}
                    {renderFormField('Người được giao', 'assignedUsers')}
                </div>
                
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Trích yếu</label>
                    {isEditMode ? (
                        <textarea
                            name="summary"
                            value={formData.summary || ''}
                            onChange={handleChange}
                            rows="4"
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    ) : (
                        <div className="mt-1 block w-full p-2 text-gray-800 bg-gray-50 border border-gray-200 rounded-md whitespace-pre-wrap">
                            {formData.summary || ''}
                        </div>
                    )}
                </div>

                <div className="mt-6 flex flex-row items-center space-x-4">
                    <div className="flex-1 overflow-x-auto">
                        <div className="flex flex-row space-x-2 w-max pb-2">
                            <label className="text-sm font-medium text-gray-700 self-center sticky left-0 z-10">Tệp đính kèm</label>
                            {isEditMode && (
                                <button className="sticky left-0 z-10 h-8 w-max flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                                    Đính kèm
                                </button>
                            )}
                            {attachedFiles.map((fileName, index) => (
                                <div 
                                    key={index}
                                    className="relative h-8 p-2 pr-8 border border-gray-300 bg-white rounded-full flex items-center transition-all duration-200"
                                    onMouseEnter={() => setHoveredFile(fileName)}
                                    onMouseLeave={() => setHoveredFile(null)}
                                >
                                    <span>{fileName}</span>

                                    {isEditMode && hoveredFile === fileName && (
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
                {/* --- Lịch sử chuyển giao --- */}
                {!isEditMode && (
                    <div className="mt-8">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Lịch sử chuyển giao</label>
                        <div className="overflow-x-auto shadow-md rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            STT
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tên người nhận
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Hạn xử lý
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái văn bản
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {transferHistory.map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {index + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.nguoiNhan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {item.hanXuLy}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    item.trangThai === 'Đã hoàn thành' ? 'bg-green-100 text-green-800' :
                                                    item.trangThai === 'Đang xử lý' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                    {item.trangThai}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* --- Hết Lịch sử chuyển giao --- */}
            </div>
        </div>
    );
};

export default DocumentFormPage;