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
        confidentialityLevel = ''
    ) => {
        setLoading(true);
        setError(null);
        try {
            const fetchedDocuments = await documentService.getAllDocuments(
                query,
                status,
                documentType,
                urgencyLevel,
                confidentialityLevel
            );
            setDocuments(fetchedDocuments);
        } catch (err) {
            setError(err);
            console.error("Failed to fetch documents:", err);
        } finally {
            setLoading(false);
        }
    }, []);

        // Hàm mới để tìm nạp một văn bản cụ thể theo ID
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
        selectedDocument
    };

    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    );
};
