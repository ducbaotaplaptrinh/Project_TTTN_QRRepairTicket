const { sql, connectDB } = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = async (username, password) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input('TenDangNhap', sql.VarChar(50), username)
        .query(`
            SELECT a.MaTaiKhoan AS AccountID, a.TenDangNhap AS Username, a.MatKhau AS PasswordHash, u.MaNguoiDung AS UserID, u.HoTen AS FullName, u.VaiTro AS Role, u.ThuDienTu AS Email 
            FROM TaiKhoan a
            JOIN NguoiDung u ON a.MaNguoiDung = u.MaNguoiDung
            WHERE a.TenDangNhap = @TenDangNhap AND a.TrangThaiHoatDong = 1
        `);
        
    const user = result.recordset[0];
    if (!user) return null; // Không tìm thấy user

    // 2. So sánh mật khẩu bằng bcrypt
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) return null; // Sai mật khẩu

    // 3. Tạo Token JWT (Có giá trị 24 giờ)
    const tokenPayload = {
        AccountID: user.AccountID,
        UserID: user.UserID,
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
