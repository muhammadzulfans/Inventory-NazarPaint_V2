import api from '../axios';

export const salesService = {
    getAll: async ({ storeId, type, search, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        if (type) params.append('type', type);
        if (search) params.append('search', search);
        params.append('page', page);
        params.append('limit', limit);

        const response = await api.get(`/sales?${params.toString()}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/sales/${id}`);
        return response.data;
    },

    create: async (payload) => {
        const response = await api.post('/sales', payload);
        return response.data;
    },

    update: async (id, payload) => {
        const response = await api.put(`/sales/${id}`, payload);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/sales/${id}`);
        return response.data;
    },
};