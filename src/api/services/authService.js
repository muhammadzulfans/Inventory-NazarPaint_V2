import api from '../axios';

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        return response.data;
    },

    // Kamu bisa tambah service lain di sini
    getProfile: async () => {
        const response = await api.get('/auth/profile');
        return response.data;
    },

    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // === BARU: Forgot Password Flow (OTP) ===
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },
    verifyOtp: async ({ email, otpCode }) => {
        const response = await api.post('/auth/verify-otp', { email, otpCode });
        return response.data;
    },
    // Belum ada endpoint resend terpisah di backend,
    // jadi resend memanggil ulang forgot-password (generate OTP baru + kirim ulang email)
    resendOtp: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },
    resetPassword: async ({ email, otpCode, newPassword }) => {
        const response = await api.post('/auth/reset-password', { email, otpCode, newPassword });
        return response.data;
    },
};

export const userService = {
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    }
};