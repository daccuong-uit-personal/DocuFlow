// Logic nghiệp vụ cho người dùng

const User = require('../models/User');
const Department = require('../models/Department');

// Xử lý các thao tác với người dùng

exports.getUsers = async (queryOptions) => {
    try {
        const {
            searchText,
            userName,
            departmentID,
            role,
            gender,
            isLocked,
        } = queryOptions;

        let query = {};

        // Lọc theo từ khóa tìm kiếm trên nhiều trường
        if (searchText) {
            const searchRegex = new RegExp(searchText, 'i');
            query.$or = [
                { userName: searchRegex },
                { name: searchRegex },
                { phoneNumber: searchRegex },
                { address: searchRegex },
            ];
        }

        // Lọc theo các trường cụ thể
        if (userName) {
            query.userName = new RegExp(userName, 'i');
        }
        if (departmentID) {
            query.departmentID = departmentID;
        }
        if (role) {
            query.role = role;
        }
        if (gender) {
            query.gender = gender;
        }
        if (isLocked) {
            query.isLocked = isLocked === 'true'; // Chuyển đổi chuỗi thành boolean
        }

        // Thực hiện truy vấn với populate để lấy thông tin chi tiết
        const users = await User.find(query)
            .populate('departmentID', 'name')
            .populate('role', 'name');

        return users;
    } catch (error) {
        console.error("Error searching and filtering users:", error);
        throw error;
    }
};

exports.getUserById = async (userId) => {
    try {
        const user = await User.findById(userId)
            .populate('departmentID', 'name')
            .populate('role', 'name');
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};

exports.updateUser = async (userId, updatedData) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found.');
        }

        if (updatedData.role) {
            if (user.roleName !== 'admin') {
                throw new Error('Chỉ admin mới có quyền chỉnh sửa vai trò của người dùng.');
            }
        }

        console.log(user.role.roleName);

        // Cập nhật thông tin người dùng
        Object.assign(user, updatedData);
        await user.save();

        return user;
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};

exports.deleteUser = async (userId) => {
    try {
        // Kiểm tra xem người dùng có phải là trưởng/phó phòng không
        const departments = await Department.find({
            $or: [
                { headOfDepartment: userId },
                { viceHeadOfDepartment: userId }
            ]
        });

        if (departments && departments.length > 0) {
            throw new Error('Cannot delete user. This user is currently a head or vice head of a department.');
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
    }
};
