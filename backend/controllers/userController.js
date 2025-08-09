// Xử lý các thao tác với người dùng (create, update, delete, get)

const UserService = require("../services/userService");
const path = require('path');
const fs = require('fs');

exports.getUsers = async (req, res) => {
    try {
        const queryOptions = req.query;
        const users = await UserService.getUsers(queryOptions);
        res.status(200).json(users);
    } catch (error) {
        console.error("Lỗi trong controller getUsers:", error);
        res.status(500).json({ message: "Lỗi máy chủ khi lấy danh sách người dùng.", error: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await UserService.getUserById(req.params.id);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const requester = req.user;

        const user = await UserService.updateUser(userId, req.body, requester);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const requester = req.user;

        const user = await UserService.updateProfile(userId, req.body, requester);
        return res.status(200).json({ user });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        await UserService.deleteUser(req.params.id);
        return res.status(200).json({ message: "Xóa người dùng thành công!" });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

exports.transferUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { newDepartmentID } = req.body;
        const requester = req.user;

        const updatedUser = await UserService.transferUser(userId, newDepartmentID, requester);
        return res.status(200).json({ message: 'Chuyển phòng ban thành công.', user: updatedUser });
    } catch (error) {
        console.error("Lỗi khi chuyển nhân sự:", error);
        return res.status(400).json({ error: error.message });
    }
};

exports.uploadAvatar = async (req, res) => {
    try {
        const userId = req.params.id;

        console.log('Upload avatar request for user:', userId);
        console.log('File info:', req.file);

        if (!req.file) {
            return res.status(400).json({ error: 'Không có file ảnh được upload!' });
        }

        // Lấy thông tin user hiện tại để xóa ảnh cũ
        const currentUser = await UserService.getUserById(userId);

        // Xóa ảnh cũ nếu có (không phải ảnh mặc định)
        if (currentUser.avatar && !currentUser.avatar.includes('default-avatar')) {
            const oldAvatarPath = path.join(__dirname, '..', currentUser.avatar);
            if (fs.existsSync(oldAvatarPath)) {
                try {
                    fs.unlinkSync(oldAvatarPath);
                    console.log('Deleted old avatar:', oldAvatarPath);
                } catch (deleteError) {
                    console.log('Could not delete old avatar:', deleteError.message);
                }
            }
        }

        // Cập nhật đường dẫn ảnh mới
        const avatarPath = `uploads/avatars/${req.file.filename}`;
        const updatedUser = await UserService.updateUserAvatar(userId, avatarPath);

        console.log('Avatar updated successfully:', avatarPath);

        return res.status(200).json({
            message: 'Upload ảnh đại diện thành công!',
            user: updatedUser,
            avatarUrl: `${req.protocol}://${req.get('host')}/${avatarPath}`
        });
    } catch (error) {
        console.error("Lỗi khi upload avatar:", error);

        // Xóa file đã upload nếu có lỗi
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', 'avatars', req.file.filename);
            if (fs.existsSync(filePath)) {
                try {
                    fs.unlinkSync(filePath);
                    console.log('Cleaned up uploaded file after error');
                } catch (cleanupError) {
                    console.log('Could not cleanup file:', cleanupError.message);
                }
            }
        }

        return res.status(500).json({ error: error.message || 'Có lỗi xảy ra khi upload ảnh' });
    }
};

exports.deleteAvatar = async (req, res) => {
    try {
        const userId = req.params.id;

        // Lấy thông tin user hiện tại
        const currentUser = await UserService.getUserById(userId);

        // Xóa ảnh hiện tại nếu có (không phải ảnh mặc định)
        if (currentUser.avatar && !currentUser.avatar.includes('default-avatar')) {
            const avatarPath = path.join(__dirname, '..', currentUser.avatar);
            if (fs.existsSync(avatarPath)) {
                fs.unlinkSync(avatarPath);
            }
        }

        // Reset về ảnh mặc định
        const updatedUser = await UserService.updateUserAvatar(userId, null);

        return res.status(200).json({
            message: 'Xóa ảnh đại diện thành công!',
            user: updatedUser
        });
    } catch (error) {
        console.error("Lỗi khi xóa avatar:", error);
        return res.status(400).json({ error: error.message });
    }
};

// Thêm controller mới để toggle lock status
exports.toggleLockStatus = async (req, res) => {
    try {
        const userId = req.params.id;
        const requester = req.user;

        const updatedUser = await UserService.toggleUserLockStatus(userId, requester);

        const action = updatedUser.isLocked ? 'Khóa' : 'Mở khóa';
        return res.status(200).json({
            message: `${action} tài khoản thành công!`,
            user: updatedUser
        });
    } catch (error) {
        console.error("Lỗi khi toggle lock status:", error);
        return res.status(400).json({ error: error.message });
    }
};