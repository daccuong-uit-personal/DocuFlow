// Các route liên quan đến xác thực (/api/auth/login)

const express = require('express');
const { login, logout, registerUser, changePassword } = require('../controllers/authController');
const { authenticateToken, authorizePermissions } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(authenticateToken, authorizePermissions(['user:create']), registerUser);
router.route('/logout').post(authenticateToken, logout);
router.route('/change-password').put(authenticateToken, changePassword);

module.exports = router;