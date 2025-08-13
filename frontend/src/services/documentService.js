import axios from 'axios';

const API_DOCUMENTS = 'http://localhost:8000/api/documents/';

const documentService = {
    // Lấy danh sách văn bản với bộ lọc
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
            const token = localStorage.getItem('token');
            const response = await axios.get(API_DOCUMENTS, {
                headers: { Authorization: `Bearer ${token}` },
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
            console.log('Service FE 30: Danh sách văn bản:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching documents:", error);
            throw error.response?.data?.message || 'Lỗi khi lấy danh sách văn bản';
        }
    },

    // Lấy chi tiết văn bản theo ID
    getDocumentById: async (documentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_DOCUMENTS}${documentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // console.log('Service FE 45: Chi tiết văn bản:', response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching document by ID:", error);
            throw error.response?.data?.message || 'Lỗi khi lấy chi tiết văn bản';
        }
    },

    // Cập nhật văn bản
    updateDocument: async (documentId, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const dataToSend = { ...updatedData };
            delete dataToSend._id;
            delete dataToSend.documentNumber;

            const response = await axios.put(`${API_DOCUMENTS}${documentId}`, dataToSend, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật văn bản ${documentId}:`, error);
            throw error.response?.data?.message || 'Lỗi khi cập nhật văn bản';
        }
    },

    // Xóa nhiều văn bản
    deleteDocuments: async (documentIds) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_DOCUMENTS}bulk-delete`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: documentIds }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa danh sách văn bản:', error);
            throw error.response?.data?.message || 'Lỗi khi xóa danh sách văn bản';
        }
    },

    // Chuyển xử lý văn bản
    processDocuments: async (documentIds, processors, note, deadline) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_DOCUMENTS}process`, {
                documentIds,
                assignerId: localStorage.getItem('userId'),
                processors,
                note,
                deadline
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi chuyển xử lý văn bản:', error);
            throw error.response?.data?.message || 'Lỗi khi chuyển xử lý văn bản';
        }
    },

    // Trả lại văn bản
    returnDocuments: async (documentIds, note) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_DOCUMENTS}return`, {
                documentIds,
                note
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi trả lại văn bản:', error);
            throw error.response?.data?.message || 'Lỗi khi trả lại văn bản';
        }
    },

    // Đánh dấu hoàn thành
    markAsComplete: async (documentIds) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_DOCUMENTS}complete`, {
                documentIds
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi đánh dấu văn bản hoàn thành:', error);
            throw error.response?.data?.message || 'Lỗi khi đánh dấu văn bản hoàn thành';
        }
    }
};

export default documentService;
