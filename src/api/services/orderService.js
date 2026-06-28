import api from '../axios'; // Sesuaikan path ini dengan letak file api/axios lu

export const orderService = {
    getAll: async ({ storeId, type, search, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        if (type) params.append('type', type);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('limit', limit);

        // Asumsi endpoint backend lu pakai /purchases
        const response = await api.get(`/purchases?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/purchases/${id}`);
        return response.data;
    },

    create: async (payload) => {
        // Otomatis kasih status PENDING dari frontend buat jaga-jaga
        const response = await api.post('/purchases', { ...payload, status: 'PENDING' });
        return response.data;
    },

    update: async (id, payload) => {
        const response = await api.put(`/purchases/${id}`, payload);
        return response.data;
    },

// FUNGSI KHUSUS UPDATE STATUS (TERIMA BARANG)
    updateStatus: async (id) => {
        // Pake PATCH dan arahin ke endpoint /receive
        const response = await api.patch(`/purchases/${id}/receive`);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/purchases/${id}`);
        return response.data;
    },
};