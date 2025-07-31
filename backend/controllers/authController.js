// Xử lý logic đăng nhập, đăng ký

const { login, changePassword } = require('../services/authService');

const authService = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await login(userName, password);

        req.session.user = {
            id: user._id,
            userName: user.userName,
            name: user.name,
            role: user.role
        };

        res.status(200).json({ message: 'Đăng nhập thành công', user: req.session.user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Lỗi khi đăng xuất' });
        }
        res.status(200).json({ message: 'Đăng xuất thành công' });
    });
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.session.user.id;

        await changePassword(userId, oldPassword, newPassword);
        res.status(200).json({ message: 'Đổi mật khẩu thành công' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.registerUser = async (req, res) => {
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
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};