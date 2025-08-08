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
    deleteAvatar
} = require("../controllers/userController");

const { authenticateToken, authorizePermissions } = require("../middlewares/authMiddleware");
const avatarUpload = require("../middlewares/avatarUploadMiddleware");

router.route("/").get(authenticateToken, authorizePermissions(['user:read']), getUsers);
router.route("/:id").get(authenticateToken, authorizePermissions(['user:read']), getUserById);
router.route("/:id").put(authenticateToken, authorizePermissions(['user:update']), updateUser);
router.route("/:id").delete(authenticateToken, authorizePermissions(['user:delete']), deleteUser);
router.route("/transfer/:id").put(authenticateToken, authorizePermissions(['user:transfer']), transferUser);

router.route("/:id/profile").put(authenticateToken, updateProfile);

router.route("/:id/avatar").post(
    authenticateToken,
    authorizePermissions(['user:update']),
    avatarUpload.single('avatar'),
    uploadAvatar
);
router.route("/:id/avatar").delete(
    authenticateToken,
    authorizePermissions(['user:update']),
    deleteAvatar
);

module.exports = router;