import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DocumentFormPage from './DocumentFormPage';
import DocumentProcessPage from './DocumentProcessPage';
import { useDocuments } from '../../hooks/useDocuments';

const DocumentDetailPage = () => {
    const { id } = useParams();
    const {
        selectedDocument,
        loading,
        error,
        fetchDocumentById
    } = useDocuments();

    const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);

    const [documentIdForModal, setDocumentIdForModal] = useState(null);

    const [modalMode, setModalMode] = useState('completed');

    const handleOpenProcessModal = (docId, mode) => {
        console.log('23 DocumentDetailPage: Open process modal', docId, mode);
        setDocumentIdForModal(docId);
        setModalMode(mode);
        setIsProcessModalOpen(true);
    };

    const handleCloseProcessModal = () => {
        setIsProcessModalOpen(false);
        setDocumentIdForModal(null);
        setModalMode('');
    };

    useEffect(() => {
        if (id) {
            fetchDocumentById(id);
        }
    }, [id, fetchDocumentById]);

    if (loading) {
        return <div className="p-4 text-center text-gray-600">Đang tải chi tiết văn bản...</div>;
    }
    if (error) {
        return <div className="p-4 text-center text-red-600">Lỗi: {error.message || error}</div>;
    }
    if (!selectedDocument) {
        return <div className="p-4 text-center text-gray-600">Không tìm thấy dữ liệu văn bản.</div>;
    }

    return (
        <div>
            <DocumentFormPage
                initialData={selectedDocument}
                isEditMode={false}
                onProcessClick={(docId, mode) => handleOpenProcessModal(docId, mode)}
            />

            <DocumentProcessPage
                isOpen={isProcessModalOpen}
                onClose={handleCloseProcessModal}
                documentIds={documentIdForModal ? [documentIdForModal] : []}
                mode={modalMode}
                document={selectedDocument}
            />
        </div>
    );
};

export default DocumentDetailPage;