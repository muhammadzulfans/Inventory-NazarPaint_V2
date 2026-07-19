import api from '../axios';

export const stockOpnameService = {
    getAll: async ({ storeId, status, search, startDate, endDate, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        params.append('page', page);
        params.append('limit', limit);
        const response = await api.get(`/stock-opnames?${params.toString()}`);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/stock-opnames/${id}`);
        return response.data;
    },
    create: async (payload) => {
        const response = await api.post('/stock-opnames', payload);
        return response.data;
    },
    update: async (id, payload) => {
        const response = await api.patch(`/stock-opnames/${id}`, payload);
        return response.data;
    },
    selesai: async (id) => {
        const response = await api.patch(`/stock-opnames/${id}/selesai`);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/stock-opnames/${id}`);
        return response.data;
    },
};