import api from '../axios';

export const storeService = {
    getAll: async (params = {}) => {
        const response = await api.get('/stores', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/stores/${id}`);
        return response.data;
    },

    create: async (storeData) => {
        const response = await api.post('/stores', storeData);
        return response.data;
    },

    update: async (id, storeData) => {
        const response = await api.put(`/stores/${id}`, storeData);
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/stores/${id}`);
        return response.data;
    },

    assignUser: async (storeId, userId) => {
        const response = await api.post(`/stores/${storeId}/assign`, { userId });
        return response.data;
    },

    unassignUser: async (storeId, userId) => {
        const response = await api.delete(`/stores/${storeId}/assign`, { data: { userId } });
        return response.data;
    },
};