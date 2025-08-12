const express = require('express');
const router = express.Router();
const controller = require('../controllers/roleController');
const { authenticateToken, authorizePermissions } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API quản lý vai trò
 */

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Tạo vai trò mới
 *     tags: [Roles]
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
 *                 example: Admin
 *               description:
 *                 type: string
 *                 example: Vai trò quản trị hệ thống
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user:create", "user:delete"]
 *     responses:
 *       201:
 *         description: Tạo thành công
 *   get:
 *     summary: Lấy danh sách vai trò
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách vai trò
 */
router.post('/', authenticateToken, authorizePermissions(['manage_roles']), controller.create);
router.get('/', authenticateToken, authorizePermissions(['manage_roles']), controller.getAll);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Lấy thông tin vai trò theo ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Thông tin vai trò
 *       404:
 *         description: Không tìm thấy vai trò
 *   put:
 *     summary: Cập nhật vai trò
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Quản trị viên
 *               description:
 *                 type: string
 *                 example: Vai trò có toàn quyền
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user:update", "document:delete"]
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy vai trò
 *   delete:
 *     summary: Xóa vai trò
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của vai trò
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy vai trò
 */
router.get('/:id', authenticateToken, authorizePermissions(['manage_roles']), controller.getById);
router.put('/:id', authenticateToken, authorizePermissions(['manage_roles']), controller.update);
router.delete('/:id', authenticateToken, authorizePermissions(['manage_roles']), controller.remove);

module.exports = router;
