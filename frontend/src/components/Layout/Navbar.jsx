// Thanh điều hướng trên cùng

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BellIcon, MagnifyingGlassIcon} from "@heroicons/react/24/solid";
import { images } from "../../assets/images/images";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";

const Navbar = () => {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  const [avatarUrl, setAvatarUrl] = useState('');

  // Hiển thị role description hoặc role name
  const getRoleDisplay = () => {
    if (!user || !user.role) return '';
    return user.role.description || user.role.name || '';
  };

  // Hiển thị badge cho admin
  const getRoleBadge = () => {
    if (isAdmin()) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 ml-2">
          Admin
        </span>
      );
    }
    return null;
  };

  // Set avatar URL when user changes
  useEffect(() => {
    if (user?.avatar && !user.avatar.includes('default-avatar')) {
      setAvatarUrl(`http://localhost:8000/${user.avatar}`);
    } else {
      setAvatarUrl(`http://localhost:8000/uploads/avatars/default-avatar.jpg`);
    }
  }, [user?.avatar]);

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
                src={avatarUrl}
                alt="User avatar"
                className="rounded-md h-8 w-8 object-cover"
                onError={(e) => {
                  e.target.src = `http://localhost:8000/uploads/avatars/default-avatar.jpg`;
                }}
            />
            <div className="flex flex-col">
                <div className="flex items-center">
                  <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
                  {getRoleBadge()}
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-xs text-gray-500">@{user?.userName}</span>
                  {getRoleDisplay() && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">{getRoleDisplay()}</span>
                    </>
                  )}
                </div>
            </div>
        </div>
      </div>
      
    </motion.header>
  );
};

export default Navbar;