// Xử lý logic đăng nhập, đăng ký
const authService = require('../services/authService');

exports.login = async (req, res) => {
    const { userName, password } = req.body;

    if (!userName || !password) {
        return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập và mật khẩu' });
    }

    const user = await authService.login(userName, password);

    if (!user) {
        return res.status(401).json({ message: 'Sai tài khoản hoặc mật khẩu' });
    }

    // Lưu session
    req.session.user = {
        id: user._id,
        userName: user.userName,
        name: user.name,
        role: user.role
    };

    res.status(200).json({ message: 'Đăng nhập thành công', user: req.session.user });
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).json({ message: 'Không thể đăng xuất' });
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Đăng xuất thành công' });
    });
};

exports.changePassword = async (req, res) => {
    const userId = req.session?.user?.id;

    if (!userId) {
        return res.status(401).json({ message: 'Bạn chưa đăng nhập' });
    }

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Vui lòng nhập đủ mật khẩu cũ và mới' });
    }

    const user = await authService.login(req.session.user.userName, oldPassword);
    if (!user) {
        return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
    }

    await authService.changePassword(userId, newPassword);
    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
};
