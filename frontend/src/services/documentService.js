// Hàm API cho quản lý văn bản
import axios from 'axios';

const API_DOCUMENTS = 'http://localhost:8000/api/documents/';
const documentService = {
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

            if (dataToSend.documentNumber) {
                delete dataToSend.documentNumber;
            }
            if (dataToSend._id) {
                delete dataToSend._id;
            }
            const response = await axios.put(`${API_DOCUMENTS}${documentId}`, dataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error(`Lỗi khi cập nhật văn bản có ID ${documentId}:`, error);
            throw error;
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
            throw error;
        }
    },

};

export default documentService;
