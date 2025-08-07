// Middleware xác thực người dùng (kiểm tra JWT token)

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/config');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ message: 'Không có token xác thực. Vui lòng đăng nhập.' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err)
            return res.status(403).json({ message: 'Token không hợp lệ hoặc hết hạn. Vui lòng đăng nhập lại.' });
        req.user = user;
        next();
    });
}

const authorizePermissions = (requiredPermissions) => {
    return (req, res, next) => {
        const userPermissions = req.user.permissions || [];

        const hasRequiredPermissions = requiredPermissions.every(perm => userPermissions.includes(perm));

        if (!hasRequiredPermissions) {
            return res.status(403).json({ message: 'Bạn không có đủ quyền để thực hiện hành động này.' });
        }

        next();
    };
};

module.exports = {
    authenticateToken,
    authorizePermissions
};