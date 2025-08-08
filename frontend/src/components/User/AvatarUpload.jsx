import React, { useState, useRef } from 'react';
import { CameraIcon, TrashIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import userService from '../../services/userService';

const AvatarUpload = ({ userId, currentAvatar, onAvatarUpdate, size = 'large' }) => {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const fileInputRef = useRef(null);

  const sizeClasses = {
    small: 'w-16 h-16',
    medium: 'w-24 h-24',
    large: 'w-36 h-36'
  };

  const getAvatarUrl = () => {
    if (currentAvatar && !currentAvatar.includes('default-avatar')) {
      return `http://localhost:8000/${currentAvatar}?t=${Date.now()}`;
    }
    return `http://localhost:8000/uploads/avatars/default-avatar.jpg?t=${Date.now()}`;
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = async (file) => {
    // Validate loại tệp
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF, WEBP)');
      return;
    }

    // Validate độ dài tệp (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      
      // Tạo FormData
      const formData = new FormData();
      formData.append('avatar', file);

      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }

      // Fetch API để upload avatar
      const response = await fetch(`http://localhost:8000/api/users/${userId}/avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Có lỗi xảy ra khi upload ảnh');
      }

      const result = await response.json();
      
      toast.success('Upload ảnh đại diện thành công!');
      
      // Callback 
      if (onAvatarUpdate) {
        onAvatarUpdate(result.user);
      }
      
    } catch (error) {
      console.error('Lỗi upload avatar:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi upload ảnh');
    } finally {
      setUploading(false);
      // Thiết lập lại input file để có thể upload cùng một file
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!currentAvatar || currentAvatar.includes('default-avatar')) {
      toast.info('Không có ảnh để xóa');
      return;
    }

    try {
      setDeleting(true);
      const response = await userService.deleteAvatar(userId);
      
      toast.success('Xóa ảnh đại diện thành công!');
      
      // Callback
      if (onAvatarUpdate) {
        onAvatarUpdate(response.user);
      }
      
    } catch (error) {
      console.error('Lỗi xóa avatar:', error);
      toast.error(error.message || 'Có lỗi xảy ra khi xóa ảnh');
    } finally {
      setDeleting(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Hiển thị avatar */}
      <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden border-4 border-gray-200 shadow-lg`}>
        <img
          src={getAvatarUrl()}
          alt="Avatar"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `http://localhost:8000/uploads/avatars/default-avatar.jpg`;
          }}
        />
        
        {/* Upload Overlay */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          onClick={triggerFileInput}
        >
          <CameraIcon className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Nút bấm */}
      <div className="flex space-x-2">
        <button
          onClick={triggerFileInput}
          disabled={uploading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang tải...
            </>
          ) : (
            <>
              <CameraIcon className="w-4 h-4 mr-2" />
              Thay đổi ảnh
            </>
          )}
        </button>

        {currentAvatar && !currentAvatar.includes('default-avatar') && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {deleting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Đang xóa...
              </>
            ) : (
              <>
                <TrashIcon className="w-4 h-4 mr-2" />
                Xóa ảnh
              </>
            )}
          </button>
        )}
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload;