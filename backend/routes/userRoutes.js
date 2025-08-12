// Các route liên quan đến người dùng (/api/users)

const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserById,
    updateUser,
    updateProfile,
    deleteUser,
    transferUser,
    uploadAvatar,
    deleteAvatar,
    toggleLockStatus
} = require("../controllers/userController");

const { authenticateToken, authorizePermissions } = require("../middlewares/authMiddleware");
const avatarUpload = require("../middlewares/avatarUploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Quản lý người dùng
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Lấy danh sách người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: searchText
 *         schema:
 *           type: string
 *         description: Từ khóa tìm kiếm
 *     responses:
 *       200:
 *         description: Thành công
 */
router.route("/").get(authenticateToken, authorizePermissions(['user:read']), getUsers);
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Lấy thông tin người dùng theo ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thành công
 */
router.route("/:id").get(authenticateToken, authorizePermissions(['user:read']), getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: Nguyễn Văn A
 *               email: a@example.com
 *               role: user
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.route("/:id").put(authenticateToken, authorizePermissions(['user:update']), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.route("/:id").delete(authenticateToken, authorizePermissions(['user:delete']), deleteUser);

/**
 * @swagger
 * /api/users/transfer/{id}:
 *   put:
 *     summary: Chuyển người dùng sang phòng ban khác
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               newDepartmentId: "64f3a8d42a1b23f7d3a5a1b9"
 *     responses:
 *       200:
 *         description: Chuyển thành công
 */
router.route("/transfer/:id").put(authenticateToken, authorizePermissions(['user:transfer']), transferUser);

/**
 * @swagger
 * /api/users/{id}/profile:
 *   put:
 *     summary: Cập nhật hồ sơ cá nhân
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               phone: "0987654321"
 *               address: "Hà Nội"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 */
router.route("/:id/profile").put(authenticateToken, updateProfile);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   post:
 *     summary: Upload ảnh đại diện
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: formData
 *         name: avatar
 *         type: file
 *         description: File ảnh
 *     responses:
 *       200:
 *         description: Upload thành công
 */
router.route("/:id/avatar").post(
    authenticateToken,
    authorizePermissions(['user:update']),
    avatarUpload.single('avatar'),
    uploadAvatar
);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   delete:
 *     summary: Xóa ảnh đại diện
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.route("/:id/avatar").delete(
    authenticateToken,
    authorizePermissions(['user:update']),
    deleteAvatar
);

/**
 * @swagger
 * /api/users/{id}/toggle-lock:
 *   put:
 *     summary: Khóa/Mở khóa tài khoản người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thay đổi trạng thái thành công
 */
router.route("/:id/toggle-lock").put(
    authenticateToken,
    authorizePermissions(['user:update']),
    toggleLockStatus
);

module.exports = router;