import api from '../axios';
export const orderService = {
    getAll: async ({ storeId, type, search, status, page = 1, limit = 10 } = {}) => {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        if (type) params.append('type', type);
        if (search) params.append('search', search);
        if (status) params.append('status', status);
        params.append('page', page);
        params.append('limit', limit);
        const response = await api.get(`/purchases?${params.toString()}`);
        return response.data;
    },
    getById: async (id) => {
        const response = await api.get(`/purchases/${id}`);
        return response.data;
    },
    create: async (payload) => {
        const response = await api.post('/purchases', { ...payload, status: 'PENDING' });
        return response.data;
    },
    update: async (id, payload) => {
        const response = await api.put(`/purchases/${id}`, payload);
        return response.data;
    },
    updateStatus: async (id) => {
        const response = await api.patch(`/purchases/${id}/receive`);
        return response.data;
    },
    reject: async (id) => {
        const response = await api.patch(`/purchases/${id}/cancel`);
        return response.data;
    },
    delete: async (id) => {
        const response = await api.delete(`/purchases/${id}`);
        return response.data;
    },
};