import api from '../axios.js';

export const dashboardService = {
    getDashboard: async () => {
        const response = await api.get('/dashboard');
        return response.data;
    },
};