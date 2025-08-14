// controllers/authController.js
const authService = require('../services/authService');

exports.login = async (req, res, next) => {
    try {
        const { userName, password } = req.body;
        const { user, token } = await authService.login(userName, password);

        res.status(200).json({ 
            message: 'Đăng nhập thành công',
            content: user,
            token
        });
    } catch (error) {
        next(error); // để errorHandler xử lý
    }
};

exports.logout = (req, res) => {
    res.status(200).json({ message: 'Đăng xuất thành công' });
};

exports.changePassword = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        await authService.changePassword(userId, oldPassword, newPassword);
        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        next(error);
    }
};

exports.registerUser = async (req, res, next) => {
    try {
        const newUser = await authService.register(req.body);
        res.status(201).json({
            message: 'Đăng ký thành công',
            user: {
                _id: newUser._id,
                userName: newUser.userName,
                name: newUser.name,
                gender: newUser.gender,
                phoneNumber: newUser.phoneNumber,
                dayOfBirth: newUser.dayOfBirth,
                role: newUser.role,
                departmentID: newUser.departmentID
            }
        });
    } catch (error) {
        next(error);
    }
};
