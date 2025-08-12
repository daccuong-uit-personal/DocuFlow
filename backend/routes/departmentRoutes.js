// Các route liên quan đến phòng ban

const express = require('express');
const { createDepartment, getAllDepartments, getDepartmentById, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { authenticateToken, authorizePermissions } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Quản lý phòng ban
 */

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Tạo phòng ban mới
 *     tags: [Departments]
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
 *                 example: Phòng Kế toán
 *               description:
 *                 type: string
 *                 example: Quản lý tài chính và kế toán
 *     responses:
 *       201:
 *         description: Tạo phòng ban thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/', authenticateToken, authorizePermissions(['department:create']), createDepartment);

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Lấy danh sách tất cả phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm phòng ban
 *     responses:
 *       200:
 *         description: Danh sách phòng ban
 */
router.get('/', authenticateToken, authorizePermissions(['department:read']), getAllDepartments);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng ban
 *     responses:
 *       200:
 *         description: Thông tin phòng ban
 *       404:
 *         description: Không tìm thấy phòng ban
 */
router.get('/:id', authenticateToken, authorizePermissions(['department:read']), getDepartmentById);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Cập nhật thông tin phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng ban
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Phòng Hành chính
 *               description:
 *                 type: string
 *                 example: Quản lý nhân sự và hành chính
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       404:
 *         description: Không tìm thấy phòng ban
 */
router.put('/:id', authenticateToken, authorizePermissions(['department:update']), updateDepartment);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Xóa phòng ban
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của phòng ban
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy phòng ban
 */
router.delete('/:id', authenticateToken, authorizePermissions(['department:delete']), deleteDepartment);

module.exports = router;
