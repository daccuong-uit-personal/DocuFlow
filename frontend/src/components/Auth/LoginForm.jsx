// src/components/LoginForm.jsx

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

// Định nghĩa các biến thể cho animation
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
};

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Xác thực đơn giản: kiểm tra trường Tên đăng nhập và Mật khẩu không trống
    if (!userName.trim() || !password.trim()) {
      setError('Tên đăng nhập và mật khẩu không được để trống.');
      setIsLoading(false);
      return;
    }

    try {
      // Gọi hàm login từ AuthContext để đăng nhập
      await login(userName, password);

      // Lưu trạng thái rememberMe nếu được chọn
      if (rememberMe) {
        localStorage.setItem('rememberMe', userName);
      }
      
      setIsLoading(false);

      // Chuyển hướng sau khi đăng nhập thành công
      setTimeout(() => {
        navigate('/documents');
      }, 1000);
    } catch (err) {
      // Xử lý lỗi từ backend
      console.error('Login error:', err);
      
      // Kiểm tra loại lỗi để hiển thị thông báo phù hợp
      let errorMessage = 'Đã xảy ra lỗi không xác định!';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      // Hiển thị toast cho lỗi tài khoản bị khóa
      if (errorMessage === 'Tài khoản này đã bị khóa!') {
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.error('Tên đăng nhập hoặc mật khẩu không đúng!');
        setError('');
      }
      
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="space-y-4"
      >

        {/* Trường Tên đăng nhập */}
        <motion.div variants={itemVariants}>
          <label htmlFor="userName" className="block text-xs font-medium text-gray-800 mb-2">Tên đăng nhập</label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={20} className="text-gray-400" />
            </div>
            <input
              id="userName"
              name="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 text-xs"
              placeholder="Tên đăng nhập"
            />
          </div>
        </motion.div>

        {/* Trường Mật khẩu */}
        <motion.div variants={itemVariants}>
          <label htmlFor="password" className="block text-xs font-medium text-gray-800 mb-2">Mật khẩu</label>
          <div className="relative rounded-lg shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={20} className="text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors duration-200 text-xs"
              placeholder="Mật khẩu của bạn"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
            </button>
          </div>
        </motion.div>

        {/* Checkbox "Lưu mật khẩu"
        <motion.div variants={itemVariants} className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="mr-2 h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-400 rounded "
          />
          <label htmlFor="rememberMe" className="text-xs text-gray-700">Lưu mật khẩu</label>
        </motion.div> */}
        
        {/* Hiển thị thông báo lỗi */}
        {/* {error ? (
          <p className={`text-xs font-medium ${error === 'Tài khoản này đã bị khóa!' ? 'text-orange-600' : 'text-red-500'}`}>
            {error}
          </p>
        ) : (
          <p className="text-red-500 text-xs font-medium opacity-0">h</p>
        )} */}

        {/* Nút Đăng nhập */}
        <motion.button
          type="submit"
          disabled={isLoading}
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`w-full flex justify-center items-center py-2 px-4 rounded-lg font-semibold text-white transition-colors duration-200 ${isLoading ? 'bg-gradient-to-tl from-sky-300 from-30% to-sky-500 cursor-not-allowed' : 'bg-gradient-to-tl from-sky-400 from-30% to-sky-600 hover:bg-sky-600 shadow-lg'}`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang đăng nhập...
            </span>
          ) : (
            <span className="flex items-center">
              <LogIn size={20} className="mr-2" />
              Đăng Nhập
            </span>
          )}
        </motion.button>
      </motion.div>
    </form>
  );
};

export default LoginForm;