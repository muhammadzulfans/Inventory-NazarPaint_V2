import { useState, useEffect } from 'react';
import { dashboardService } from '../../api/services/dashboardService.js';
import { salesService } from '../../api/services/salesService.js';

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const getThisMonthRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    const fmt = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    return { startDate: fmt(start), endDate: fmt(end) };
};

export const useDashboardAdmin = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [trueNetProfit, setTrueNetProfit] = useState(0);
    const [isLoadingProfit, setIsLoadingProfit] = useState(true);

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

    // Hitung margin keuntungan asli (harga jual - harga pokok) dari semua transaksi
    // penjualan bulan ini, gabungan semua cabang (tanpa storeId = semua cabang untuk OWNER)
    useEffect(() => {
        const fetchTrueProfit = async () => {
            setIsLoadingProfit(true);
            try {
                const { startDate, endDate } = getThisMonthRange();
                const res = await salesService.getAll({
                    startDate,
                    endDate,
                    page: 1,
                    limit: 1000,
                });
                if (res) {
                    const sales = res.data || [];
                    const totalProfit = sales.reduce((sumSale, sale) => {
                        const saleProfit = (sale.items || []).reduce((sumItem, item) => {
                            const hargaJual = item.sellPrice || 0;
                            const hargaBeli = item.product?.basePrice || 0;
                            const qty = item.quantity || 0;
                            return sumItem + (hargaJual - hargaBeli) * qty;
                        }, 0);
                        return sumSale + saleProfit;
                    }, 0);
                    setTrueNetProfit(totalProfit);
                }
            } catch (err) {
                console.error("Gagal menghitung keuntungan bersih:", err);
            } finally {
                setIsLoadingProfit(false);
            }
        };
        fetchTrueProfit();
    }, []);

    const weeklyChartData = dashboardData?.weeklySalesTrend?.map((item) => ({
        label: HARI[new Date(item.date).getDay()],
        totalAmount: item.totalAmount,
        totalTransaction: item.totalTransaction,
    })) ?? [];

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
        trueNetProfit,
        isLoadingProfit,
    };
};