const ticketService = require('../services/ticket.service');
const { validationResult } = require('express-validator');

// Lễ tân bấm tạo phiên quét QR
const initSession = async (req, res, next) => {
    try {
        const data = await ticketService.initSession();
        res.status(200).json({
            success: true,
            data: {
                ticketId: data.ticketId,
                ticketCode: data.ticketCode,
                sessionToken: data.sessionToken,
                qrImage: data.qrImage,
                expiresAt: new Date(Date.now() + 15 * 60000).toISOString()
            }
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
            return res.status(404).json({ 
                success: false, 
                errorCode: "SESSION_EXPIRED_OR_NOT_FOUND",
                message: "Mã QR đã hết hạn hoặc không tồn tại!" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Phiên hợp lệ, cho phép mở form tiếp nhận",
            data: { 
                ticketCode: session.TicketCode, 
                sessionStatus: session.Status,
                expiresAt: session.ExpiresAt
            }
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
            return res.status(400).json({ 
                success: false, 
                errorCode: "VALIDATION_ERROR",
                message: "Số điện thoại không hợp lệ hoặc thiếu mô tả lỗi!",
                errors: errors.array()
            });
        }

        const { token } = req.params;
        const { fullName, phone, email, issueDescription, deviceName } = req.body;
        
        if (!fullName || !phone || !issueDescription) {
            return res.status(400).json({ 
                success: false, 
                errorCode: "VALIDATION_ERROR",
                message: "Số điện thoại không hợp lệ hoặc thiếu mô tả lỗi!" 
            });
        }

        const result = await ticketService.submitSession(token, req.body);
        
        res.status(201).json({
            success: true,
            message: "Gửi yêu cầu tiếp nhận sửa chữa thành công!",
            data: {
                ticketCode: result.ticketCode,
                status: "PENDING",
                submittedAt: new Date().toISOString()
            }
        });
    } catch (error) {
        // Bắt riêng lỗi hết hạn
        if (error.message.includes("hết hạn") || error.message.includes("không hợp lệ")) {
            return res.status(400).json({ 
                success: false, 
                errorCode: "SESSION_INVALID",
                message: error.message 
            });
        }
        next(error);
    }
};

module.exports = {
    initSession,
    checkSession,
    submitSession
};
