// Hàm API cho quản lý người dùng (get, create, update, delete)

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/';

const userService = {
    getAllUsers: async (
        searchQuery = '',
        departmentID = '',
        role = '',
        gender = '',
        isLocked = ''
    ) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    searchText: searchQuery,
                    departmentID: departmentID,
                    role: role,
                    gender: gender,
                    isLocked: isLocked
                }
            });
            return response.data;
        } catch (error) {
            // Ném lỗi để component sử dụng có thể bắt được
            throw error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng';
        }
    },

};

export default userService;