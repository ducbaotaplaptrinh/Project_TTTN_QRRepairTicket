const { sql, connectDB } = require('../config/db.config');
const crypto = require('crypto');
const qrcodeService = require('./qrcode.service');

const initSession = async () => {
    const pool = await connectDB();
    const token = crypto.randomUUID(); // Sinh mã độc nhất
    
    // Tạo mã Phiếu giả tạm thời
    const ticketCode = 'TK-' + Date.now();
    
    // Lưu tạm 1 phiếu DRAFT
    const result = await pool.request()
        .input('MaSoPhieu', sql.VarChar(50), ticketCode)
        .input('TrangThai', sql.VarChar(50), 'DRAFT')
        .input('MaPhienLamViec', sql.VarChar(255), token)
        .query(`
            INSERT INTO PhieuSuaChua (MaSoPhieu, TrangThai, MaPhienLamViec, NgayTao, HanSuDungToken)
            OUTPUT inserted.MaPhieu, inserted.MaSoPhieu
            VALUES (@MaSoPhieu, @TrangThai, @MaPhienLamViec, GETDATE(), DATEADD(MINUTE, 15, GETDATE()))
        `);
        
    const ticket = result.recordset[0];
    
    // Sinh URL cho mã QR (để khách quét)
    const frontendBaseUrl = 'http://10.50.195.212:5173/scan'; // Đổi link này thành link của Front-end sau này
    const qrData = `${frontendBaseUrl}?token=${token}`;
    const qrImage = await qrcodeService.generateQRCode(qrData);

    return {
        ticketId: ticket.MaPhieu,
        ticketCode: ticket.MaSoPhieu,
        sessionToken: token,
        qrImage: qrImage
    };
};

const checkSession = async (token) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input('MaPhienLamViec', sql.VarChar(255), token)
        .query(`
            SELECT MaPhieu AS TicketID, MaSoPhieu AS TicketCode, TrangThai AS Status 
            FROM PhieuSuaChua 
            WHERE MaPhienLamViec = @MaPhienLamViec 
              AND TrangThai = 'DRAFT'
              AND HanSuDungToken >= GETDATE()
        `);
    return result.recordset[0];
};

const submitSession = async (token, customerData) => {
    const pool = await connectDB();
    
    // 1. Kiểm tra Token còn hợp lệ không
    const session = await checkSession(token);
    if (!session) throw new Error("Mã QR đã hết hạn, đã được sử dụng hoặc không hợp lệ!");
    
    const { fullName, phone, email, issueDescription, deviceName } = customerData;
    let customerId = null;
    let deviceId = null;

    // 2. Tìm hoặc tạo Khách hàng dựa vào Số điện thoại
    let userResult = await pool.request()
        .input('SoDienThoai', sql.VarChar(20), phone)
        .query(`SELECT MaNguoiDung FROM NguoiDung WHERE SoDienThoai = @SoDienThoai AND VaiTro = 'CUSTOMER'`);
        
    if (userResult.recordset.length > 0) {
        customerId = userResult.recordset[0].MaNguoiDung;
    } else {
        // Khách mới -> Tạo User mới
        const newUser = await pool.request()
            .input('HoTen', sql.NVarChar(100), fullName)
            .input('ThuDienTu', sql.VarChar(100), email || '')
            .input('SoDienThoai', sql.VarChar(20), phone)
            .query(`
                INSERT INTO NguoiDung (HoTen, ThuDienTu, SoDienThoai, VaiTro)
                OUTPUT inserted.MaNguoiDung
                VALUES (@HoTen, @ThuDienTu, @SoDienThoai, 'CUSTOMER')
            `);
        customerId = newUser.recordset[0].MaNguoiDung;
    }
    
    // 3. Tạo Thiết bị (Nếu khách có điền tên thiết bị)
    if (deviceName) {
        const deviceCode = 'LG-CUST-' + Math.floor(1000 + Math.random() * 9000);
        const newDevice = await pool.request()
            .input('MaKhachHang', sql.Int, customerId)
            .input('MaSoThietBi', sql.VarChar(50), deviceCode)
            .input('TenThietBi', sql.NVarChar(255), deviceName)
            .query(`
                INSERT INTO ThietBi (MaKhachHang, MaSoThietBi, TenThietBi)
                OUTPUT inserted.MaThietBi
                VALUES (@MaKhachHang, @MaSoThietBi, @TenThietBi)
            `);
        deviceId = newDevice.recordset[0].MaThietBi;
    }

    // 4. Cập nhật Ticket thành PENDING, điền thông tin và XÓA Token (để chặn spam)
    await pool.request()
        .input('MaPhieu', sql.Int, session.TicketID)
        .input('MaKhachHang', sql.Int, customerId)
        .input('MaThietBi', sql.Int, deviceId) // Có thể NULL nếu sửa ko nhập tên máy
        .input('MoTaLoi', sql.NVarChar(1000), issueDescription)
        .query(`
            UPDATE PhieuSuaChua
            SET MaKhachHang = @MaKhachHang,
                MaThietBi = @MaThietBi,
                MoTaLoi = @MoTaLoi,
                TrangThai = 'PENDING',
                MaPhienLamViec = NULL,  -- Xóa token
                NgayCapNhat = GETDATE()
            WHERE MaPhieu = @MaPhieu
        `);
        
    return { ticketCode: session.TicketCode };
};

module.exports = {
    initSession,
    checkSession,
    submitSession
};
