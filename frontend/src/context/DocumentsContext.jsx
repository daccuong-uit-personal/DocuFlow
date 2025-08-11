import React, { createContext, useState, useEffect, useCallback } from 'react';
import documentService from '../services/documentService';

export const DocumentContext = createContext(null);

export const DocumentProvider = ({ children }) => {
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Hàm chung để xử lý các yêu cầu tới backend và cập nhật trạng thái
     * Hàm này được sửa lại để xử lý trả về một mảng tài liệu đã cập nhật
     * @param {Function} apiCall - Hàm service API cần gọi.
     * @param {Array} args - Các đối số của hàm service.
     * @param {string} successMessage - Tin nhắn thành công.
     */
    const handleApiCall = useCallback(async (apiCall, args, successMessage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await apiCall(...args);
            const updatedDocuments = response?.documents || response || [];

            // THÊM BƯỚC KIỂM TRA ĐẦU VÀO VÀ ĐỊNH DẠNG LẠI DỮ LIỆU TẠI ĐÂY
            let processedDocuments = updatedDocuments;

            // Nếu API trả về một đối tượng thay vì một mảng, hãy bọc nó trong một mảng
            if (updatedDocuments && !Array.isArray(updatedDocuments)) {
                processedDocuments = [updatedDocuments];
            } else if (!updatedDocuments) {
                // Trường hợp không có dữ liệu trả về, coi như không có gì để cập nhật
                processedDocuments = [];
            }

            // Cập nhật danh sách documents với dữ liệu đã được xử lý
            setDocuments(prevDocs => {
                // Kiểm tra processedDocuments để tránh lỗi
                if (processedDocuments.length === 0) return prevDocs;

                const updatedDocsMap = new Map(processedDocuments.map(doc => [doc._id, doc]));
                return prevDocs.map(doc => updatedDocsMap.has(doc._id) ? updatedDocsMap.get(doc._id) : doc);
            });

            // Nếu tài liệu đang được chọn nằm trong danh sách cập nhật, thì cập nhật lại
            if (selectedDocument && processedDocuments.length > 0) {
                const updatedSelectedDoc = processedDocuments.find(doc => doc._id === selectedDocument._id);
                if (updatedSelectedDoc) {
                    setSelectedDocument(updatedSelectedDoc);
                }
            }

            console.log(successMessage);
            return processedDocuments;
        } catch (err) {
            setError(err.message || 'Có lỗi xảy ra.');
            console.error(err);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [selectedDocument]);


    // Các hàm fetch cơ bản không thay đổi nhiều
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
        } catch (err) {
            setError(err.message || 'Không tìm thấy văn bản.');
            console.error("Failed to fetch document by ID:", err);
            setSelectedDocument(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Hàm updateDocument cũ đã được đổi tên để tránh nhầm lẫn
    const updateDocumentDetails = useCallback(async (id, updatedData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedDoc = await documentService.updateDocument(id, updatedData);
            setDocuments(prevDocs =>
                prevDocs.map(doc => (doc._id === id ? updatedDoc : doc))
            );
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
            setDocuments(prevDocuments => prevDocuments.filter(doc => !documentIds.includes(doc._id)));
            console.log(`Đã xóa thành công các văn bản có IDs: ${documentIds.join(', ')}`);
        } catch (err) {
            setError(err.message || 'Không thể xóa các văn bản đã chọn. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // --- Các hàm mới sử dụng handleApiCall và trả về mảng ID ---
    const processDocuments = useCallback(async (documentIds, processors, note, deadline) => {
        return handleApiCall(
            documentService.processDocuments,
            [documentIds, processors, note, deadline],
            'Chuyển xử lý văn bản thành công!'
        );
    }, [handleApiCall]);

    const updateProcessors = useCallback(async (documentIds, updates) => {
        return handleApiCall(
            documentService.updateProcessors,
            [documentIds, updates],
            'Cập nhật người xử lý thành công!'
        );
    }, [handleApiCall]);

    const returnDocuments = useCallback(async (documentIds, note) => {
        return handleApiCall(
            documentService.returnDocuments,
            [documentIds, note],
            'Trả lại văn bản thành công!'
        );
    }, [handleApiCall]);

    const recallDocuments = useCallback(async (documentIds) => {
        return handleApiCall(
            documentService.recallDocuments,
            [documentIds],
            'Thu hồi văn bản thành công!'
        );
    }, [handleApiCall]);

    const markAsComplete = useCallback(async (documentIds) => {
        return handleApiCall(
            documentService.markAsComplete,
            [documentIds],
            'Đánh dấu hoàn thành văn bản thành công!'
        );
    }, [handleApiCall]);

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
        updateDocument: updateDocumentDetails,
        deleteDocuments,
        processDocuments,
        updateProcessors,
        returnDocuments,
        recallDocuments,
        markAsComplete,
    };

    return (
        <DocumentContext.Provider value={value}>
            {children}
        </DocumentContext.Provider>
    );
};