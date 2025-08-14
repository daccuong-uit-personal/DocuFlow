// services/authService.js
const { JWT_SECRET } = require('../config/config');
const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const jwt = require('jsonwebtoken');
const BusinessError = require('../utils/BusinessError');

exports.login = async (userName, password) => {
    const user = await User.findOne({ userName })
        .select('+password')
        .populate({
            path: 'role',
            populate: {
                path: 'permissions',
                model: 'Permission'
            }
        })
        .populate('departmentID');

    if (!user) {
        throw new BusinessError('Tên đăng nhập hoặc mật khẩu không đúng.', 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new BusinessError('Tên đăng nhập hoặc mật khẩu không đúng.', 401);
    }

    if (user.isLocked) {
        throw new BusinessError('Tài khoản này đã bị khóa!', 403);
    }

    const permissions = user.role.permissions.map(perm => perm.name);

    const payload = {
        id: user._id,
        username: user.userName,
        roleId: user.role.id,
        roleName: user.role.name,
        roleDescription: user.role.description,
        permissions
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '10h' });

    // Cập nhật lastLogin
    user.lastLogin = new Date();
    await user.save();

    user.password = undefined;
    return { user, token };
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
    const user = await User.findById(userId).select('+password');
    if (!user) {
        throw new BusinessError('Người dùng không tồn tại.', 404);
    }

    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
        throw new BusinessError('Mật khẩu cũ không đúng.', 400);
    }

    const isSameAsOld = await comparePassword(newPassword, user.password)
    if (isSameAsOld) {
        throw new BusinessError('Mật khẩu mới không được trùng mật khẩu cũ.', 400);
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    return { message: 'Đổi mật khẩu thành công' };
};

exports.register = async (data) => {
    const existingUser = await User.findOne({ userName: data.userName });
    if (existingUser) {
        throw new BusinessError('Tên đăng nhập đã tồn tại', 400);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = new User({
        ...data,
        password: hashedPassword
    });

    return await user.save();
};
