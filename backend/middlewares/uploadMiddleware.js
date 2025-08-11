// Xử lý upload file
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Đường dẫn lưu trữ file, bạn có thể thay đổi tùy ý
        cb(null, 'uploads/documents');
    },
    filename: (req, file, cb) => {
        // Lưu đúng tên gốc: tên file + phần mở rộng
        // Lưu ý: có thể trùng tên nếu người dùng upload trùng
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn kích thước file 10MB
    fileFilter: (req, file, cb) => {
        // Chỉ chấp nhận một số loại file nhất định
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx|xlsx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Only images, pdf, and docx files are allowed!');
        }
    }
});

module.exports = upload;