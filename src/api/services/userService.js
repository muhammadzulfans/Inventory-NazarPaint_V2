import api from '../axios';

export const userService = {
    getAllUsers: async (params) => {
        const response = await api.get('/users', {params});
        return response.data;
    },
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },
    // deleteUser: async (id) => {
    //     const response = await api.delete(`/users/${id}`);
    //     return response.data;
    // },
    // BARU: aktivasi/ubah status akun (PENDING → ACTIVE, dst)
    updateStatus: async (id, status) => {
        const response = await api.patch(`/users/${id}/status`, { status });
        return response.data;
    }
};