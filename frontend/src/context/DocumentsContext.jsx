import React, { createContext, useState, useEffect, useCallback } from 'react';
import documentService from '../services/documentService';

export const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Sử dụng useCallback để memoize hàm fetchDocuments, tránh re-render không cần thiết
    const fetchDocuments = useCallback(async (
        query = '',
        status = '',
        documentType = '',
        urgencyLevel = '',
        confidentialityLevel = '',
        recivedDateFrom = '',
        recivedDateTo = ''
    ) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedDocuments = await documentService.getAllDocuments(
                query,
                status,
                documentType,
                urgencyLevel,
                confidentialityLevel,
                recivedDateFrom,
                recivedDateTo
            );
            setDocuments(fetchedDocuments);
        } catch (err) {
            setError(err);
            console.error("Failed to fetch documents:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchDocumentById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const document = await documentService.getDocumentById(id);
            setSelectedDocument(document);
        } catch (err) {
            setError(err);
            console.error("Failed to fetch document by ID:", err);
            setSelectedDocument(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDocument = useCallback(async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await documentService.updateDocument(id, updatedData);
            const updatedDoc = response.document;

            setDocuments(prevDocs =>
                prevDocs.map(doc => (doc._id === id ? updatedDoc : doc))
            );
            setSelectedDocument(updatedDoc);

            return updatedDoc;
        } catch (err) {
            setError(err);
            console.error(`Lỗi khi cập nhật văn bản có ID ${id}:`, err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);


    const deleteDocuments = async (documentIds) => {
        setLoading(true);
        setError(null);
        try {
            await documentService.deleteDocuments(documentIds);

            setDocuments(prevDocuments => prevDocuments.filter(doc => !documentIds.includes(doc._id)));

            console.log(`Đã xóa thành công các văn bản có IDs: ${documentIds.join(', ')}`);
        } catch (err) {
            setError('Không thể xóa các văn bản đã chọn. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Gọi hàm fetchDocuments khi component mount
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    // Giá trị cung cấp cho các component con
    const value = {
        documents,
        loading,
        error,
        fetchDocuments,
        fetchDocumentById,
        selectedDocument,
        updateDocument,
        deleteDocuments,
    };

    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    );
};
