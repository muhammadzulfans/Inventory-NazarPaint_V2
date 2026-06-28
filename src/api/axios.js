import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Sesuaikan dengan port backend kamu
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menyisipkan token secara otomatis ke setiap request
api.interceptors.request.use((config) => {
    const storage = JSON.parse(localStorage.getItem('auth-storage'));
    const token = storage?.state?.token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;