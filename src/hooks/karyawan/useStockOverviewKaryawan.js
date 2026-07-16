import { useState, useEffect } from "react";
import { dashboardService } from "../../api/services/dashboardService.js";

export const useStockOverviewKaryawan = () => {
    const [overview, setOverview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setIsLoading(true);
                const res = await dashboardService.getDashboard();
                if (res.success) {
                    setOverview({
                        lowStockCount: res.data.lowStockAlert?.totalAlert ?? 0,
                        stokMasuk: res.data.stockRecap?.totalStokMasuk ?? 0,
                        stokKeluar: res.data.stockRecap?.totalStokKeluar ?? 0,
                    });
                }
            } catch (err) {
                console.error("Gagal memuat ringkasan stok:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverview();
    }, []);

    return { overview, isLoading };
};