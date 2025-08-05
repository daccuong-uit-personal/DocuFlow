import React, { useState, useEffect } from 'react';
import DocumentFormPage from './DocumentFormPage';
import DocumentProcessPage from './DocumentProcessPage'

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

const DocumentDetailPage = () => {
    // Tạm thời sử dụng dữ liệu giả lập, sau này sẽ dùng state để lưu dữ liệu từ API
    const [documentData, setDocumentData] = useState(mockDocumentData);
    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

    const handleOpenProcessModal = () => setIsProcessModalOpen(true);
    const handleCloseProcessModal = () => setIsProcessModalOpen(false);
    
    // Khi gọi API, bạn sẽ thay đổi đoạn này
    // useEffect(() => {
    //   const fetchData = async () => {
    //     const data = await getDocumentById(id);
    //     setDocumentData(data);
    //   }
    //   fetchData();
    // }, [id]);

    // Truyền dữ liệu vào component chung và bật chế độ xem (isEditMode={false})
    return (
        <div> 
            <DocumentFormPage 
                initialData={documentData} 
                isEditMode={false}
                onDelegateClick={handleOpenProcessModal} 
            />

            <DocumentProcessPage
                isOpen={isProcessModalOpen}
                onClose={handleCloseProcessModal}
            />
        </div>
       
    )
};

export default DocumentDetailPage;