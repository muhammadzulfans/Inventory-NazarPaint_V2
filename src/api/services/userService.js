import api from '../axios';

export const userService = {
    // Ambil semua data user (Khusus Admin)
    getAllUsers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    // Tambah user baru (Admin mendaftarkan karyawan/admin lain)
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Update data user
    updateUser: async (id, userData) => {
        const response = await api.put(`/users/${id}`, userData);
        return response.data;
    },

    // Hapus user
    deleteUser: async (id) => {
        const response = await api.delete(`/users/${id}`);
        return response.data;
    }
};