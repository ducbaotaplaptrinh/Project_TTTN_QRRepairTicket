const deviceService = require('../services/device.service');

// API: Lấy chi tiết thiết bị qua mã code
const getDevice = async (req, res, next) => {
    try {
        const { deviceCode } = req.params;
        const device = await deviceService.getDeviceByCode(deviceCode);
        
        if (!device) {
            return res.status(404).json({ 
                success: false, 
                errorCode: "DEVICE_NOT_FOUND",
                message: "Không tìm thấy thiết bị với mã đã quét!" 
            });
        }

        res.status(200).json({
            success: true,
            data: {
                deviceId: device.id,
                deviceCode: device.device_code,
                deviceName: device.device_name,
                serialOrVersion: device.serial_or_version,
                customerName: device.FullName,
                phone: device.Phone
            }
        });
    } catch (error) {
        next(error);
    }
};

const addDevice = async (req, res, next) => {
    try {
        const { customerId, deviceCode, deviceName, serialOrVersion } = req.body;
        if (!customerId || !deviceCode || !deviceName) {
            return res.status(400).json({ 
                success: false, 
                errorCode: "VALIDATION_ERROR",
                message: "Vui lòng nhập đủ thông tin bắt buộc" 
            });
        }

        const deviceData = {
            CustomerID: customerId,
            DeviceCode: deviceCode,
            DeviceName: deviceName,
            SerialOrVersion: serialOrVersion
        };

        const newDevice = await deviceService.createDevice(deviceData);
        res.status(201).json({
            success: true,
            message: "Thêm thiết bị và tạo mã QR thành công!",
            data: {
                deviceId: newDevice.id,
                deviceCode: newDevice.device_code,
                qrImage: newDevice.qrImage || null
            }
        });
    } catch (error) {
        next(error);
    }
};

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

module.exports = {
    getDevices,
    getDevice,
    addDevice
};
