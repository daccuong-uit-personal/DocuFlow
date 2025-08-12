const express = require('express');
const router = express.Router();
const controller = require('../controllers/permissionController');
const { authenticateToken, authorizePermissions } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API quản lý quyền hạn
 */

/**
 * @swagger
 * /api/permissions:
 *   post:
 *     summary: Tạo quyền mới
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: user:create
 *               description:
 *                 type: string
 *                 example: Quyền tạo người dùng mới
 *     responses:
 *       201:
 *         description: Tạo thành công
 *   get:
 *     summary: Lấy danh sách quyền
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách quyền
 */
router.post('/', authenticateToken, authorizePermissions(['manage_permissions']), controller.create);
router.get('/', authenticateToken, authorizePermissions(['manage_permissions']), controller.getAll);

/**
 * @swagger
 * /api/permissions/{id}:
 *   get:
 *     summary: Lấy thông tin quyền theo ID
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quyền
 *     responses:
 *       200:
 *         description: Thông tin quyền
 *       404:
 *         description: Không tìm thấy quyền
 *   put:
 *     summary: Cập nhật quyền
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quyền
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: document:update
 *               description:
 *                 type: string
 *                 example: Quyền chỉnh sửa tài liệu
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy quyền
 *   delete:
 *     summary: Xóa quyền
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của quyền
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy quyền
 */
router.get('/:id', authenticateToken, authorizePermissions(['manage_permissions']), controller.getById);
router.put('/:id', authenticateToken, authorizePermissions(['manage_permissions']), controller.update);
router.delete('/:id', authenticateToken, authorizePermissions(['manage_permissions']), controller.remove);

module.exports = router;
