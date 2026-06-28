import { useState, useEffect } from 'react';
import { dashboardService } from '../../api/services/dashboardService.js';

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const useDashboardAdmin = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                setIsLoading(true);
                const res = await dashboardService.getDashboard();
                if (res.success) {
                    setDashboardData(res.data);
                }
            } catch (err) {
                setError(err.message || 'Gagal memuat data dashboard');
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // Derived data untuk chart mingguan — x axis nama hari
    const weeklyChartData = dashboardData?.weeklySalesTrend?.map((item) => ({
        label: HARI[new Date(item.date).getDay()],
        totalAmount: item.totalAmount,
        totalTransaction: item.totalTransaction,
    })) ?? [];

    // Derived data untuk chart bulanan — x axis nama bulan singkat
    const monthlyChartData = dashboardData?.monthlySalesTrend?.map((item) => {
        const [, bulan] = item.month.split('-');
        return {
            label: BULAN[parseInt(bulan, 10) - 1],
            totalAmount: item.totalAmount,
            totalTransaction: item.totalTransaction,
        };
    }) ?? [];

    return {
        dashboardData,
        isLoading,
        error,
        weeklyChartData,
        monthlyChartData,
    };
};