import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DocumentCreatePage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        documentBook: '',
        documentNumber: '',
        sendingUnit: '',
        recivingUnit: '',
        recivedDate: '',
        recordedDate: '',
        dueDate: '',
        receivingMethod: 'Online',
        urgencyLevel: 'Thường',
        confidentialityLevel: 'Bình thường',
        documentType: '',
        category: '',
        signer: '',
        summary: '',
    });
    
    // State để lưu danh sách phòng ban từ API
    const [departments, setDepartments] = useState([]);
    
    // State để quản lý danh sách các tệp đính kèm
    const [attachedFiles, setAttachedFiles] = useState([]);
    
    // State để theo dõi tệp nào đang được hover
    const [hoveredFile, setHoveredFile] = useState(null);

    const [loading, setLoading] = useState(false);

    // Fetch danh sách phòng ban khi component mount
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token'); 
                const response = await axios.get('http://localhost:8000/api/departments', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setDepartments(response.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách phòng ban:", error);
                toast.error("Không thể tải danh sách phòng ban.", { position: "top-right" });
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        const allowedExtensions = ['.pdf', '.docx', '.xlsx'];

        const validFiles = [];
        const rejectedFiles = [];

        files.forEach((file) => {
            const name = file.name.toLowerCase();
            const hasAllowedExt = allowedExtensions.some(ext => name.endsWith(ext));
            if (hasAllowedExt) {
                validFiles.push(file);
            } else {
                rejectedFiles.push(file.name);
            }
        });

        if (rejectedFiles.length > 0) {
            toast.error(`Chỉ cho phép tệp .pdf, .docx, .xlsx!`);
        }

        if (validFiles.length > 0) {
            setAttachedFiles(prevFiles => [...prevFiles, ...validFiles]);
        }
    };

    const handlePreviewLocalFile = (file) => {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleRemoveFile = (fileNameToRemove) => {
        setAttachedFiles(attachedFiles.filter(file => file.name !== fileNameToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const requiredFields = [
            'documentBook', 'documentNumber', 'sendingUnit', 'recivingUnit',
            'recivedDate', 'recordedDate', 'dueDate', 'documentType', 'category', 'signer'
        ];
        
        for (let i = 0; i < requiredFields.length; i++) {
            const field = requiredFields[i];
            if (!formData[field]) {
                toast.error("Bạn phải nhập đủ các trường bắt buộc!", { position: "top-right" });
                return;
            }
        }

        const recivedDateObj = new Date(formData.recivedDate);
        const recordedDateObj = new Date(formData.recordedDate);
        const dueDateObj = new Date(formData.dueDate);

        if (recivedDateObj >= recordedDateObj) {
            toast.error("Ngày VB phải nhỏ hơn Ngày nhận VB/Ngày vào sổ!", { position: "top-right" });
            return;
        }

        if (recordedDateObj >= dueDateObj) {
            toast.error("Ngày nhận VB/Ngày vào sổ phải nhỏ hơn Hạn trả lời!", { position: "top-right" });
            return;
        }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
        }
        attachedFiles.forEach(file => {
            data.append('attachments', file, file.name);
        });

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8000/api/documents', data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("Tạo văn bản thành công!", { position: "top-right" });
            navigate('/documents');
            setFormData({
                documentBook: '', documentNumber: '', sendingUnit: '', recivingUnit: '',
                recivedDate: '', recordedDate: '', dueDate: '', receivingMethod: 'Online',
                urgencyLevel: 'Thường', confidentialityLevel: 'Bình thường', documentType: '', 
                category: '', signer: '', summary: '',
            });
            setAttachedFiles([]);
        } catch (error) {
            console.error("Lỗi khi tạo văn bản:", error);
            const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi tạo văn bản. Vui lòng thử lại.";
            toast.error(errorMessage, { position: "top-right" });
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-100 min-h-full p-0">
                <LoadingSpinner size="large" message="Đang tải dữ liệu..." />
            </div>
        );
    }

    return (
        <div className="bg-gray-100 min-h-full p-0">
            <form onSubmit={handleSubmit}>
                {/* Header và Breadcrumb */}
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-lg font-semibold text-gray-800">Tạo văn bản đến</h1>
                    </div>
                    <div className="flex space-x-2">
                        {/* <button type="button" className="h-8 flex items-center px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                            Chuyển xử lý
                        </button> */}
                        <button type="submit" className="h-8 flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-sky-600">
                            Lưu
                        </button>
                    </div>
                </div>

                {/* Form chính */}
                <div className="bg-white rounded-xl shadow-md p-4">
                    {/* Hàng 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Số văn bản</label>
                            <input
                                type="text"
                                name="documentBook"
                                value={formData.documentBook}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Sổ văn bản</label>
                            <input
                                type="text"
                                name="documentNumber"
                                value={formData.documentNumber}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Đơn vị gửi</label>
                            <select
                                name="sendingUnit"
                                value={formData.sendingUnit}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Chọn đơn vị gửi</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept.name}> 
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Đơn vị nhận</label>
                            <select
                                name="recivingUnit"
                                value={formData.recivingUnit}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Chọn đơn vị nhận</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept.name}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Hàng 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Ngày VB</label>
                            <input
                                type="date"
                                name="recivedDate"
                                value={formData.recivedDate}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Ngày nhận VB</label>
                            <input
                                type="date"
                                name="recordedDate"
                                value={formData.recordedDate}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Ngày vào sổ</label>
                            <input
                                type="date"
                                name="recordedDate" // Dùng chung trường này với "Ngày nhận VB"
                                value={formData.recordedDate}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Hạn trả lời</label>
                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Hàng 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Phương thức nhận</label>
                            <select
                                name="receivingMethod"
                                value={formData.receivingMethod}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Online">Online</option>
                                <option value="Offline">Offline</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Độ mật</label>
                            <select
                                name="confidentialityLevel"
                                value={formData.confidentialityLevel}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Bình thường">Bình thường</option>
                                <option value="Mật">Mật</option>
                                <option value="Tối mật">Tối mật</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Độ khẩn</label>
                            <select
                                name="urgencyLevel"
                                value={formData.urgencyLevel}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Thường">Thường</option>
                                <option value="Khẩn">Khẩn</option>
                                <option value="Hoả tốc">Hoả tốc</option>
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Loại VB</label>
                            <select
                                name="documentType"
                                value={formData.documentType}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="">Chọn loại văn bản</option>
                                <option value="Hiến pháp">Hiến pháp</option>
                                <option value="Sắc lệnh - Sắc luật">Sắc lệnh - Sắc luật</option>
                                <option value="Luật">Luật</option>
                                <option value="Nghị định">Nghị định</option>
                                <option value="Quyết định">Quyết định</option>
                                <option value="Thông tư">Thông tư</option>
                                <option value="Công văn">Công văn</option>
                                <option value="Chỉ thị">Chỉ thị</option>
                                <option value="Khác">Khác</option>
                            </select>
                        </div>
                    </div>

                    {/* Hàng 4 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Lĩnh vực</label>
                            <input
                                type="text"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Người ký</label>
                            <input
                                type="text"
                                name="signer"
                                value={formData.signer}
                                onChange={handleChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Hàng Trích yếu */}
                    <div className="mb-6">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Trích yếu</label>
                        <textarea
                            rows="4"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* Hàng Tệp đính kèm */}
                    <div className="mt-6 flex flex-row items-center space-x-4">
                        <label className="text-xs font-medium text-gray-700 self-center sticky left-0 z-10">Tệp đính kèm</label>
                        <div className="flex-1 overflow-x-auto">
                            <div className="flex flex-row space-x-2 w-max pb-2">
                                <label className="sticky left-0 z-10 h-8 w-max flex items-center px-8 py-2 text-xs font-medium text-white bg-gradient-to-tl from-sky-300 from-30% to-sky-500 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50">
                                    Đính kèm
                                    <input
                                        type="file"
                                        multiple
                                        accept=".pdf,.docx,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </label>
                                {attachedFiles.map((file, index) => (
                                    <div
                                        key={index}
                                        className="relative h-8 p-2 pr-8 border border-gray-300 bg-white rounded-full flex items-center transition-all duration-200"
                                        onMouseEnter={() => setHoveredFile(file.name)}
                                        onMouseLeave={() => setHoveredFile(null)}
                                    >
                                        <span className="text-xs mr-2">{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handlePreviewLocalFile(file)}
                                            title="Xem trước"
                                            className="mr-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <EyeIcon className="h-4 w-4" />
                                        </button>
                                        {hoveredFile === file.name && (
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFile(file.name)}
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
            </form>
        </div>
    );
};

export default DocumentCreatePage;
