// Xử lý các thao tác với người dùng (create, update, delete, get)

const UserService = require("../services/userService");

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
