// Hàm API cho quản lý người dùng (get, create, update, delete)

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/users/';
const DEPARTMENTS_API_URL = 'http://localhost:8000/api/departments/';
const ROLES_API_URL = 'http://localhost:8000/api/roles/';

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
                }
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

    // Thêm method mới cho cập nhật profile
    updateProfile: async (userID, profileData) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}${userID}/profile`, profileData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.response?.data?.message || 'Lỗi khi cập nhật thông tin cá nhân';
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

    // Upload avatar
    uploadAvatar: async (userID, file) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('avatar', file);

            const response = await axios.post(`${API_URL}${userID}/avatar`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.response?.data?.message || 'Lỗi khi upload ảnh đại diện';
        }
    },

    // Delete avatar
    deleteAvatar: async (userID) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`${API_URL}${userID}/avatar`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.response?.data?.message || 'Lỗi khi xóa ảnh đại diện';
        }
    },

    // Thêm API mới để toggle lock status
    toggleLockStatus: async (userID) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`${API_URL}${userID}/toggle-lock`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            throw error.response?.data?.error || error.response?.data?.message || 'Lỗi khi thay đổi trạng thái khóa tài khoản';
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