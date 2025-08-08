import React from 'react';

const Avatar = ({ 
  src, 
  alt = "Avatar", 
  size = 'medium', 
  className = '',
  fallbackSrc = null 
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
    xlarge: 'w-24 h-24'
  };

  const getAvatarUrl = () => {
    if (src && !src.includes('default-avatar')) {
      return `http://localhost:8000/${src}`;
    }
    return fallbackSrc || `http://localhost:8000/uploads/avatars/default-avatar.jpg`;
  };

  return (
    <img
      src={getAvatarUrl()}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      onError={(e) => {
        e.target.src = fallbackSrc || `http://localhost:8000/uploads/avatars/default-avatar.jpg`;
      }}
    />
  );
};

export default Avatar;
