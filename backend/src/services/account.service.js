const { pool } = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (username, password) => {
    const result = await pool.query(`
        SELECT id AS "AccountID", username AS "Username", password_hash AS "PasswordHash", full_name AS "FullName", role AS "Role"
        FROM accounts
        WHERE username = $1
    `, [username]);
        
    const user = result.rows[0];
    if (!user) return null; // Không tìm thấy user

    // 2. So sánh mật khẩu bằng bcrypt
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return null; // Sai mật khẩu

    // 3. Tạo Token JWT (Có giá trị 24 giờ)
    const tokenPayload = {
        AccountID: user.AccountID,
        Username: user.Username,
        Role: user.Role
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '24h' });

    // Trả về thông tin user (loại bỏ Password) kèm theo token
    delete user.PasswordHash;
    return { ...user, token };
};

module.exports = {
    login
};
