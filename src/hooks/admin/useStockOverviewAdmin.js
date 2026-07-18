import { useState, useEffect } from "react";
import { dashboardService } from "../../api/services/dashboardService.js";

export const useStockOverviewAdmin = (storeId) => {
    const [overview, setOverview] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOverview = async () => {
            try {
                setIsLoading(true);
                const res = await dashboardService.getDashboard(storeId);
                if (res.success) {
                    setOverview({
                        lowStockCount: res.data.lowStockAlert?.totalAlert ?? 0,
                        stokOrder: res.data.stockRecap?.totalStokOrder ?? 0,
                        stokMasuk: res.data.stockRecap?.totalStokMasuk ?? 0,
                        stokKeluar: res.data.stockRecap?.totalStokKeluar ?? 0,
                        stokAkhir: res.data.stockRecap?.totalStokAkhir ?? 0,
                        storeCount: res.data.storeSummary?.length ?? 0,
                    });
                }
            } catch (err) {
                console.error("Gagal memuat ringkasan stok:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOverview();
    }, [storeId]); // re-fetch tiap kali storeId berubah

    return { overview, isLoading };
};