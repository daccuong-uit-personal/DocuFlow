// Các route liên quan đến người dùng (/api/users)

const express = require("express");
const router = express.Router();

const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    transferUser
} = require("../controllers/userController");

const { authenticateToken, authorizePermissions } = require("../middlewares/authMiddleware");

router.route("/").get(authenticateToken, authorizePermissions(['user:read']), getUsers);
router.route("/:id").get(authenticateToken, authorizePermissions(['user:read']), getUserById);
router.route("/:id").put(authenticateToken, authorizePermissions(['user:update']), updateUser);
router.route("/:id").delete(authenticateToken, authorizePermissions(['user:delete']), deleteUser);
router.route("/transfer/:id").put(authenticateToken, authorizePermissions(['user:transfer']), transferUser);

module.exports = router;