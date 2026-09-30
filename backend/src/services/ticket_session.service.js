const QRCode = require('qrcode');

const generateQRCode = async (data) => {
    try {
        // Trả về chuỗi base64 của ảnh QR
        const qrCodeBase64 = await QRCode.toDataURL(data);
        return qrCodeBase64;
    } catch (err) {
        console.error('Lỗi khi tạo mã QR:', err);
        throw err;
    }
};

module.exports = {
    generateQRCode
};
