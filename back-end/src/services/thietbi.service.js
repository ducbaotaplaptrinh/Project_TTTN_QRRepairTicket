const { sql, connectDB } = require('../config/db.config');
const { generateQRCode } = require('./qrcode.service');

const getAllDevices = async () => {
    const pool = await connectDB();
    const result = await pool.request().query('SELECT * FROM ThietBi');
    return result.recordset;
};

// API Mới: Lấy thông tin thiết bị chi tiết dựa vào DeviceCode (Dùng khi quét QR)
const getDeviceByCode = async (deviceCode) => {
    const pool = await connectDB();
    const result = await pool.request()
        .input('MaSoThietBi', sql.VarChar(50), deviceCode)
        .query(`
            SELECT d.*, u.HoTen AS FullName, u.SoDienThoai AS Phone, u.ThuDienTu AS Email 
            FROM ThietBi d
            JOIN NguoiDung u ON d.MaKhachHang = u.MaNguoiDung
            WHERE d.MaSoThietBi = @MaSoThietBi
        `);
    return result.recordset[0]; // Trả về thông tin chi tiết thiết bị kèm Khách hàng
};

const createDevice = async (deviceData) => {
    const { CustomerID, DeviceCode, DeviceName, SerialOrVersion } = deviceData;
    
    // KỊCH BẢN 2: Khi điện thoại quét, nó phải mở ra 1 trang web của Front-end.
    // Nên data của QR phải là 1 đường link (URL) chứa mã thiết bị.
    // VD: https://front-end-lucgiac.com/scan?deviceCode=LG-TEST-999
    const frontendBaseUrl = 'https://app.lucgiac.com/scan'; 
    const qrData = `${frontendBaseUrl}?deviceCode=${DeviceCode}`;
    
    const QRCodeImage = await generateQRCode(qrData);

    const pool = await connectDB();
    const result = await pool.request()
        .input('MaKhachHang', sql.Int, CustomerID)
        .input('MaSoThietBi', sql.VarChar(50), DeviceCode)
        .input('TenThietBi', sql.NVarChar(150), DeviceName)
        .input('SoSerial', sql.VarChar(100), SerialOrVersion)
        .input('AnhMaQR', sql.NVarChar(sql.MAX), QRCodeImage)
        .query(`
            INSERT INTO ThietBi (MaKhachHang, MaSoThietBi, TenThietBi, SoSerial, AnhMaQR)
            OUTPUT inserted.*
            VALUES (@MaKhachHang, @MaSoThietBi, @TenThietBi, @SoSerial, @AnhMaQR)
        `);
        
    return result.recordset[0];
};

module.exports = {
    getAllDevices,
    getDeviceByCode,
    createDevice
};
