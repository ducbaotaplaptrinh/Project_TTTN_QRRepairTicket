const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/device.controller');
const { verifyToken, requireRole } = require('../middlewares/auth.middleware');

// URL: GET /api/devices
router.get('/', verifyToken, deviceController.getDevices);

// URL: GET /api/devices/LG-TEST-999 (API tìm kiếm)
router.get('/:deviceCode', verifyToken, deviceController.getDevice);

// URL: POST /api/devices
router.post('/', verifyToken, requireRole('TECHNICIAN', 'ADMIN', 'RECEPTIONIST'), deviceController.addDevice);

module.exports = router;
