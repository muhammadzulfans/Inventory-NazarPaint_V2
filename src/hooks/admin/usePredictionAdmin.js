import { useState, useEffect, useCallback } from 'react';
import { predictionService } from '../../api/services/predictionService';

export const usePredictionAdmin = () => {
    const [predictions, setPredictions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // State untuk filter
    const [selectedCabang, setSelectedCabang] = useState('');
    const [selectedBulan, setSelectedBulan] = useState('2026-01-01'); // Default bulan pertama

    const fetchPredictions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (selectedCabang) params.cabang = selectedCabang;
            if (selectedBulan) params.bulan = selectedBulan;

            const response = await predictionService.getPrediksiStok(params);
            setPredictions(response.data || []);
        } catch (err) {
            setError(err.message || 'Gagal memuat data prediksi');
        } finally {
            setLoading(false);
        }
    }, [selectedCabang, selectedBulan]);

    useEffect(() => {
        fetchPredictions();
    }, [fetchPredictions]);

    return {
        predictions,
        loading,
        error,
        selectedCabang,
        setSelectedCabang,
        selectedBulan,
        setSelectedBulan,
        refetch: fetchPredictions,
    };
};