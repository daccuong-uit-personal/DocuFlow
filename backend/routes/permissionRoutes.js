const express = require('express');
const router = express.Router();
const controller = require('../controllers/permissionController');
const { authenticateToken, authorizePermissions } = require('../middlewares/authMiddleware');

// Chỉ có thằng có quyền 'manage_permissions' mới có thể truy cập các route này
router.post('/', authenticateToken, authorizePermissions(['manage_permissions']), controller.create);
router.get('/', authenticateToken, authorizePermissions(['manage_permissions']), controller.getAll);
router.get('/:id', authenticateToken, authorizePermissions(['manage_permissions']), controller.getById);
router.put('/:id', authenticateToken, authorizePermissions(['manage_permissions']), controller.update);
router.delete('/:id', authenticateToken, authorizePermissions(['manage_permissions']), controller.remove);

module.exports = router;
