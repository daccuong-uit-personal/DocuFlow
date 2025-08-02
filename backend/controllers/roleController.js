// Xử lý các thao tác với vai trò
const RoleService = require("../services/roleService");

exports.create = async (req, res) => {
    try {
        const role = await RoleService.createRole(req.body);
        res.status(201).json(role);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.getAll = async (req, res) => {
    try {
        const roles = await RoleService.getRole();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getById = async (req, res) => {
    try {
        const role = await RoleService.getRoleById(req.params.id);
        if (!role) return res.status(404).json({ message: 'Không tìm thấy vai trò đó!' });
        res.json(role);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.update = async (req, res) => {
    try {
        const updated = await RoleService.updateRole(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy vai trò đó!' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

exports.remove = async (req, res) => {
    try {
        const deleted = await RoleService.deleteRole(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy vai trò đó!' });
        res.json({ message: 'Xóa vai trò thành công!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}