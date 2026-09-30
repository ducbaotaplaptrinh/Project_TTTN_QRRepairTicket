const baseUrl = 'http://127.0.0.1:5000/api';
require('dotenv').config();
const jwt = require('jsonwebtoken');

async function runTests() {
    console.log("====================================================");
    console.log("🚀 BẮT ĐẦU CHẠY KIỂM THỬ TÍCH HỢP & BẢO MẬT (GIAI ĐOẠN 4)");
    console.log("====================================================\n");
    
    let passCount = 0;
    let failCount = 0;
    let currentToken = '';

    // Tạo giả lập JWT của Lễ tân để gọi API Test 1
    const mockReceptionistToken = jwt.sign(
        { AccountID: 99, Role: 'RECEPTIONIST' }, 
        process.env.JWT_SECRET || 'lucgiac_secret_key_12345', 
        { expiresIn: '1h' }
    );

    function assertCondition(name, condition, message) {
        if (condition) {
            console.log(`✅ [PASS] ${name}`);
            passCount++;
        } else {
            console.error(`❌ [FAIL] ${name} - ${message}`);
            failCount++;
        }
    }

    // TEST 1: Khởi tạo phiên
    try {
        const res = await fetch(`${baseUrl}/tickets/init-session`, { 
            method: 'POST',
            headers: { 'Authorization': `Bearer ${mockReceptionistToken}` }
        });
        const data = await res.json();
        assertCondition('Test 1 (Tạo phiên QR): Khớp cấu trúc JSON', data.success === true && data.data && data.data.sessionToken, "Response không đúng chuẩn API_DOCUMENTATION: " + JSON.stringify(data));
        if (data.data) currentToken = data.data.sessionToken;
    } catch (e) {
        console.error("❌ Lỗi mạng ở Test 1:", e.message);
    }

    if (currentToken) {
        // TEST 2: Kiểm tra phiên
        try {
            const res = await fetch(`${baseUrl}/tickets/session/${currentToken}`);
            const data = await res.json();
            assertCondition('Test 2 (Kiểm tra token): Trả về trạng thái ACTIVE', data.success === true && data.data.sessionStatus === 'ACTIVE', "Token không hợp lệ hoặc trả về sai cấu trúc");
        } catch (e) {
             console.error("❌ Lỗi mạng ở Test 2");
        }

        // TEST 3 & 4: SQL Injection & Submit Form
        try {
            const payload = {
                fullName: "Mr. Hacker",
                phone: "0999999999",
                email: "hacker@test.com",
                deviceName: "Laptop Hacked",
                issueDescription: "' OR 1=1; DROP TABLE customers; --"
            };
            const res = await fetch(`${baseUrl}/tickets/session/${currentToken}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            
            assertCondition('Test 3 (Nộp Form): Lưu thành công xuống Database', res.status === 201 && data.success === true, "Submit Form bị sập");
            
            // Nếu SQL Injection thành công thì bảng đã bị xóa, database sẽ ném lỗi. Nếu nó trả 201 tức là SQL Inj bị chuyển hóa thành dạng Text thông thường
            assertCondition('Test 4 (Bảo mật A03 - Chặn SQL Injection):', data.success === true && data.data.status === 'PENDING', "Hệ thống có thể đã bị chọc thủng SQL");
        } catch (e) {
             console.error("❌ Lỗi mạng ở Test 3/4");
        }
    }

    // TEST 6: Error Hiding
    try {
        const res = await fetch(`${baseUrl}/tickets/session/chuoi-token-gia-mao-1234/submit`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ fullName: "A", phone: "123", issueDescription: "Lỗi" })
        });
        const data = await res.json();
        const isFriendlyError = (res.status === 400 || res.status === 404 || res.status === 500) && !JSON.stringify(data).includes("postgres");
        assertCondition('Test 6 (Bảo mật A05 - Che giấu lỗi SQL): Trả về câu từ thân thiện', isFriendlyError, "Lỗi để lọt thông tin nhạy cảm của PostgreSQL ra ngoài. Dữ liệu: " + JSON.stringify(data));
    } catch(e) {
         console.error("❌ Lỗi mạng ở Test 6");
    }

    // TEST 5: DDoS / Rate Limit
    try {
        console.log("\n[⏳] Đang giả lập bắn 150 request liên tục để test phòng thủ DDoS (Rate Limit)...");
        const promises = [];
        for (let i = 0; i < 150; i++) {
            promises.push(fetch(`${baseUrl}/tickets/init-session`, { method: 'POST' }));
        }
        const results = await Promise.all(promises);
        const hasTooManyRequests = results.some(r => r.status === 429);
        assertCondition('Test 5 (Bảo mật A04 - Chống DDoS/Spam): Server trả về 429 Too Many Requests', hasTooManyRequests, "Hệ thống BỊ LỖI HỔNG, không có cơ chế Rate Limit, dễ dàng bị đánh sập mạng!");
    } catch(e) {
        console.log("❌ Lỗi mạng khi test DDoS");
    }

    console.log(`\n====================================================`);
    console.log(`📊 TỔNG KẾT KẾT QUẢ: THÀNH CÔNG ${passCount}/6 | THẤT BẠI ${failCount}/6`);
    console.log(`====================================================\n`);
}

runTests();
