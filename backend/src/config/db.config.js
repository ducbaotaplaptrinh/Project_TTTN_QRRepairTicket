const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

pool.on('error', (err, client) => {
  console.error('Lỗi kết nối PostgreSQL (Unexpected error on idle client):', err);
});

const connectDB = async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL successfully!');
    } catch (err) {
        console.error('Database Connection Failed! Bad Config: ', err);
    }
};

module.exports = {
    pool,
    connectDB
};
