// Khai báo instance axios chung

import axios from 'axios';

// Tạo một instance Axios
const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Thay đổi base URL ở đây
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để tự động đính kèm token xác thực
apiClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.accessToken) {
      config.headers['Authorization'] = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;