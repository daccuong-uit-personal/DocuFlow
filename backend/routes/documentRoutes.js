const express = require("express");
const router = express.Router();

const {
    createDocument,
    getDocumentById,
    updateDocument,
    updateDocumentWithFiles,
    deleteDocument,
    getDocuments,
    deleteManyDocuments,
    forwardProcessDocuments,
    returnDocuments,
    markAsComplete,

} = require("../controllers/documentController");

const { authenticateToken, authorizePermissions } = require("../middlewares/authMiddleware");
const upload = require('../middlewares/uploadMiddleware');

/**
 * @swagger
 * tags:
 *   name: Documents
 *   description: API quản lý văn bản
 */

/**
 * @swagger
 * /api/documents:
 *   get:
 *     summary: Lấy danh sách văn bản
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách văn bản
 *   post:
 *     summary: Tạo văn bản mới
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Công văn số 123
 *               content:
 *                 type: string
 *                 example: Nội dung công văn...
 *               attachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Tạo thành công
 */
router.route("/").get(authenticateToken, authorizePermissions(['document:read']), getDocuments);
router.route("/").post(authenticateToken, authorizePermissions(['document:create']), upload.array('attachments', 10), createDocument);

/**
 * @swagger
 * /api/documents/bulk-delete:
 *   delete:
 *     summary: Xóa nhiều văn bản
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["64cd2f9f8b3f1f001f0eabcd", "64cd2f9f8b3f1f001f0eabce"]
 *     responses:
 *       200:
 *         description: Xóa thành công
 */
router.route('/bulk-delete').delete(authenticateToken, authorizePermissions(['document:delete']), deleteManyDocuments);

/**
 * @swagger
 * /api/documents/{id}:
 *   get:
 *     summary: Lấy thông tin văn bản theo ID
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID văn bản
 *     responses:
 *       200:
 *         description: Thông tin văn bản
 *   put:
 *     summary: Cập nhật văn bản
 *     tags: [Documents]
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
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *   delete:
 *     summary: Xóa văn bản
 *     tags: [Documents]
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
router.route("/:id").get(authenticateToken, authorizePermissions(['document:read']), getDocumentById);
router.route("/:id").put(authenticateToken, authorizePermissions(['document:update']), updateDocument);
router.route("/:id").delete(authenticateToken, authorizePermissions(['document:delete']), deleteDocument);

// Route để cập nhật document với file upload
router.route("/:id/update-with-files").put(
    authenticateToken,
    authorizePermissions(['document:update']),
    upload.array('attachments', 10),
    updateDocumentWithFiles
);

/**
 * @swagger
 * /api/documents/process:
 *   post:
 *     summary: Giao xử lý văn bản
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documentIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               processors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Giao xử lý thành công
 */
router.route("/process").post(authenticateToken, authorizePermissions(['document:forward']), forwardProcessDocuments);

/**
 * @swagger
 * /api/documents/return:
 *   post:
 *     summary: Trả lại văn bản
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 */
router.route("/return").post(authenticateToken, authorizePermissions(['document:return']), returnDocuments);

/**
 * @swagger
 * /api/documents/complete:
 *   post:
 *     summary: Đánh dấu văn bản đã hoàn thành
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 */
router.route("/complete").post(authenticateToken, authorizePermissions(['document:complete']), markAsComplete);

module.exports = router;
