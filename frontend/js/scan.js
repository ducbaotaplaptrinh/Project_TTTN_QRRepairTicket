document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    const loadingState = document.getElementById('loadingState');
    const errorState = document.getElementById('errorState');
    const formState = document.getElementById('formState');
    const errorScanMsg = document.getElementById('errorScanMsg');

    if (!token) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        errorScanMsg.textContent = 'Thiếu mã truy cập (Token không tồn tại).';
        return;
    }

    try {
        const result = await fetchAPI(`/tickets/session/${token}`, { method: 'GET' });
        
        if (result.success) {
            // QR hợp lệ
            loadingState.style.display = 'none';
            formState.style.display = 'block';
        } else {
            throw new Error(result.message || 'Mã QR không hợp lệ');
        }
    } catch (err) {
        loadingState.style.display = 'none';
        errorState.style.display = 'block';
        errorScanMsg.textContent = err.message || 'Phiên đã hết hạn hoặc đã được sử dụng!';
    }
});

document.getElementById('submitForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    const fullName = document.getElementById('fullName').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const deviceName = document.getElementById('deviceName').value;
    const issueDescription = document.getElementById('issueDescription').value;
    
    const btn = document.getElementById('submitTicketBtn');
    const errorMsg = document.getElementById('submitErrorMsg');
    const successMsg = document.getElementById('submitSuccessMsg');
    
    btn.disabled = true;
    btn.textContent = 'ĐANG GỬI...';
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    try {
        const result = await fetchAPI(`/tickets/session/${token}/submit`, {
            method: 'POST',
            body: JSON.stringify({ fullName, phone, email, deviceName, issueDescription })
        });
        
        if (result.success) {
            successMsg.textContent = 'Gửi Yêu cầu tiếp nhận thành công! Lễ tân sẽ gọi bạn ngay bây giờ.';
            successMsg.style.display = 'block';
            document.getElementById('submitForm').reset();
            btn.style.display = 'none'; // Ẩn nút gửi để tránh submit lại
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'GỬI LẠI YÊU CẦU';
    }
});
