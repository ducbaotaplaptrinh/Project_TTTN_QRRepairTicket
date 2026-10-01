const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes/index.route');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

// Cấu hình CORS chặt chẽ
const corsOptions = {
    origin: ['http://localhost:5173', 'http://10.50.195.212:5173'], // IP của Vite mặc định
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Giới hạn chung cho toàn hệ thống
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Tối đa 100 request
    message: { success: false, message: 'Quá nhiều yêu cầu. Vui lòng thử lại sau!' }
});
app.use('/api', globalLimiter);

app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
