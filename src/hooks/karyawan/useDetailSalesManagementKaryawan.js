import { useState, useEffect, useCallback } from "react";
import { salesService } from "../../api/services/salesService.js";

export const useDetailSalesManagementKaryawan = () => {
    const [detailSalesData, setDetailSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [totalSummary, setTotalSummary] = useState({
        totalHargaJual: 0, totalHargaBeli: 0, totalKeuntungan: 0,
        totalQtyKg: 0, totalQtyPcs: 0,
    });

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("");

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const fetchDetailSales = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await salesService.getAll({
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
                    totalQtyKg,
                    totalQtyPcs,
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
    }, [debouncedSearch, type, pagination.page, pagination.limit]);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [type]);

    useEffect(() => {
        fetchDetailSales();
    }, [fetchDetailSales]);

    const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
    const handleRowsPerPageChange = (newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));

    return {
        detailSalesData, isLoading, error,
        totalSummary,
        search, setSearch,
        type, setType,
        pagination, handlePageChange, handleRowsPerPageChange,
    };
};