import React, { createContext, useState, useEffect, useCallback } from 'react';
import documentService from '../services/documentService';

export const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleApiCall = useCallback(async (apiCall, args, successMessage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall(...args);
            const updatedDocuments = response?.documents || response || [];
            let processedDocuments = Array.isArray(updatedDocuments)
                ? updatedDocuments
                : updatedDocuments ? [updatedDocuments] : [];

            setDocuments(prevDocs => {
                if (processedDocuments.length === 0) return prevDocs;
                const updatedDocsMap = new Map(processedDocuments.map(doc => [doc._id, doc]));
                return prevDocs.map(doc => updatedDocsMap.get(doc._id) || doc);
            });

            if (selectedDocument && processedDocuments.length > 0) {
                const updatedSelectedDoc = processedDocuments.find(doc => doc._id === selectedDocument._id);
                if (updatedSelectedDoc) setSelectedDocument(updatedSelectedDoc);
            }

            console.log(successMessage);
            return processedDocuments;
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra.');
            console.error(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, [selectedDocument]);

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
                query, status, documentType, urgencyLevel, confidentialityLevel, recivedDateFrom, recivedDateTo
            );
            setDocuments(fetchedDocuments);
        } catch (err) {
            setError(err.message || 'Không thể lấy danh sách văn bản.');
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
            return document;
        } catch (err) {
            setError(err.message || 'Không tìm thấy văn bản.');
            setSelectedDocument(null);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateDocument = useCallback(async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedDoc = await documentService.updateDocument(id, updatedData);
            setDocuments(prevDocs => prevDocs.map(doc => (doc._id === id ? updatedDoc : doc)));
            setSelectedDocument(updatedDoc);
            return updatedDoc;
        } catch (err) {
            setError(err.message || 'Lỗi khi cập nhật văn bản.');
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
            console.log('Documents Context 106:', documentIds);
            setDocuments(prevDocuments => prevDocuments.filter(doc => !documentIds.includes(doc._id)));
            console.log(`Đã xóa thành công các văn bản có IDs: ${documentIds.join(', ')}`);
        } catch (err) {
            setError(err.message || 'Không thể xóa các văn bản đã chọn.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const processDocuments = useCallback(async (documentIds, processors, note, deadline) => {
        return handleApiCall(
            documentService.processDocuments,
            [documentIds, processors, note, deadline],
            'Chuyển xử lý văn bản thành công!'
        );
    }, [handleApiCall]);

    const returnDocuments = useCallback(async (documentIds, note) => {
        return handleApiCall(
            documentService.returnDocuments,
            [documentIds, note],
            'Trả lại văn bản thành công!'
        );
    }, [handleApiCall]);

    const markAsComplete = useCallback(async (documentIds) => {
        return handleApiCall(
            documentService.markAsComplete,
            [documentIds],
            'Đánh dấu hoàn thành văn bản thành công!'
        );
    }, [handleApiCall]);

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
