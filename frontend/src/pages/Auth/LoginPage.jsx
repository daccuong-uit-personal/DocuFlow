// Trang đăng nhập
import React from 'react';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import LoginForm from '../../components/Auth/LoginForm';
import { images } from '../../assets/images/images';

const LoginPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-200 to-blue-400 p-4 font-sans"
      style={{
        backgroundImage: `url(${images.theme})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Toaster />

      {/* Khung bao quanh chính */}
      <div className="flex flex-col md:flex-row bg-white/15 items-center justify-center rounded-3xl shadow-2xl p-6 md:p-10 w-full max-w-4xl">
        {/* Ảnh trang trí */}
        <div className="hidden md:block w-full md:w-1/2 h-80 md:h-auto bg-cover bg-center rounded-2xl overflow-hidden mb-6 md:mb-0 md:mr-10">
          <img
            src={images.theme}
            alt="Decorative rocket"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Khung chứa Form đăng nhập */}
        <div className="bg-white/90 p-8 md:p-10 rounded-3xl w-full md:w-1/2 bg-gradient-to-r from-blue-50 to-blue-100">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-1">Đăng Nhập</h1>
            <p className="text-gray-600 text-sm">Chào mừng bạn trở lại, đăng nhập để tiếp tục.</p>
          </div>
          <LoginForm />
        </div>
      </div>  
    </motion.div>
  );
};

export default LoginPage;