import api from '../axios';

export const storeService = {
    getAll: async () => {
        const response = await api.get('/stores');
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/stores/${id}`);
        return response.data;
    },
};