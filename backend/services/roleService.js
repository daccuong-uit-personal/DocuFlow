// Logic nghiệp vụ cho vai trò
const Role = require('../models/Roles');

exports.createRole = async (data) => {
    const role = new Role(data);
    return await role.save();
}
exports.getRole = async (filter = {}) => {
    return await Role.find(filter).populate('permissions').sort({ name: 1 });
};

exports.getRoleById = async (id) => {
    return await Role.findById(id).populate('permissions');
};

exports.updateRole = async (id, data) => {
    return await Role.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteRole = async (id) => {
    return await Role.findByIdAndDelete(id);
};