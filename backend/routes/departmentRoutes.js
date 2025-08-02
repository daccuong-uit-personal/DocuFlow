// Các route liên quan đến phòng ban

const express = require('express');
const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { authenticateToken, authorizePermissions } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authenticateToken, authorizePermissions(['department:create']), createDepartment);
router.get('/', authenticateToken, authorizePermissions(['department:read']), getAllDepartments);
router.get('/:id', authenticateToken, authorizePermissions(['department:read']), getDepartmentById);
router.put('/:id', authenticateToken, authorizePermissions(['department:update']), updateDepartment);
router.delete('/:id', authenticateToken, authorizePermissions(['department:delete']), deleteDepartment);

module.exports = router;