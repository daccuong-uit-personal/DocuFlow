// Thanh điều hướng trên cùng

import React from "react";
import { motion } from "framer-motion";
import { BellIcon, MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import { images } from "../../assets/images/images";

const Navbar = () => {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white shadow-sm p-1 flex items-center justify-between"
    >
      <div className="relative w-96">
        {/* <input
          type="text"
          placeholder="Search..."
          className="w-full h-8 pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 pr-1" /> */}
      </div>


      <div className="flex items-center space-x-6 mr-4">
        {/* Thông tin người dùng */}
        <div className="flex items-center space-x-2">
            <img
                src={images.image02}
                alt="User avatar"
                className="rounded-md h-8 w-8 object-cover"
            />
            <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-800">Nguyễn Đắc Cường</span>
                <span className="text-xs text-gray-500">Admin</span>
            </div>
        </div>
      </div>
      
    </motion.header>
  );
};

export default Navbar;