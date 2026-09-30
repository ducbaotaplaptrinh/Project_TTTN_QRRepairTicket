const errorHandler = (err, req, res, next) => {
    console.error('Đã xảy ra lỗi:', err); // Log nguyên lỗi ra server để DEV đọc

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Che giấu lỗi SQL Server (Tedious Error / Mssql Error)
    if (err.number || err.code === 'EREQUEST' || err.code === 'ELOGIN') {
        statusCode = 500;
        message = 'Lỗi hệ thống nội bộ. Vui lòng thử lại sau.';
    }

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

module.exports = errorHandler;
