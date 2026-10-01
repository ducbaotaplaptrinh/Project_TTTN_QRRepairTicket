const { pool } = require('../config/db.config');

const getAllDevices = async () => {
    const result = await pool.query('SELECT * FROM devices');
    return result.rows;
};

const getDeviceByCode = async (deviceCode) => {
    const result = await pool.query(`
        SELECT d.*, c.full_name AS "FullName", c.phone AS "Phone", c.email AS "Email"
        FROM devices d
        JOIN customers c ON d.customer_id = c.id
        WHERE d.device_code = $1
    `, [deviceCode]);
    return result.rows[0]; 
};

const createDevice = async (deviceData) => {
    const { CustomerID, DeviceCode, DeviceName, SerialOrVersion } = deviceData;
    
    const result = await pool.query(`
        INSERT INTO devices (customer_id, device_code, device_name, serial_or_version)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [CustomerID, DeviceCode, DeviceName, SerialOrVersion]);
        
    return result.rows[0];
};

module.exports = {
    getAllDevices,
    getDeviceByCode,
    createDevice
};
