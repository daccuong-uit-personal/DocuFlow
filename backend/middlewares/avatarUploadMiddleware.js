// Middleware upload ảnh đại diện
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục uploads/avatars nếu chưa tồn tại
const avatarDir = 'uploads/avatars';
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất: userId-timestamp.extension
        const userId = req.params.id || req.user?.id || 'unknown';
        const uniqueSuffix = Date.now();
        const extension = path.extname(file.originalname);
        cb(null, `avatar-${userId}-${uniqueSuffix}${extension}`);
    }
});

const avatarUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // Giới hạn 5MB cho ảnh đại diện
    },
    fileFilter: (req, file, cb) => {
        // Chỉ chấp nhận file ảnh
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Chỉ chấp nhận file ảnh (JPEG, JPG, PNG, GIF, WEBP)!'));
        }
    }
});

module.exports = avatarUpload;
