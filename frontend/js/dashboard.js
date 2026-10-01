// Authentication check
if(!localStorage.getItem('token')) {
    window.location.href = 'index.html';
}

// Display user name
try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.FullName) {
        document.getElementById('userName').textContent = user.FullName;
    }
} catch(e) {}

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
});

let timerInterval;

// Generate QR
document.getElementById('generateBtn').addEventListener('click', async () => {
    const btn = document.getElementById('generateBtn');
    const qrContainer = document.getElementById('qrContainer');
    const errorMsg = document.getElementById('errorMsg');
    
    btn.disabled = true;
    btn.textContent = 'Đang tạo...';
    errorMsg.style.display = 'none';
    qrContainer.style.display = 'none';
    clearInterval(timerInterval);

    try {
        const result = await fetchAPI('/tickets/init-session', { method: 'POST' });
        
        if (result.success && result.data) {
            document.getElementById('qrImage').src = result.data.qrImage;
            document.getElementById('ticketCode').textContent = result.data.ticketCode;
            qrContainer.style.display = 'flex';
            
            // Start countdown (15 mins)
            let timeLeft = 15 * 60;
            const countdownEl = document.getElementById('countdown');
            
            timerInterval = setInterval(() => {
                timeLeft--;
                const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const s = (timeLeft % 60).toString().padStart(2, '0');
                countdownEl.textContent = `${m}:${s}`;
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    countdownEl.textContent = 'Đã hết hạn';
                    countdownEl.style.color = 'var(--error)';
                }
            }, 1000);
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'TẠO MÃ QR CHO KHÁCH';
    }
});
