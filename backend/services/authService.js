// Logic nghiệp vụ cho xác thực

const User = require('../models/User');
const { hashPassword, comparePassword } = require('../utils/hashPassword');

exports.login = async (userName, password) => {
    try {
        const user = await User.findOne({ userName }).select('+password');
        if (!user) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
        }

        user.password = undefined;
        return user;
    } catch (error) {
        console.error("Lỗi khi đăng nhập:", error.message);
        throw new Error(error.message);
    }
};

exports.changePassword = async (userId, oldPassword, newPassword) => {
    try {
        const user = await User.findById(userId).select('+password');
        if (!user) {
            throw new Error('Người dùng không tồn tại.');
        }

        const isMatch = await comparePassword(oldPassword, user.password);
        if (!isMatch) {
            throw new Error('Mật khẩu cũ không đúng.');
        }

        const hashedNewPassword = await hashPassword(newPassword);

        user.password = hashedNewPassword;
        await user.save();

        console.log(`Mật khẩu của người dùng ${user.username} đã được đổi thành công.`);
    } catch (error) {
        console.error("Lỗi khi đổi mật khẩu:", error.message);
        throw new Error(error.message);
    }
};

exports.register = async (data) => {
    try {
        const existingUser = await User.findOne({ userName: data.userName });
        if (existingUser) {
            throw new Error('Tên đăng nhập đã tồn tại');
        }

        const hashedPassword = await hashPassword(data.password);
        const user = new User({
            ...data,
            password: hashedPassword
        });

        return await user.save();
    } catch (error) {
        throw new Error(error.message);
    }
}