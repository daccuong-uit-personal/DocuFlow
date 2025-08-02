// Xử lý các thao tác với quyền hạn
const permissionService = require('../services/permissionService');

exports.create = async (req, res) => {
    try {
        const permission = await permissionService.createPermission(req.body);
        res.status(201).json(permission);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAll = async (req, res) => {
    try {
        const permissions = await permissionService.getPermissions();
        res.json(permissions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getById = async (req, res) => {
    try {
        const permission = await permissionService.getPermissionById(req.params.id);
        if (!permission) return res.status(404).json({ message: 'Không tìm thấy quyền đó!' });
        res.json(permission);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const updated = await permissionService.updatePermission(req.params.id, req.body);
        if (!updated) return res.status(404).json({ message: 'Không tìm thấy quyền đó!' });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await permissionService.deletePermission(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Không tìm thấy quyền đó!' });
        res.json({ message: 'Xóa quyền thành công!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
