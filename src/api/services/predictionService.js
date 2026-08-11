import axios from 'axios';

// Sesuaikan baseURL dengan konfigurasi API Axios kamu
const API_URL = 'http://localhost:3000/api';

export async function fetchPrediction(cabang, kodeCat) {
    try {
        const response = await axios.post(`${API_URL}/predictions`, {
            cabang: cabang,
            kode_cat: kodeCat
        });
        return response.data.data; // Mengembalikan object data { cabang, kode_cat, prediksi_penjualan, target_bulan }
    } catch (error) {
        console.error("Gagal mengambil data prediksi:", error.response?.data || error.message);
        throw error;
    }
}