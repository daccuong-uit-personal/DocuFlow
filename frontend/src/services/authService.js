// Hàm API cho xác thực đăng nhập

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';
const API_UPDATE_USER = 'http://localhost:8000/api/users';

const login = async (userName, password) => {
    console.log(userName, password);
  return axios.post(`${API_URL}/login`, { userName, password });
};

const updateUser  = async (userId, userData, token) => {
  return axios.put(`${API_UPDATE_USER}/${userId}`, userData,  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

const authService = {
  login,
  updateUser,
};

export default authService;