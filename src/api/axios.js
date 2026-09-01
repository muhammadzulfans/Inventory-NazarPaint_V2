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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const code = error?.response?.data?.code;

        if (code === "STORE_INACTIVE" || code === "NO_STORE_ASSIGNED") {
            const message = error?.response?.data?.message || "Sesi Anda tidak valid. Silakan login kembali.";

            // Bersihkan sesi
            sessionStorage.removeItem('auth-storage');

            // Redirect ke login sambil bawa pesan (query param sederhana, tanpa perlu React Router di sini)
            window.location.href = `/login?notice=${encodeURIComponent(message)}`;
        }

        return Promise.reject(error);
    }
);

export default api;