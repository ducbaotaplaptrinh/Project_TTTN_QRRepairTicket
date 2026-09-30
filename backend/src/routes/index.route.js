const express = require('express');
const router = express.Router();

const deviceRoute = require('./thietbi.route');
const authRoute = require('./taikhoan.route');
const ticketRoute = require('./phieusuachua.route'); // Nhúng file ticket

// Định tuyến API
router.use('/devices', deviceRoute);
router.use('/auth', authRoute);
router.use('/tickets', ticketRoute); // Khai báo đường dẫn /api/tickets

module.exports = router;
