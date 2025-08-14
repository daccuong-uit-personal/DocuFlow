// Hàm xử lý lỗi tùy chỉnh

class BusinessError extends Error {
    constructor(message, statusCode = 400, details = null) {
        super(message);
        this.name = "BusinessError";
        this.statusCode = statusCode;
        this.details = details;
    }
}

module.exports = BusinessError;
