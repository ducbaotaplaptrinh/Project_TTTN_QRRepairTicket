const authService = require('../services/taikhoan.service');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập tài khoản và mật khẩu" });
        }

        const account = await authService.login(username, password);

        if (!account) {
            return res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
        }

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            data: account
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login
};
