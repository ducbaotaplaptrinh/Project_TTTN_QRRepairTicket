const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Lấy token từ Header: "Authorization: Bearer <token>"
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Access Denied: Không tìm thấy Token xác thực!' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied: Định dạng Token không hợp lệ!' });
    }

    try {
        // Giải mã token
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Lưu thông tin người dùng vào request để các hàm sau sử dụng
        next(); // Cho phép đi tiếp
    } catch (err) {
        res.status(403).json({ success: false, message: 'Invalid Token: Token sai hoặc đã hết hạn!' });
    }
};

// Middleware kiểm tra quyền hạn (Role)
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.Role)) {
            return res.status(403).json({ success: false, message: 'Forbidden: Bạn không có quyền truy cập API này!' });
        }
        next();
    };
};

module.exports = {
    verifyToken,
    requireRole
};
