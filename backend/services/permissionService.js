// Logic nghiệp vụ cho quyền hạn
const Permission = require('../models/Permission');

exports.createPermission = async (data) => {
    const permission = new Permission(data);
    return await permission.save();
};

exports.getPermissions = async (filter = {}) => {
    return await Permission.find(filter).sort({ name: 1 });
};

exports.getPermissionById = async (id) => {
    return await Permission.findById(id);
};

exports.updatePermission = async (id, data) => {
    return await Permission.findByIdAndUpdate(id, data, { new: true });
};

exports.deletePermission = async (id) => {
    return await Permission.findByIdAndDelete(id);
};
