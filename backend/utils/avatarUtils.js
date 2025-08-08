// Hàm cho avatar
const path = require('path');
const fs = require('fs');

// Tạo URL đầy đủ cho avatar
const getAvatarUrl = (req, avatarPath) => {
    if (!avatarPath) {
        return `${req.protocol}://${req.get('host')}/uploads/avatars/default-avatar.jpg`;
    }
    return `${req.protocol}://${req.get('host')}/${avatarPath}`;
};

// Tạo ảnh default nếu chưa có
const ensureDefaultAvatar = () => {
    const defaultAvatarPath = path.join(__dirname, '..', 'uploads', 'avatars', 'default-avatar.jpg');

    if (!fs.existsSync(defaultAvatarPath)) {
        console.log('Default avatar not found. Please add default-avatar.jpg to uploads/avatars/');
    }
};

// Helper function để lấy avatar URL cho response
const getAvatarUrlForUser = (user, req) => {
    if (user.avatar && !user.avatar.includes('default-avatar')) {
        return `${req.protocol}://${req.get('host')}/${user.avatar}`;
    }
    return `${req.protocol}://${req.get('host')}/uploads/avatars/default-avatar.jpg`;
};

module.exports = {
    getAvatarUrl,
    ensureDefaultAvatar,
    getAvatarUrlForUser
};