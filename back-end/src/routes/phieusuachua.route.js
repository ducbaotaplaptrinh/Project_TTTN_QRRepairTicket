const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/phieusuachua.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');
const { check } = require('express-validator');
const rateLimit = require('express-rate-limit');

const submitLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 phút
    max: 10, // Tối đa 10 yêu cầu
    message: { success: false, message: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau 10 phút!' }
});

const validateSubmit = [
    check('fullName').isLength({ max: 100 }).withMessage('Tên không được vượt quá 100 ký tự'),
    check('phone').isLength({ max: 20 }).withMessage('Số điện thoại không hợp lệ'),
    check('issueDescription').isLength({ max: 1000 }).withMessage('Mô tả lỗi quá dài')
];

// 1. Tạo Phiên QR (Session) mới (Lễ tân dùng)
router.post('/init-session', verifyToken, requireRole('RECEPTIONIST', 'ADMIN'), ticketController.initSession);

// 2. Kiểm tra Token khi quét QR (Khách hàng dùng)
router.get('/session/:token', ticketController.checkSession);

// 3. Khách hàng bấm gửi Form (Nộp yêu cầu)
router.post('/session/:token/submit', submitLimiter, validateSubmit, ticketController.submitSession);

module.exports = router;
