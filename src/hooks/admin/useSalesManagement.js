import { useState, useEffect, useCallback } from "react";
import { salesService } from "../../api/services/salesService.js";
import { storeService } from "../../api/services/storeService.js";
import useAuthStore from "../../store/authStore.js";

export const useSalesManagement = () => {
    const { user } = useAuthStore();
    const [salesData, setSalesData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [totalSummary, setTotalSummary] = useState({ totalItem: 0, totalHarga: 0 });

    // Filter States
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    // CRUD & Modal States
    const [editSale, setEditSale] = useState(null);
    const [deleteSale, setDeleteSale] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);

    // State Warning / Validasi
    const [setIsWarningOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

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

    // FETCH 2: Ambil data penjualan
    const fetchSales = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await salesService.getAll({
                search: debouncedSearch,
                type,
                storeId,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                page: pagination.page,
                limit: pagination.limit
            });
            if (res) {
                setSalesData(res.data || []);
                if (res.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        totalPages: res.pagination.totalPages || 1
                    }));
                }
            }
        } catch (err) {
            console.error("Fetch Sales Error:", err);
            setError("Gagal memuat data penjualan.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, type, storeId, dateRange, pagination.page, pagination.limit]);

    // EFFECT 1: Handle Debounce Search (Penundaan ketik 500ms)
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // EFFECT 2: Reset page ke 1 setiap kali filter cabang atau tipe diubah
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [storeId, type, dateRange]);

    // EFFECT 3: Jalankan fetchSales saat dependensi siap
    useEffect(() => {
        fetchSales();
    }, [fetchSales]);

    // HANDLER PAGINATION
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    // HANDLER CRUD: Create
    const handleTambah = async (payload) => {
        try {
            await salesService.create({ ...payload, userId: user?.id });
            setSuccessMessage("Transaksi berhasil ditambahkan!");
            setIsSuccessOpen(true);
            await fetchSales();
        } catch (err) {
            alert("Gagal: " + (err.response?.data?.message || err.message));
        }
    };

    // HANDLER CRUD: Trigger Edit
    const handleEdit = (item) => {
        setEditSale(item);
    };

    // HANDLER CRUD: Update
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

    // HANDLER CRUD: Trigger Delete
    const triggerDelete = (item) => {
        setDeleteSale(item);
        setIsDeleteOpen(true);
    };

    // HANDLER CRUD: Confirm Delete
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await salesService.delete(deleteSale.id);
            setIsDeleteOpen(false);
            setDeleteSale(null);
            setSuccessMessage("Transaksi berhasil dihapus!");
            setIsSuccessOpen(true);
            await fetchSales();
        } catch (err) {
            setWarningMessage(err?.message || "Transaksi gagal diproses. Silakan coba lagi.");
            setIsWarningOpen(true);
            // alert("Gagal menghapus: " + (err.response?.data?.message || err.message));
        } finally {
            setIsDeleting(false);
        }
    };

    const fetchTotalSummary = useCallback(async () => {
        const res = await salesService.getAll({
            search: debouncedSearch,
            type,
            storeId,
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
            page: 1,
            limit: 1000,
        });
        if (res) {
            const list = res.data || [];
            const totalItem = list.reduce((sum, sale) => sum + (sale.itemCount ?? (sale.items || []).length), 0);
            const totalHarga = list.reduce((sum, sale) => {
                const saleTotal = (sale.items || []).reduce((s, item) => s + (item.totalPrice ?? 0), 0);
                return sum + saleTotal;
            }, 0);
            setTotalSummary({ totalItem, totalHarga });
        }
    }, [debouncedSearch, type, storeId, dateRange]);

    useEffect(() => {
        fetchTotalSummary().catch((err) => console.error("Gagal memuat total penjualan:", err));
    }, [fetchTotalSummary]);

    return {
        salesData, isLoading, error,
        totalSummary,
        search, setSearch,
        type, setType,
        storeId, setStoreId, storeOptions,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        editSale, setEditSale,
        deleteSale, setDeleteSale,
        isDeleteOpen, setIsDeleteOpen,
        isDeleting,
        isUpdating,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        handleTambah, handleEdit, handleUpdate, triggerDelete, confirmDelete
    };
};