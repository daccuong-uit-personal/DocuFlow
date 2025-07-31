// Middleware xác thực người dùng (kiểm tra JWT token)
exports.isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ message: 'Chưa đăng nhập' });
    }
};
