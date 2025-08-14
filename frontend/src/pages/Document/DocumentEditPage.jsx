import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DocumentFormPage from './DocumentFormPage';
import { useDocuments } from '../../hooks/useDocuments';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const DocumentEditPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        selectedDocument,
        loading,
        error,
        fetchDocumentById,
        updateDocument
    } = useDocuments();

    useEffect(() => {
        if (id) {
            fetchDocumentById(id);
        }
    }, [id, fetchDocumentById]);

    const handleSave = async (updatedData) => {
        try {
            await updateDocument(id, updatedData);
            toast.success('Cập nhật văn bản thành công!');
            navigate(`/documents/detail/${id}`);
        } catch (saveError) {
            console.error('Lỗi khi lưu dữ liệu:', saveError);
            toast.error('Lỗi khi lưu dữ liệu. Vui lòng thử lại.');
        }
    };
    
    // Xử lý các trạng thái tải, lỗi và không có dữ liệu
    if (loading) {
        return (
            <div className="bg-gray-100 min-h-full">
                <LoadingSpinner size="large" message="Đang tải dữ liệu văn bản để chỉnh sửa..." />
            </div>
        );
    }

    if (error) {
        return <div className="p-4 text-center text-red-600">Lỗi: {error.message || error}</div>;
    }

    // Kiểm tra nếu không có dữ liệu để chỉnh sửa
    if (!selectedDocument) {
        return <div className="p-4 text-center text-gray-600">Không tìm thấy dữ liệu văn bản để chỉnh sửa.</div>;
    }

    return (
        <DocumentFormPage 
            initialData={selectedDocument} 
            isEditMode={true} 
            onSave={handleSave} 
        />
    );
};

export default DocumentEditPage;