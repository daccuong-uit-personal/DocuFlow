// Hàm API cho xác thực đăng nhập

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth';

const login = async (userName, password) => {
    console.log(userName, password);
  return axios.post(`${API_URL}/login`, { userName, password });
};

const authService = {
  login,
};

export default authService;