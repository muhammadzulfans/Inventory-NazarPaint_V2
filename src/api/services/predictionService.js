import api from '../axios';

export const predictionService = {
    getPrediksiStok: async (params) => {
        try {
            // params bisa berisi { cabang: 'Balamoa', bulan: '2026-01-01' }
            const response = await api.get('/predictions', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },
};