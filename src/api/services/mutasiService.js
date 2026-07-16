import api from '../axios';

export const mutasiService = {
    getAll: async ({ storeId, search, type, startDate, endDate, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        if (search) params.append('search', search);
        if (type) params.append('type', type);          // <-- tambahan
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
        const response = await api.post('/mutations', payload);
        return response.data;
    },
    updateMutation: async (id, payload) => {
        const response = await api.put(`/mutations/${id}`, payload);
        return response.data;
    },
    send: async (id) => {
        const response = await api.patch(`/mutations/${id}/send`);
        return response.data;
    },
    receive: async (id) => {
        const response = await api.patch(`/mutations/${id}/receive`);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/mutations/${id}`);
        return response.data;
    },
};