import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { useNavigate } from 'react-router-dom';

import AttachmentsList from '../../components/common/AttachmentsList'
import TransferHistoryTable from '../../components/common/TransferHistoryTable';
import { formatDate, formatDateToInput } from '../../utils/helper';
import AssignedUsersList from '../../components/common/AssignedUsersList';

const DocumentFormPage = ({ initialData, isEditMode = false, onSave, onProcessClick }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(
        (initialData?.document)
            ? initialData.document
            : initialData || {}
    );

    const handleEditClick = () => {
        console.log('Bấm nút "Chỉnh sửa"');
        if (initialData?.document?._id) {
            navigate(`/documents/edit/${initialData.document._id}`);
        } else {
            console.error(initialData.document);
        }
    };

    useEffect(() => {
        if (initialData) {
            setFormData(initialData.document || initialData);
        }
    }, [initialData]);


    const handleRemoveFile = (fileUrlToRemove) => {
        if (isEditMode) {
            setFormData(prevData => ({
                ...prevData,
                attachments: prevData.attachments.filter(url => url !== fileUrlToRemove)
            }));
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

    const renderSelectField = (label, name, options) => {
        return (
            <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                {isEditMode ? (
                    <select
                        name={name}
                        value={formData[name] || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        {options.map((option, index) => (
                            <option key={index} value={option.value || option.label}>{option.label}</option>
                        ))}
                    </select>
                ) : (
                    <div className="mt-1 block w-full p-2 text-gray-800 bg-gray-50 border border-gray-200 rounded-md">
                        {formData[name] || 'Chưa có dữ liệu'}
                    </div>
                )}
            </div>
        );
    };


    const renderFormField = (label, name, type = 'text', isReadOnly = false) => {
        let displayValue = formData[name];

        if (name === 'createdBy' && displayValue && typeof displayValue === 'object') {
            displayValue = displayValue.name;
        } else if (name === 'assignedUsers' && displayValue && Array.isArray(displayValue)) {
            displayValue = displayValue.map(user => user.name).join(', ');
        } else if (name === 'signer' && displayValue && typeof displayValue === 'object') {
            displayValue = displayValue.name;
        }

        if (['recivedDate', 'dueDate', 'recordedDate'].includes(name) && displayValue) {
            displayValue = formatDate(displayValue);
        }

        let inputValue = formData[name];
        if (name === 'createdBy' && inputValue && typeof inputValue === 'object') {
            inputValue = inputValue.name;
        } else if (name === 'signer' && inputValue && typeof inputValue === 'object') {
            inputValue = inputValue.name;
        } else if (name === 'assignedUsers' && inputValue && Array.isArray(inputValue)) {
            inputValue = inputValue.map(user => user.name).join(', ');
        }

        if (type === 'date' && formData[name]) {
            inputValue = new Date(formData[name]).toISOString().split('T')[0];
        }

        return (
            <div className="col-span-1">
                <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
                {isEditMode && !isReadOnly ? (
                    <input
                        type={type}
                        name={name}
                        value={inputValue || ''}
                        onChange={handleChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                ) : (
                    <div className="mt-1 block w-full p-2 text-gray-800 bg-gray-50 border border-gray-200 rounded-md">
                        {displayValue || 'Chưa có dữ liệu'}
                    </div>
                )}
            </div>
        );
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const { hasRole } = usePermissions();

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
                        <button onClick={handleGoBack}
                            className="h-8 flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                            Huỷ
                        </button>
                    )}
                    {!isEditMode && (
                        <>
                            <button onClick={() => onProcessClick(initialData.document._id, 'completed')}
                                className="h-8 flex items-center px-4 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-green-600">
                                Hoàn thành văn bản
                            </button>
                            <button onClick={() => onProcessClick(initialData.document._id, 'delegate')}
                                className="h-8 flex items-center px-4 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-blue-600">
                                Chuyển xử lý
                            </button>
                            {!hasRole('van_thu') && (
                                <button onClick={() => onProcessClick(initialData.document._id, 'return')}
                                    className="h-8 flex items-center px-4 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-yellow-600">
                                    Trả lại
                                </button>
                            )}
                        </>
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
                    {renderFormField('Số văn bản', 'documentNumber', 'text', true)}
                    {renderFormField('Sổ văn bản', 'documentBook')}
                    {renderFormField('Đơn vị gửi', 'sendingUnit')}
                    {renderFormField('Đơn vị nhận', 'recivingUnit')}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
                    {renderFormField('Ngày nhận VB', 'recivedDate', 'date')}
                    {renderFormField('Ngày vào sổ', 'recordedDate', 'date', true)}
                    {renderFormField('Hạn trả lời', 'dueDate', 'date')}
                    {renderFormField('Trạng thái', 'status', '', true)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
                    {renderSelectField('Phương thức nhận', 'receivingMethod', [
                        { label: 'Chọn phương thức', value: '' },
                        { label: 'Email', value: 'Email' },
                        { label: 'Fax', value: 'Fax' },
                        { label: 'Online', value: 'Online' },
                        { label: 'Offline', value: 'Offline' }
                    ])}
                    {renderSelectField('Độ mật', 'confidentialityLevel', [
                        { label: 'Chọn độ mật', value: '' },
                        { label: 'Bình thường', value: 'Bình thường' },
                        { label: 'Mật', value: 'Mật' },
                        { label: 'Tối mật', value: 'Tối mật' }
                    ])}
                    {renderSelectField('Độ khẩn', 'urgencyLevel', [
                        { label: 'Chọn độ khẩn', value: '' },
                        { label: 'Thường', value: 'Thường' },
                        { label: 'Khẩn', value: 'Khẩn' },
                        { label: 'Hoả tốc', value: 'Hoả tốc' }
                    ])}
                    {renderFormField('Người tạo', 'createdBy', 'text', true)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 items-stretch">
                    {renderSelectField('Loại VB', 'documentType', [
                        { label: 'Chọn loại văn bản', value: '' },
                        { label: 'Công văn', value: 'Công văn' },
                        { label: 'Thông báo', value: 'Thông báo' },
                        { label: 'Báo cáo', value: 'Báo cáo' }
                    ])}
                    {renderSelectField('Lĩnh vực', 'category', [
                        { label: 'Chọn lĩnh vực', value: '' },
                        { label: 'Hành chính', value: 'Hành chính' },
                        { label: 'Nhân sự', value: 'Nhân sự' },
                        { label: 'Kế toán', value: 'Kế toán' },
                        { label: 'Nội bộ', value: 'Nội bộ' },
                        { label: 'Nông nghiệp', value: 'Nông nghiệp' }
                    ])}
                    {renderFormField('Người ký', 'signer')}
                    {/* {renderFormField('Người được giao', 'assignedUsers')} */}
                </div>

                <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Trích yếu</label>
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
                            <label className="text-xs font-medium text-gray-700 self-center sticky left-0 z-10">Tệp đính kèm</label>
                            {isEditMode && (
                                <button className="sticky left-0 z-10 h-8 w-max flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                                    Đính kèm
                                </button>
                            )}
                            <div className=''>
                                <AttachmentsList
                                    attachments={formData.attachments}
                                    isEditMode={isEditMode}
                                    onRemoveFile={handleRemoveFile}
                                />
                            </div>

                        </div>
                    </div>
                </div>

                {!isEditMode && initialData?.document?.currentAssignments && (
                    <AssignedUsersList currentAssignments={initialData.document.currentAssignments} />
                )}

                {!isEditMode && initialData?.document?.processingHistory && (
                    <TransferHistoryTable history={initialData.document.processingHistory} />
                )}
            </div>
        </div>
    );
};

export default DocumentFormPage;