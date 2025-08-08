// Hàm API cho quản lý người dùng (get, create, update, delete)

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/';
const DEPARTMENTS_API_URL = 'http://localhost:8000/api/departments/';
const ROLES_API_URL = 'http://localhost:8000/api/roles/';
const paramsSerializer = (params) => {
    const parts = [];
    for (const key in params) {
        const value = params[key];
        if (Array.isArray(value)) {
            value.forEach(item => {
                parts.push(`${key}=${encodeURIComponent(item)}`);
            });
        } else if (value !== null && value !== undefined && value !== '') {
            parts.push(`${key}=${encodeURIComponent(value)}`);
        }
    }
    return parts.join('&');
};

const userService = {
    getAllUsers: async (
        searchQuery = '',
        departmentID = '',
        role = [],
        gender = '',
        isLocked = ''
    ) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    searchText: searchQuery,
                    departmentID: departmentID,
                    role: role,
                    gender: gender,
                    isLocked: isLocked
                },
                paramsSerializer: paramsSerializer
            });

            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Lỗi khi lấy danh sách người dùng';
        }
    },

    getUserById: async (userID) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`${API_URL}${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.message || 'Lỗi khi lấy thông tin người dùng';
        }
    },

    updateUser: async (userID, userData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}${userID}`, userData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.response?.data?.message || 'Lỗi khi cập nhật người dùng';
        }
    },

    deleteUser: async (userID) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}${userID}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.response?.data?.message || 'Lỗi khi xóa người dùng';
        }
    },

    // API để lấy danh sách departments từ database
    getDepartments: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(DEPARTMENTS_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách phòng ban:', error);
            throw error.response?.data?.error || error.response?.data?.message || 'Lỗi khi lấy danh sách phòng ban';
        }
    },

    // API để lấy danh sách roles từ database
    getRoles: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(ROLES_API_URL, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Lỗi khi lấy danh sách vai trò:', error);
            throw error.response?.data?.message || 'Lỗi khi lấy danh sách vai trò';
        }
    },
};

export default userService;