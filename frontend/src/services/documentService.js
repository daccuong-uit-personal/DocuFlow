import axios from 'axios';

const API_DOCUMENTS = 'http://localhost:8000/api/documents/';

const documentService = {
    // Các hàm CRUD cơ bản
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
            const response = await axios.get(`${API_DOCUMENTS}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    searchText: query,
                    status: status,
                    documentType: documentType,
                    urgencyLevel: urgencyLevel,
                    confidentialityLevel: confidentialityLevel,
                    recivedDateFrom: recivedDateFrom,
                    recivedDateTo: recivedDateTo
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching documents:", error);
            throw error.response?.data?.message || 'Lỗi khi lấy danh sách văn bản';
        }
    },

    getDocumentById: async (documentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_DOCUMENTS}${documentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching document by ID:", error);
            throw error.response?.data?.message || 'Lỗi khi lấy chi tiết văn bản';
        }
    },

    updateDocument: async (documentId, updatedData) => {
        try {
            const token = localStorage.getItem('token');
            const dataToSend = { ...updatedData };
            
            // Xóa các trường không cần thiết
            if (dataToSend.documentNumber) delete dataToSend.documentNumber;
            if (dataToSend._id) delete dataToSend._id;

            const response = await axios.put(`${API_DOCUMENTS}${documentId}`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật văn bản có ID ${documentId}:`, error);
            throw error.response?.data?.message || 'Lỗi khi cập nhật văn bản';
        }
    },

    deleteDocuments: async (documentIds) => {
        try {
            const token = localStorage.getItem('token');
            const idsString = documentIds.join(',');

            const response = await axios.delete(`${API_DOCUMENTS}bulk-delete`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    ids: idsString
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi xóa danh sách văn bản:', error);
            throw error.response?.data?.message || 'Lỗi khi xóa danh sách văn bản';
        }
    },

    // --- Các hàm mới cho chức năng quản lý luồng văn bản ---
    // Hàm này hợp nhất delegate và addProcessor
    processDocuments: async (documentIds, processors, note, deadline) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_DOCUMENTS}process`, {
                documentIds,
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

    // Hàm cập nhật người xử lý (thay thế người cũ bằng người mới)
    updateProcessors: async (documentIds, updates) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_DOCUMENTS}update-processors`, {
                documentIds,
                updates
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log( "updateProcessors",response.data);
            return response.data;
        } catch (error) {
            console.error('Lỗi khi cập nhật người xử lý:', error);
            throw error.response?.data?.message || 'Lỗi khi cập nhật người xử lý';
        }
    },

    // Hàm trả lại văn bản
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

    // Hàm thu hồi văn bản
    recallDocuments: async (documentIds) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${API_DOCUMENTS}recall`, {
                documentIds
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi thu hồi văn bản:', error);
            throw error.response?.data?.message || 'Lỗi khi thu hồi văn bản';
        }
    },

    // Hàm đánh dấu văn bản đã hoàn thành
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
    },
};

export default documentService;