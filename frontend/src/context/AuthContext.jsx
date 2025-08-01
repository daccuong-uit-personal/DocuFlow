// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Logic để kiểm tra token có hợp lệ không (nếu cần)
      // Ví dụ: gọi API profile để lấy thông tin user
      // Giả sử token hợp lệ, ta sẽ set user tạm thời
      setUser({ token }); 
    }
    setLoading(false);
  }, []);

  const login = async (userName, password) => {
    try {
      const response = await authService.login(userName, password);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setUser({ token });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
