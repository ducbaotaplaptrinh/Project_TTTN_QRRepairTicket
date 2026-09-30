const express = require('express');
const router = express.Router();

const deviceRoute = require('./device.route');
const authRoute = require('./account.route');
const ticketRoute = require('./ticket.route'); // Nhúng file ticket

// Định tuyến API
router.use('/devices', deviceRoute);
router.use('/auth', authRoute);
router.use('/tickets', ticketRoute); // Khai báo đường dẫn /api/tickets

module.exports = router;
