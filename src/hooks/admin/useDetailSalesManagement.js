import { useState, useEffect, useCallback } from "react";
import { salesService } from "../../api/services/salesService.js";
import { storeService } from "../../api/services/storeService.js";

export const useDetailSalesManagement = () => {
    const [detailSalesData, setDetailSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

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
                search: debouncedSearch,
                type,
                storeId,
                page: pagination.page,
                limit: pagination.limit,
            });

            if (res) {
                const sales = res.data || [];

                // Flatten: 1 baris tabel = 1 item produk dalam transaksi
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

                // Backend memfilter di level transaksi (kalau ADA item bertipe X, seluruh
                // transaksi ikut lolos). Filter tambahan ini memastikan baris yang tampil
                // benar-benar cuma item dengan tipe yang dipilih, bukan item lain yang
                // kebetulan satu transaksi.
                if (type) {
                    flattened = flattened.filter((row) => row.type === type);
                }

                // Search hanya mencocokkan ID Penjualan (orderNumber), bukan nama pelanggan
                if (debouncedSearch) {
                    flattened = flattened.filter((row) =>
                        row.idPenjualan.toLowerCase().includes(debouncedSearch.toLowerCase())
                    );
                }

                // Paginasi manual di level baris (item), bukan level transaksi
                const totalRows = flattened.length;
                const totalPages = Math.max(1, Math.ceil(totalRows / pagination.limit));
                const start = (pagination.page - 1) * pagination.limit;
                const pageRows = flattened.slice(start, start + pagination.limit);

                setDetailSalesData(pageRows);
                setPagination((prev) => ({ ...prev, totalPages }));

                // if (res.pagination) {
                //     setPagination((prev) => ({
                //         ...prev,
                //         totalPages: res.pagination.totalPages || 1,
                //     }));
                // }
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