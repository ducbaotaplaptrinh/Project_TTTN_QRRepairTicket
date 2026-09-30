const ticketService = require('../services/phieusuachua.service');
const { validationResult } = require('express-validator');

// Lễ tân bấm tạo phiên quét QR
const initSession = async (req, res, next) => {
    try {
        const data = await ticketService.initSession();
        res.status(200).json({
            success: true,
            data: data
        });
    } catch (error) {
        next(error);
    }
};

// Khách hàng quét mã xong, Front-end gọi kiểm tra Token
const checkSession = async (req, res, next) => {
    try {
        const { token } = req.params;
        const session = await ticketService.checkSession(token);
        
        if (!session) {
            return res.status(404).json({ success: false, message: "Mã QR đã hết hạn hoặc không tồn tại!" });
        }

        res.status(200).json({
            success: true,
            data: { ticketCode: session.TicketCode, status: session.Status }
        });
    } catch (error) {
        next(error);
    }
};

// Khách hàng điền Form và Bấm gửi
const submitSession = async (req, res, next) => {
    try {
        // Kiểm tra lỗi Validation trước
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array()[0].msg });
        }

        const { token } = req.params;
        const { fullName, phone, email, issueDescription, deviceName } = req.body;
        
        if (!fullName || !phone || !issueDescription) {
            return res.status(400).json({ success: false, message: "Vui lòng điền đủ Tên, SĐT và Mô tả lỗi." });
        }

        const result = await ticketService.submitSession(token, req.body);
        
        res.status(200).json({
            success: true,
            message: "Gửi Yêu cầu bảo hành thành công!",
            data: result
        });
    } catch (error) {
        // Bắt riêng lỗi hết hạn
        if (error.message.includes("hết hạn")) {
            return res.status(400).json({ success: false, message: error.message });
        }
        next(error);
    }
};

module.exports = {
    initSession,
    checkSession,
    submitSession
};
