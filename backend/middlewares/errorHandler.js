// Middleware xử lý lỗi tập trung

module.exports = (err, req, res, next) => {
    console.error("Error:", err);

    // Nếu là lỗi nghiệp vụ (Business Logic)
    if (err.name === "BusinessError") {
        return res.status(err.statusCode || 400).json({
            message: err.message,
            details: err.details || null
        });
    }

    // Nếu là lỗi Mongoose "ObjectId không hợp lệ"
    if (err.name === "CastError" && err.kind === "ObjectId") {
        return res.status(400).json({ message: "ID không hợp lệ." });
    }

    // Nếu là lỗi validate của Mongoose
    if (err.name === "ValidationError") {
        return res.status(400).json({ 
            message: "Dữ liệu không hợp lệ.", 
            errors: err.errors 
        });
    }

    // Lỗi không xác định (Internal Server Error)
    return res.status(500).json({
        message: "Lỗi máy chủ, vui lòng thử lại sau.",
        error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
};