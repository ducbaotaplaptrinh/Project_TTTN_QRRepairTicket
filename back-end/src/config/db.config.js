const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER || 'localhost', 
    database: process.env.DB_NAME,
    options: {
        trustServerCertificate: true, // Bỏ qua lỗi SSL (giống test-db.js)
        instanceName: process.env.DB_INSTANCE || 'SQLEXPRESS01' 
    }
};

const connectDB = async () => {
    try {
        const pool = await sql.connect(config);
        console.log('Connected to SQL Server successfully (QuanLyCSKH)!');
        return pool;
    } catch (err) {
        console.error('Database Connection Failed! Bad Config: ', err);
        throw err;
    }
};

module.exports = {
    sql,
    connectDB,
    config
};
