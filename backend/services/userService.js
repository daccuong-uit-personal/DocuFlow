// Logic nghiệp vụ cho người dùng

const User = require('../models/User');
const Department = require('../models/Department');
const Role = require('../models/Roles');

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
            .populate('role', 'name description');
        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm người dùng theo ID:", error);
        throw error;
    }
};

exports.updateUser = async (userId, updatedData, requester) => {
    try {
        // Validate dữ liệu đầu vào
        if (!updatedData.name || !updatedData.name.trim()) {
            throw new Error('Tên cán bộ không được để trống.');
        }
        if (!updatedData.phoneNumber || !updatedData.phoneNumber.trim()) {
            throw new Error('Số điện thoại không được để trống.');
        }
        if (!updatedData.dayOfBirth) {
            throw new Error('Ngày sinh không được để trống.');
        }
        if (!updatedData.gender) {
            throw new Error('Giới tính không được để trống.');
        }
        if (!updatedData.role) {
            throw new Error('Vai trò không được để trống.');
        }
        if (!updatedData.departmentID) {
            throw new Error('Phòng ban không được để trống.');
        }

        const user = await User.findById(userId).populate('role').populate('departmentID');
        if (!user) {
            throw new Error('Không tìm thấy người dùng!');
        }

        // Kiểm tra vai trò và phòng ban có tồn tại không
        const [roleExists, departmentExists] = await Promise.all([
            Role.findById(updatedData.role),
            Department.findById(updatedData.departmentID)
        ]);

        if (!roleExists) {
            throw new Error('Vai trò không tồn tại.');
        }
        if (!departmentExists) {
            throw new Error('Phòng ban không tồn tại.');
        }

        // Kiểm tra quyền chỉnh sửa vai trò (chỉ admin mới được thay đổi vai trò)
        if (requester && updatedData.role !== user.role._id.toString()) {
            const requesterUser = await User.findById(requester.id).populate('role');
            if (!requesterUser || requesterUser.role?.name !== 'admin') {
                throw new Error('Chỉ admin mới có quyền chỉnh sửa vai trò của người dùng.');
            }
        }

        // Chuẩn bị dữ liệu để cập nhật
        const updateFields = {
            name: updatedData.name.trim(),
            gender: updatedData.gender,
            phoneNumber: updatedData.phoneNumber.trim(),
            dayOfBirth: new Date(updatedData.dayOfBirth),
            address: updatedData.address ? updatedData.address.trim() : '',
            role: updatedData.role,
            departmentID: updatedData.departmentID,
            updateAt: new Date()
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true })
            .populate('role', 'name description')
            .populate('departmentID', 'name');

        if (!updatedUser) {
            throw new Error('Cập nhật người dùng thất bại.');
        }

        return updatedUser;
    } catch (error) {
        console.error("Lỗi khi cập nhật người dùng:", error);
        throw error;
    }
};

exports.updateProfile = async (userId, updatedData, requester) => {
    try {
        // Validate dữ liệu đầu vào - chỉ validate các trường có thể chỉnh sửa
        if (!updatedData.name || !updatedData.name.trim()) {
            throw new Error('Tên cán bộ không được để trống.');
        }
        if (!updatedData.phoneNumber || !updatedData.phoneNumber.trim()) {
            throw new Error('Số điện thoại không được để trống.');
        }

        const user = await User.findById(userId).populate('role').populate('departmentID');
        if (!user) {
            throw new Error('Không tìm thấy người dùng!');
        }

        // Kiểm tra quyền cập nhật (chỉ cho phép user cập nhật profile của chính mình hoặc admin)
        if (requester && requester.id !== userId) {
            const requesterUser = await User.findById(requester.id).populate('role');
            if (!requesterUser || requesterUser.role?.name !== 'admin') {
                throw new Error('Bạn chỉ có thể cập nhật profile của chính mình.');
            }
        }

        // Chuẩn bị dữ liệu để cập nhật - chỉ các trường được phép
        const updateFields = {
            name: updatedData.name.trim(),
            phoneNumber: updatedData.phoneNumber.trim(),
            address: updatedData.address ? updatedData.address.trim() : '',
            updateAt: new Date()
        };

        // Thêm các trường optional nếu có
        if (updatedData.gender) {
            updateFields.gender = updatedData.gender;
        }
        if (updatedData.dayOfBirth) {
            updateFields.dayOfBirth = new Date(updatedData.dayOfBirth);
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updateFields, { new: true })
            .populate('role', 'name description')
            .populate('departmentID', 'name');

        if (!updatedUser) {
            throw new Error('Cập nhật thông tin thất bại.');
        }

        return updatedUser;
    } catch (error) {
        console.error("Lỗi khi cập nhật profile:", error);
        throw error;
    }
};

exports.updateUserAvatar = async (userId, avatarPath) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('Không tìm thấy người dùng!');
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                avatar: avatarPath,
                updateAt: new Date()
            },
            { new: true }
        )
            .populate('role', 'name description')
            .populate('departmentID', 'name');

        if (!updatedUser) {
            throw new Error('Cập nhật ảnh đại diện thất bại.');
        }

        return updatedUser;
    } catch (error) {
        console.error("Lỗi khi cập nhật avatar:", error);
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

// Thêm hàm mới để toggle lock status
exports.toggleUserLockStatus = async (userId, requester) => {
    try {
        const user = await User.findById(userId).populate('role');
        if (!user) {
            throw new Error('Không tìm thấy người dùng!');
        }

        // Kiểm tra không được khóa tài khoản admin
        if (user.role?.name === 'admin') {
            throw new Error('Không thể khóa tài khoản admin!');
        }

        // Kiểm tra quyền thực hiện (chỉ admin mới được khóa/mở khóa tài khoản)
        if (requester) {
            const requesterUser = await User.findById(requester.id).populate('role');
            if (!requesterUser || requesterUser.role?.name !== 'admin') {
                throw new Error('Chỉ admin mới có quyền khóa/mở khóa tài khoản người dùng.');
            }
        }

        // Toggle trạng thái isLocked
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isLocked: !user.isLocked,
                updateAt: new Date()
            },
            { new: true }
        )
            .populate('role', 'name description')
            .populate('departmentID', 'name');

        if (!updatedUser) {
            throw new Error('Cập nhật trạng thái khóa thất bại.');
        }

        return updatedUser;
    } catch (error) {
        console.error("Lỗi khi toggle lock status:", error);
        throw error;
    }
};