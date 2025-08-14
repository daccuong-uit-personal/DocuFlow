import React, { createContext, useState, useEffect, useCallback } from 'react';
import documentService from '../services/documentService';
import { safeApiCall } from '../utils/helper';

export const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Wrapper: tự setLoading + reset error + gọi safeApiCall
    const safeApiCallWithLoading = useCallback(async (apiFn, args = [], successMessage = '', onSuccess) => {
        setLoading(true);
        setError(null);
        const result = await safeApiCall(apiFn, args, successMessage); // safeApiCall đã toast lỗi/thành công
        if (result && onSuccess) onSuccess(result);
        setLoading(false);
        return result;
    }, []);

    // Lấy danh sách văn bản
    const fetchDocuments = useCallback((
        query = '',
        status = '',
        documentType = '',
        urgencyLevel = '',
        confidentialityLevel = '',
        recivedDateFrom = '',
        recivedDateTo = ''
    ) => {
        return safeApiCallWithLoading(
            documentService.getAllDocuments,
            [query, status, documentType, urgencyLevel, confidentialityLevel, recivedDateFrom, recivedDateTo],
            '',
            (data) => setDocuments(data || [])
        );
    }, [safeApiCallWithLoading]);

    // Lấy chi tiết văn bản
    const fetchDocumentById = useCallback((id) => {
        return safeApiCallWithLoading(
            documentService.getDocumentById,
            [id],
            '',
            (doc) => setSelectedDocument(doc)
        );
    }, [safeApiCallWithLoading]);

    // Cập nhật văn bản
    const updateDocument = useCallback((id, updatedData) => {
        return safeApiCallWithLoading(
            documentService.updateDocument,
            [id, updatedData],
            'Cập nhật văn bản thành công!',
            (updatedDoc) => {
                setDocuments(prev => prev.map(doc => (doc._id === id ? updatedDoc : doc)));
                setSelectedDocument(updatedDoc);
            }
        );
    }, [safeApiCallWithLoading]);

    // Xóa nhiều văn bản
    const deleteDocuments = useCallback((documentIds) => {
        return safeApiCallWithLoading(
            documentService.deleteDocuments,
            [documentIds],
            'Xóa văn bản thành công!',
            () => {
                setDocuments(prev => prev.filter(doc => !documentIds.includes(doc._id)));
            }
        );
    }, [safeApiCallWithLoading]);

    // Chuyển xử lý
    const processDocuments = useCallback((documentIds, processors, note, deadline) => {
        return safeApiCallWithLoading(
            documentService.processDocuments,
            [documentIds, processors, note, deadline],
            'Chuyển xử lý văn bản thành công!'
        );
    }, [safeApiCallWithLoading]);

    // Trả lại
    const returnDocuments = useCallback((documentIds, note) => {
        return safeApiCallWithLoading(
            documentService.returnDocuments,
            [documentIds, note],
            'Trả lại văn bản thành công!'
        );
    }, [safeApiCallWithLoading]);

    // Hoàn thành
    const markAsComplete = useCallback((documentIds) => {
        return safeApiCallWithLoading(
            documentService.markAsComplete,
            [documentIds],
            'Đánh dấu hoàn thành văn bản thành công!'
        );
    }, [safeApiCallWithLoading]);

    // Fetch lần đầu
    useEffect(() => {
        fetchDocuments();
    }, [fetchDocuments]);

    const value = {
        documents,
        loading,
        error,
        selectedDocument,
        fetchDocuments,
        fetchDocumentById,
        updateDocument,
        deleteDocuments,
        processDocuments,
        returnDocuments,
        markAsComplete,
    };

    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    );
};
