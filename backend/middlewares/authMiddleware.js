// Middleware xác thực người dùng (kiểm tra JWT token)

const isAuthenticated = (req, res, next) => {
    if (req.session.user)
        return next();
    return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
}

module.exports = isAuthenticated;