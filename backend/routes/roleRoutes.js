// Các route liên quan đến vai trò (/api/roles)
const express = require('express');
const router = express.Router();
const controller = require('../controllers/roleController');
const { authenticateToken, authorizePermissions } = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, authorizePermissions(['manage_roles']), controller.create);
router.get('/', authenticateToken, authorizePermissions(['manage_roles']), controller.getAll);
router.get('/:id', authenticateToken, authorizePermissions(['manage_roles']), controller.getById);
router.put('/:id', authenticateToken, authorizePermissions(['manage_roles']), controller.update);
router.delete('/:id', authenticateToken, authorizePermissions(['manage_roles']), controller.remove);

module.exports = router;