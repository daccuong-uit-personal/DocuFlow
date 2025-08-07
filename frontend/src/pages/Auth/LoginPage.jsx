// Trang đăng nhập
import React from 'react';
import { motion } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import LoginForm from '../../components/Auth/LoginForm';
import { images } from '../../assets/images/images';

const LoginPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col lg:flex-row items-center justify-center min-h-screen font-sans "
    >
      <ToastContainer />

      {/* Left section: Promotional Content - now a full half of the screen */}
      <div className="w-full lg:w-1/2 h-screen flex justify-center items-center bg-white shadow-2xl p-4 md:p-6 lg:p-8 lg:rounded-l-none">
        <div className='h-1/5'></div>
        <div className="w-full max-w-sm h-3/5">

          <div className="flex flex-col mb-8">
            <div className="w-auto h-10 flex items-center text-gray-800 text-3xl font-bold mb-8">
              DocuFlow
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">
              Đăng nhập
            </h2>
            <p className="text-sm text-gray-600">
              Truy cập vào tài khoản của bạn để quản lý tài liệu.
            </p>
          </div>

          <LoginForm />
        </div>
        <div className='h-1/5'></div>
      </div>

      {/* Right section: Login Form - now a full half of the screen */}
      <div className="w-full lg:w-1/2 h-screen flex flex-col justify-center items-start bg-gradient-to-tl from-sky-300 from-30% to-sky-500 shadow-2xl p-4 md:p-6 lg:p-8 lg:rounded-l-none">
        <div className='h-1/5'></div>
        <div className="w-full h-3/5 flex flex-col items-center justify-center gap-4">
          <div className='h-4/5 w-full overflow-hidden flex flex-center justify-center'>
            <img
              src={images.image02}
              alt="Decorative rocket"
              className=" w-5/6 h-full object-cover object-center rounded-xl"
            />
          </div>
          
          <div className='h-1/5 w-5/6 flex flex-col justify-center items-center text-center '>
            <h2 className="text-2xl font-bold text-white w-3/5">
              Quản lý văn bản dễ dàng.
            </h2>
            <p className="text-white text-xs max-w-lg mx-auto mb-4">
              Streamline Your Business Management with Our User-Friendly Dashboard. Simplify
              complex tasks, track key metrics, and make informed decisions effortlessly.
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-4 h-1 bg-white rounded-full"></div>
              <div className="w-1 h-1 bg-white opacity-50 rounded-full"></div>
              <div className="w-1 h-1 bg-white opacity-50 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className='h-1/5'></div>
      </div>

    </motion.div>
  );
};

export default LoginPage;
