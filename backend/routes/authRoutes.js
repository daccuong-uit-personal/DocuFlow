// Các route liên quan đến xác thực (/api/auth/login)

const express = require('express');
const { login, logout, registerUser, changePassword } = require('../controllers/authController');
const isAuthenticated = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/login').post(login);
router.route('/register').post(registerUser);
router.route('/logout').post(logout);
router.route('/change-password').put(isAuthenticated, changePassword);

module.exports = router;