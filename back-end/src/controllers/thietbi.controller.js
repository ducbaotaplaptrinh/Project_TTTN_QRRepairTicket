const deviceService = require('../services/thietbi.service');

const getDevices = async (req, res, next) => {
    try {
        const devices = await deviceService.getAllDevices();
        res.status(200).json({
            success: true,
            data: devices
        });
    } catch (error) {
        next(error); 
    }
};

// API Mới: Lấy chi tiết thiết bị qua mã code
const getDevice = async (req, res, next) => {
    try {
        const { deviceCode } = req.params;
        const device = await deviceService.getDeviceByCode(deviceCode);
        
        if (!device) {
            return res.status(404).json({ success: false, message: "Không tìm thấy thiết bị này" });
        }

        res.status(200).json({
            success: true,
            data: device
        });
    } catch (error) {
        next(error);
    }
};

const addDevice = async (req, res, next) => {
    try {
        console.log("=== DỮ LIỆU FRONT-END GỬI LÊN ===");
        console.log(req.body); // In ra terminal để xem
        console.log("=================================");

        const deviceData = req.body;
        if (!deviceData.CustomerID || !deviceData.DeviceCode || !deviceData.DeviceName) {
            return res.status(400).json({ success: false, message: "Vui lòng nhập đủ thông tin bắt buộc", data_received: req.body });
        }

        const newDevice = await deviceService.createDevice(deviceData);
        res.status(201).json({
            success: true,
            message: "Tạo thiết bị và mã QR thành công!",
            data: newDevice
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDevices,
    getDevice,
    addDevice
};
