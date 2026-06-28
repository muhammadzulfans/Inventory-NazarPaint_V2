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