import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor disesuaikan ke sessionStorage mengikuti Zustand
api.interceptors.request.use(
    (config) => {
        try {
            // PENTING: Ganti ke sessionStorage sesuai konfigurasi store Zustand lu!
            const rawStorage = sessionStorage.getItem('auth-storage');

            if (rawStorage) {
                const storage = JSON.parse(rawStorage);
                const token = storage?.state?.token;

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error("Gagal mengambil token dari sessionStorage:", error);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;