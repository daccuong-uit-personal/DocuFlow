// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import userService from '../services/userService';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // Parse chuỗi JSON thành object
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        // Xử lý trường hợp chuỗi trong localStorage không phải JSON hợp lệ
        console.error("Failed to parse user from localStorage", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userName, password) => {
    try {
      const response = await authService.login(userName, password);
      const userData = response.data.content;
      const token = response.data.token;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      toast.success('Đăng nhập thành công');

      setUser(userData);
      console.log('Login successful:', userData);
    } catch (error) {
      console.error('Login failed:', error);
      
      // Kiểm tra nếu là lỗi tài khoản bị khóa
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage === 'Tài khoản này đã bị khóa!') {
        // toast.error(errorMessage);
      }
      
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  // Hàm cập nhật thông tin người dùng hiện tại (sử dụng endpoint profile)
  const updateUser = async (updatedData) => {
      try {
          if (!user?._id) {
              throw new Error("Không tìm thấy thông tin người dùng.");
          }

          // Sử dụng userService.updateProfile thay vì updateUser
          const response = await userService.updateProfile(user._id, updatedData);

          // Backend trả về user đã cập nhật
          const newUserData = response.user;
          
          // Cập nhật lại localStorage và state
          localStorage.setItem('user', JSON.stringify(newUserData));
          setUser(newUserData);
          
          return newUserData;
      } catch (error) {
          console.error('Update user failed:', error);
          const errorMessage = error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại.';
          toast.error(errorMessage);
          throw new Error(errorMessage);
      }
  };

  // Hàm cập nhật avatar
  const updateUserAvatar = (updatedUser) => {
    // Cập nhật user trong state và localStorage
    const newUserData = { ...user, avatar: updatedUser.avatar };
    localStorage.setItem('user', JSON.stringify(newUserData));
    setUser(newUserData);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    updateUserAvatar,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? <div>Đang tải...</div> : children}
    </AuthContext.Provider>
  );
};