// Kiểm tra xem đã đăng nhập chưa
if(localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('submitBtn');
    const errorMsg = document.getElementById('errorMsg');
    
    btn.disabled = true;
    btn.textContent = 'Đang xử lý...';
    errorMsg.style.display = 'none';

    try {
        const result = await fetchAPI('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        if (result.success) {
            localStorage.setItem('token', result.data.token);
            localStorage.setItem('user', JSON.stringify(result.data.user || result.data));
            window.location.href = 'dashboard.html';
        }
    } catch (err) {
        errorMsg.textContent = err.message;
        errorMsg.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Đăng Nhập';
    }
});
