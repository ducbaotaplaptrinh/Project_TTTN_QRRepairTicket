const authService = require('../services/account.service');

const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ 
                success: false, 
                errorCode: "VALIDATION_ERROR",
                message: "Vui lòng nhập tài khoản và mật khẩu" 
            });
        }

        const account = await authService.login(username, password);

        if (!account) {
            return res.status(401).json({ 
                success: false, 
                errorCode: "UNAUTHORIZED",
                message: "Tên đăng nhập hoặc mật khẩu không chính xác!" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Đăng nhập thành công!",
            data: {
                accountId: account.AccountID,
                username: account.Username,
                fullName: account.FullName,
                role: account.Role,
                token: account.token
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login
};
