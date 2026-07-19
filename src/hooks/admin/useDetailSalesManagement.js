import { useState, useEffect, useCallback } from "react";
import { salesService } from "../../api/services/salesService.js";
import { storeService } from "../../api/services/storeService.js";

export const useDetailSalesManagement = () => {
    const [detailSalesData, setDetailSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [totalSummary, setTotalSummary] = useState({
        totalHargaJual: 0, totalHargaBeli: 0, totalKeuntungan: 0,
        totalQtyKg: 0, totalQtyPcs: 0,
    });

    // Filter States
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]);

    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    // FETCH 1: Ambil data cabang untuk dropdown
    useEffect(() => {
        storeService.getAll()
            .then((res) => {
                const stores = res.data || [];
                setStoreOptions([
                    { value: "", label: "Semua Cabang" },
                    ...stores.map((s) => ({ value: s.id, label: s.name }))
                ]);
            })
            .catch(() => {});
    }, []);

    // FETCH 2: Ambil data penjualan lalu flatten per-item
    const fetchDetailSales = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await salesService.getAll({
                storeId,
                page: 1,
                limit: 1000,
            });

            if (res) {
                const sales = res.data || [];

                let flattened = sales.flatMap((sale) =>
                    (sale.items || []).map((item) => {
                        const product = item.product || {};
                        return {
                            idPenjualan: sale.orderNumber || sale.id,
                            kode: product.code || "-",
                            type: product.type || "-",
                            namaBarang: product.name || "-",
                            quantity: item.quantity || 0,
                            hargaJual: item.sellPrice || 0,
                            hargaBeli: product.basePrice || 0,
                            tanggal: sale.date
                                ? new Date(sale.date).toLocaleDateString("id-ID", {
                                    day: "numeric", month: "short", year: "numeric",
                                })
                                : "-",
                        };
                    })
                );

                if (type) {
                    flattened = flattened.filter((row) => row.type === type);
                }

                if (debouncedSearch) {
                    const q = debouncedSearch.toLowerCase();
                    flattened = flattened.filter(
                        (row) =>
                            row.idPenjualan.toLowerCase().includes(q) ||
                            row.kode.toLowerCase().includes(q)
                    );
                }

                // Hitung total dari SELURUH data hasil filter (sebelum di-slice per-halaman)
                const totalHargaJual = flattened.reduce((sum, row) => sum + row.hargaJual * row.quantity, 0);
                const totalHargaBeli = flattened.reduce((sum, row) => sum + row.hargaBeli * row.quantity, 0);
                const totalQtyKg = flattened
                    .filter((row) => row.type !== "ACCESSORIES" && row.type !== "AKSESORIS")
                    .reduce((sum, row) => sum + row.quantity, 0);
                const totalQtyPcs = flattened
                    .filter((row) => row.type === "ACCESSORIES" || row.type === "AKSESORIS")
                    .reduce((sum, row) => sum + row.quantity, 0);

                setTotalSummary({
                    totalHargaJual,
                    totalHargaBeli,
                    totalKeuntungan: totalHargaJual - totalHargaBeli,
                    totalQtyKg, // tambahan
                    totalQtyPcs, // tambahan
                });

                const totalRows = flattened.length;
                const totalPages = Math.max(1, Math.ceil(totalRows / pagination.limit));
                const start = (pagination.page - 1) * pagination.limit;
                const pageRows = flattened.slice(start, start + pagination.limit);

                setDetailSalesData(pageRows);
                setPagination((prev) => ({ ...prev, totalPages }));
            }
        } catch (err) {
            console.error("Fetch Detail Sales Error:", err);
            setError("Gagal memuat data detail penjualan.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, type, storeId, pagination.page, pagination.limit]);

    // EFFECT 1: Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // EFFECT 2: Reset page saat filter berubah
    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [storeId, type]);

    // EFFECT 3: Jalankan fetch
    useEffect(() => {
        fetchDetailSales();
    }, [fetchDetailSales]);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (newLimit) => {
        setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    return {
        detailSalesData,
        isLoading,
        error,
        totalSummary,
        search,
        setSearch,
        type,
        setType,
        storeId,
        setStoreId,
        storeOptions,
        pagination,
        handlePageChange,
        handleRowsPerPageChange,
    };
};