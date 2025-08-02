// Xử lý logic đăng nhập, đăng ký

const { login, changePassword } = require('../services/authService');

const authService = require('../services/authService');

exports.login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const {user, token} = await authService.login(userName, password);

        res.status(200).json({ 
            message: 'Đăng nhập thành công',
            content: user, token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.logout = (req, res) => {
    // Logic đăng xuất sẽ được xử lý ở client bằng cách xóa token
    res.status(200).json({ message: 'Đăng xuất thành công' });
};

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        await authService.changePassword(userId, oldPassword, newPassword);
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