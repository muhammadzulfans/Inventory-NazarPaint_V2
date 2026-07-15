import { useState, useEffect, useCallback } from "react";
import { salesService } from "../../api/services/salesService.js";

export const useSalesManagementKaryawan = () => {
    const [salesData, setSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const [editSale, setEditSale] = useState(null);
    const [deleteSale, setDeleteSale] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    const fetchSales = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await salesService.getAll({
                search: debouncedSearch,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                page: pagination.page,
                limit: pagination.limit,
            });
            if (res) {
                setSalesData(res.data || []);
                if (res.pagination) {
                    setPagination((prev) => ({ ...prev, totalPages: res.pagination.totalPages || 1 }));
                }
            }
        } catch (err) {
            console.error("Fetch Sales Error:", err);
            setError("Gagal memuat data penjualan.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, dateRange, pagination.page, pagination.limit]);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [dateRange]);

    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
    const handleRowsPerPageChange = (newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));

    // Karyawan cuma boleh edit transaksi HARI INI (sesuai validasi backend)
    const canEditSale = (sale) => {
        if (!sale?.date) return false;
        const saleDate = new Date(sale.date);
        const today = new Date();
        return saleDate.toDateString() === today.toDateString();
    };

    const handleEdit = (item) => {
        setEditSale(item);
    };

    const handleUpdate = async (saleId, payload) => {
        setIsUpdating(true);
        try {
            await salesService.update(saleId, payload);
            setEditSale(null);
            setSuccessMessage("Transaksi berhasil diperbarui!");
            setIsSuccessOpen(true);
            await fetchSales();
        } catch (err) {
            alert("Gagal memperbarui: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdating(false);
        }
    };

    // Karyawan TIDAK BISA hapus transaksi sama sekali (sesuai validasi backend sales.service.js)
    const triggerDelete = () => {
        alert("Anda tidak memiliki izin untuk menghapus transaksi.");
    };

    const confirmDelete = async () => {}; // no-op, tombol delete tidak pernah trigger modal untuk karyawan

    return {
        salesData, isLoading, error,
        search, setSearch,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        editSale, setEditSale,
        deleteSale, setDeleteSale,
        isDeleteOpen, setIsDeleteOpen,
        isDeleting,
        isUpdating,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        handleEdit, handleUpdate, triggerDelete, confirmDelete,
        canEditSale,
    };
};