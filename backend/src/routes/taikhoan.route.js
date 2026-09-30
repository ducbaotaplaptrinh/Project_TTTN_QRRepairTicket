const express = require('express');
const router = express.Router();
const authController = require('../controllers/taikhoan.controller');
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 5, // Tối đa 5 lần đăng nhập sai (hoặc gọi API)
    message: { success: false, message: 'Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau 15 phút!' }
});

// URL: POST /api/auth/login
router.post('/login', loginLimiter, authController.login);

module.exports = router;
