const { pool } = require('../config/db.config');
const crypto = require('crypto');
const qrcodeService = require('./ticket_session.service');

const initSession = async () => {
    const token = crypto.randomUUID(); // Sinh mã độc nhất
    const ticketCode = 'TK-' + Date.now();
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        
        const ticketResult = await client.query(`
            INSERT INTO tickets (ticket_code, issue_description, status)
            VALUES ($1, $2, $3)
            RETURNING id, ticket_code
        `, [ticketCode, 'Initial', 'INITIALIZING']);
        
        const ticket = ticketResult.rows[0];
        
        const frontendBaseUrl = process.env.CORS_ORIGIN + '/scan'; 
        const qrData = `${frontendBaseUrl}?token=${token}`;
        const qrImage = await qrcodeService.generateQRCode(qrData);

        await client.query(`
            INSERT INTO ticket_sessions (session_token, ticket_id, qr_image_base64, status, expires_at)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP + INTERVAL '15 minutes')
        `, [token, ticket.id, qrImage, 'ACTIVE']);

        await client.query('COMMIT');

        return {
            ticketId: ticket.id,
            ticketCode: ticket.ticket_code,
            sessionToken: token,
            qrImage: qrImage
        };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const checkSession = async (token) => {
    const result = await pool.query(`
        SELECT s.session_token AS "SessionToken", t.ticket_code AS "TicketCode", s.status AS "Status", s.expires_at AS "ExpiresAt"
        FROM ticket_sessions s
        JOIN tickets t ON s.ticket_id = t.id
        WHERE s.session_token = $1 
          AND s.status = 'ACTIVE'
          AND s.expires_at >= CURRENT_TIMESTAMP
    `, [token]);
    return result.rows[0];
};

const submitSession = async (token, customerData) => {
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Kiểm tra Token
        const sessionResult = await client.query(`
            SELECT s.id AS session_id, s.ticket_id, t.ticket_code 
            FROM ticket_sessions s
            JOIN tickets t ON s.ticket_id = t.id
            WHERE s.session_token = $1 AND s.status = 'ACTIVE' AND s.expires_at >= CURRENT_TIMESTAMP
        `, [token]);
        
        if (sessionResult.rows.length === 0) {
            throw new Error("Mã QR đã hết hạn, đã được sử dụng hoặc không hợp lệ!");
        }
        
        const session = sessionResult.rows[0];
        const { fullName, phone, email, issueDescription, deviceName } = customerData;
        let customerId = null;
        let deviceId = null;

        // 2. Tìm/Tạo Khách hàng
        let userResult = await client.query(`SELECT id FROM customers WHERE phone = $1`, [phone]);
            
        if (userResult.rows.length > 0) {
            customerId = userResult.rows[0].id;
        } else {
            const newUser = await client.query(`
                INSERT INTO customers (full_name, phone, email)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [fullName, phone, email]);
            customerId = newUser.rows[0].id;
        }
        
        // 3. Tìm/Tạo Thiết bị
        if (deviceName) {
            const deviceCode = 'LG-CUST-' + Math.floor(1000 + Math.random() * 9000);
            const newDevice = await client.query(`
                INSERT INTO devices (customer_id, device_code, device_name)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [customerId, deviceCode, deviceName]);
            deviceId = newDevice.rows[0].id;
        }

        // 4. Cập nhật Ticket
        await client.query(`
            UPDATE tickets
            SET customer_id = $1,
                device_id = $2,
                issue_description = $3,
                status = 'PENDING',
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4
        `, [customerId, deviceId, issueDescription, session.ticket_id]);
        
        // 5. Đóng Token
        await client.query(`
            UPDATE ticket_sessions
            SET status = 'SUBMITTED',
                submitted_at = CURRENT_TIMESTAMP
            WHERE id = $1
        `, [session.session_id]);

        await client.query('COMMIT');
        return { ticketCode: session.ticket_code };
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

module.exports = {
    initSession,
    checkSession,
    submitSession
};
