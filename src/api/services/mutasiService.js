import api from '../axios';

export const mutasiService = {
    getAll: async ({ storeId, search, startDate, endDate, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        if (search) params.append('search', search);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        params.append('page', page);
        params.append('limit', limit);
        const response = await api.get(`/mutations?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/mutations/${id}`);
        return response.data;
    },

    create: async (payload) => {
        // payload: { fromStoreId, toStoreId, date, note, items: [{ productId, quantity }] }
        const response = await api.post('/mutations', payload);
        return response.data;
    },

    // Endpoint PATCH untuk memperbarui transaksi mutasi utuh
    updateMutation: async (id, payload) => {
        const response = await api.patch(`/mutations/${id}`, payload);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/mutations/${id}`);
        return response.data;
    },
};