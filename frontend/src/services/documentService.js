import axios from 'axios';

const API_DOCUMENTS = 'http://localhost:8000/api/documents/';

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

const extractErrorMessage = (error, defaultMsg) => {
    return error?.response?.data?.message || error?.message || defaultMsg;
};

const documentService = {
    // Lấy danh sách văn bản
    getAllDocuments: async (
        query = '',
        status = '',
        documentType = '',
        urgencyLevel = '',
        confidentialityLevel = '',
        recivedDateFrom = '',
        recivedDateTo = ''
    ) => {
        try {
            const response = await axios.get(API_DOCUMENTS, {
                headers: getAuthHeaders(),
                params: {
                    searchText: query,
                    status,
                    documentType,
                    urgencyLevel,
                    confidentialityLevel,
                    recivedDateFrom,
                    recivedDateTo
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error, 'Lỗi khi lấy danh sách văn bản'));
        }
    },

    // Lấy chi tiết văn bản
    getDocumentById: async (documentId) => {
        try {
            const response = await axios.get(`${API_DOCUMENTS}${documentId}`, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error, 'Lỗi khi lấy chi tiết văn bản'));
        }
    },

    // Cập nhật văn bản
    updateDocument: async (documentId, updatedData) => {
        try {
            const dataToSend = { ...updatedData };
            delete dataToSend._id;
            delete dataToSend.documentNumber;

            const response = await axios.put(`${API_DOCUMENTS}${documentId}`, dataToSend, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error, 'Lỗi khi cập nhật văn bản'));
        }
    },

    // Xóa nhiều văn bản
    deleteDocuments: async (documentIds) => {
        try {
            const response = await axios.delete(`${API_DOCUMENTS}bulk-delete`, {
                headers: getAuthHeaders(),
                data: { ids: documentIds }
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error, 'Lỗi khi xóa danh sách văn bản'));
        }
    },

    // Chuyển xử lý văn bản
    processDocuments: async (documentIds, processors, note, deadline) => {
        try {
            const response = await axios.post(`${API_DOCUMENTS}process`, {
                documentIds,
                assignerId: localStorage.getItem('userId'),
                processors,
                note,
                deadline
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error, 'Lỗi khi chuyển xử lý văn bản'));
        }
    },

    // Trả lại văn bản
    returnDocuments: async (documentIds, note) => {
        try {
            const response = await axios.post(`${API_DOCUMENTS}return`, {
                documentIds,
                note
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error, 'Lỗi khi trả lại văn bản'));
        }
    },

    // Đánh dấu hoàn thành
    markAsComplete: async (documentIds) => {
        try {
            const response = await axios.post(`${API_DOCUMENTS}complete`, {
                documentIds
            }, {
                headers: getAuthHeaders()
            });
            return response.data;
        } catch (error) {
            throw new Error(extractErrorMessage(error, 'Lỗi khi đánh dấu văn bản hoàn thành'));
        }
    }
};

export default documentService;