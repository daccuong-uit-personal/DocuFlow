import React, { useState, useEffect } from 'react';
import DocumentFormPage from './DocumentFormPage';

// Giả lập dữ liệu từ API
const mockDocumentData = {
    soVanBan: 'VB/2025/001',
    donViGui: 'Phòng ban A',
    donViNhan: 'Phòng ban B',
    ngayVB: '2025-08-05',
    ngayNhanVB: '2025-08-05',
    ngayVaoSo: '2025-08-05',
    hanTraLoi: '2025-08-15',
    soPhu: '007',
    phuongThucNhan: 'Email',
    doMat: 'Tuyệt mật',
    doKhan: 'Rất khẩn',
    loaiVB: 'Báo cáo',
    linhVuc: 'Hành chính',
    nguoiKy: 'Nguyễn Văn A',
    trichYeu: 'Báo cáo chi tiết quý 3 năm 2025 về tình hình hoạt động của các phòng ban trong công ty.'
};

const DocumentEditPage = () => {
    // Tạm thời sử dụng dữ liệu giả lập
    const [documentData, setDocumentData] = useState(mockDocumentData);

    const handleSave = (updatedData) => {
        // Đây là nơi bạn sẽ gọi API để lưu dữ liệu đã chỉnh sửa
        console.log('Dữ liệu cần lưu:', updatedData);
        alert('Giả lập: Dữ liệu đã được lưu thành công!');
        // Sau khi lưu thành công, bạn có thể chuyển hướng người dùng
        // navigate(`/documents/${updatedData.id}`);
    };

    // Truyền dữ liệu và hàm xử lý lưu vào component chung
    return (
        <DocumentFormPage 
            initialData={documentData} 
            isEditMode={true} 
            onSave={handleSave} 
        />
    );
};

export default DocumentEditPage;