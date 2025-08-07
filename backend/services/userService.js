// Logic nghiệp vụ cho người dùng

const User = require('../models/User');
const Department = require('../models/Department');
const Role  = require('../models/Roles');

// Xử lý các thao tác với người dùng

exports.getUsers = async (queryOptions) => {
    try {
        const {
            searchText,
            userName,
            departmentID,
            gender,
            role,
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
        if (gender) {
            query.gender = gender;
        }
        if (isLocked) {
            query.isLocked = isLocked === 'true';
        }
        if (role) {
            const foundRole = await Role.findOne({ name: role });
            if (foundRole) {
                query.role = foundRole._id;
            } else {
                query.role = null; 
            }
        }
        
        if (departmentID) {
            const foundDepartment = await Department.findOne({ name: departmentID });
            if (foundDepartment) {
                query.departmentID = foundDepartment._id;
            } else {
                query.departmentID = null;
            }
        }

        // Thực hiện truy vấn với populate để lấy thông tin chi tiết
        const users = await User.find(query)
            .populate('departmentID', 'name headOfDepartment viceHeadOfDepartment')
            .populate('role', 'name description');

        return users;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm và lọc người dùng:", error);
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
        console.error("Lỗi khi tìm kiếm người dùng theo ID:", error);
        throw error;
    }
};

exports.updateUser = async (userId, updatedData) => {
    try {
        const user = await User.findById(userId).populate('role').populate('departmentID');
        if (!user) {
            throw new Error('Không tìm thấy người dùng!');
        }

        if (updatedData.role) {
            if (user.roleName !== 'admin') {
                throw new Error('Chỉ admin mới có quyền chỉnh sửa vai trò của người dùng.');
            }
        }

        // Cập nhật thông tin người dùng
        Object.assign(user, updatedData);
        await user.save();

        return user;
    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error);
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
            throw new Error('Không thể xóa người dùng! Người dùng này hiện là trưởng hoặc phó phòng ban!');
        }

        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('Không tìm thấy người dùng!');
        }
        return user;
    } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        throw error;
    }
};

exports.transferUser = async (userId, newDepartmentID, requester) => {
    try {
        // Kiểm tra người dùng cần chuyển
        const user = await User.findById(userId);
        if (!user) throw new Error("Không tìm thấy người dùng cần chuyển.");

        // Kiểm tra phòng ban mới có tồn tại không
        const department = await Department.findById(newDepartmentID);
        if (!department) throw new Error("Phòng ban đích không tồn tại.");

        // Kiểm tra xem người dùng có phải trưởng/phó phòng không
        const isHeadOrVice = await Department.findOne({
            $or: [
                { headOfDepartment: userId },
                { viceHeadOfDepartment: userId }
            ]
        });

        if (isHeadOrVice) {
            throw new Error("Không thể chuyển người dùng vì họ đang là trưởng hoặc phó phòng.");
        }

        // Cập nhật phòng ban mới
        user.departmentID = newDepartmentID;
        user.updateAt = new Date();
        await user.save();

        return user;
    } catch (error) {
        console.error("Error transferring user:", error);
        throw error;
    }
};
