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
        // Chỉ chấp nhận: PDF, DOCX, XLSX
        const allowedExtensions = new Set(['.pdf', '.docx', '.xlsx']);
        const allowedMimetypes = new Set([
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ]);

        const fileExt = path.extname(file.originalname).toLowerCase();
        const isExtAllowed = allowedExtensions.has(fileExt);
        const isMimeAllowed = allowedMimetypes.has(file.mimetype);

        if (isExtAllowed && isMimeAllowed) {
            return cb(null, true);
        }

        return cb(new Error('Chỉ cho phép tải lên tệp .pdf, .docx, .xlsx'));
    }
});

module.exports = upload;