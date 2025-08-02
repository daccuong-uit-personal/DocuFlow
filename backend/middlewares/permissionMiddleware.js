// Middleware phân quyền (kiểm tra quyền của người dùng)
module.exports = (requiredPermission) => {
    return (req, res, next) => {
        // Kiểm tra quyền từ req.user.permissions
        if (req.user && req.user.permissions.includes(requiredPermission)) {
            return next();
        } else {
            return res.status(403).json({ message: 'Cấm!' });
        }
    };
};
