import api from '../axios.js';

export const dashboardService = {
    getDashboard: async (storeId) => {
        const params = new URLSearchParams();
        if (storeId) params.append('storeId', storeId);
        const query = params.toString();
        const response = await api.get(`/dashboard${query ? `?${query}` : ''}`);
        return response.data;
    },
};