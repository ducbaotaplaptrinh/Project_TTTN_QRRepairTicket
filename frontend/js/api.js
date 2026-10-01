const API_BASE_URL = 'https://tttn-backend-qr.vercel.app/api';

async function fetchAPI(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            throw new Error(data.message || 'Có lỗi xảy ra khi kết nối máy chủ');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}
