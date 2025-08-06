// Hàm API cho quản lý văn bản
import axios from 'axios';

const API_DOCUMENTS = 'http://localhost:8000/api/documents/';
const documentService = {
    getAllDocuments: async (
        query = '',
        status = '',
        documentType = '',
        urgencyLevel = '',
        confidentialityLevel = ''
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
                    confidentialityLevel: confidentialityLevel
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
    }
};

export default documentService;
