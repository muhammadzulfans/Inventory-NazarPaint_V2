import { useState, useEffect, useCallback } from "react";
import { orderService } from "../../api/services/orderService.js";
import { storeService } from "../../api/services/storeService.js";
import useAuthStore from "../../store/authStore.js";

export const useOrderManagement = () => {
    const { user } = useAuthStore();
    const [orderData, setOrderData] = useState([]);
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

    // CRUD & Modal States
    const [editOrder, setEditOrder] = useState(null);
    const [deleteOrder, setDeleteOrder] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Status Modal States
    const [statusOrder, setStatusOrder] = useState(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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

    // FETCH 2: Ambil data order/pembelian
    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await orderService.getAll({
                search: debouncedSearch,
                type,
                storeId,
                page: pagination.page,
                limit: pagination.limit
            });
            if (res) {
                // Langsung set raw data kayak di sales
                setOrderData(res.data || []);
                if (res.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        totalPages: res.pagination.totalPages || 1
                    }));
                }
            }
        } catch (err) {
            console.error("Fetch Orders Error:", err);
            setError("Gagal memuat data pembelian.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, type, storeId, pagination.page, pagination.limit]);

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
    }, [storeId, type]);

    // EFFECT 3: Jalankan fetchOrders saat dependensi siap
    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

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
            await orderService.create({ ...payload, userId: user?.id });
            setSuccessMessage("Transaksi berhasil ditambahkan!");
            setIsSuccessOpen(true);
            await fetchOrders();
        } catch (err) {
            alert("Gagal: " + (err.response?.data?.message || err.message));
        }
    };

    // HANDLER CRUD: Trigger Edit
    const handleEdit = (item) => {
        setEditOrder(item);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // HANDLER CRUD: Update
    const handleUpdate = async (purchaseId, payload) => {
        try {
            await orderService.update(purchaseId, payload);
            setEditOrder(null);
            setSuccessMessage("Transaksi berhasil diperbarui!");
            setIsSuccessOpen(true);
            await fetchOrders();
        } catch (err) {
            alert("Gagal memperbarui: " + (err.response?.data?.message || err.message));
        }
    };

    // HANDLER CRUD: Trigger Delete
    const triggerDelete = (item) => {
        setDeleteOrder(item);
        setIsDeleteOpen(true);
    };

    // HANDLER CRUD: Confirm Delete
    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await orderService.delete(deleteOrder.purchaseId);
            setIsDeleteOpen(false);
            setDeleteOrder(null);
            setSuccessMessage("Transaksi berhasil dihapus!");
            setIsSuccessOpen(true);
            await fetchOrders();
        } catch (err) {
            alert("Gagal menghapus: " + (err.response?.data?.message || err.message));
        } finally {
            setIsDeleting(false);
        }
    };

    // HANDLER STATUS
    const triggerStatusChange = (item) => {
        if (item.status === "PENDING") {
            setStatusOrder(item);
            setIsStatusOpen(true);
        }
    };

    const confirmStatusChange = async () => {
        setIsUpdatingStatus(true);
        try {
            // Cukup kirim ID purchase-nya aja ke endpoint /receive
            await orderService.updateStatus(statusOrder.purchaseId);

            setIsStatusOpen(false);
            setStatusOrder(null);
            setSuccessMessage("Barang berhasil diterima, stok bertambah!");
            setIsSuccessOpen(true);

            // Refresh tabel biar badge berubah
            await fetchOrders();
        } catch (err) {
            console.error("Error terima barang:", err);
            alert("Gagal menerima barang: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return {
        orderData, isLoading, error,
        search, setSearch,
        type, setType,
        storeId, setStoreId, storeOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        editOrder, setEditOrder,
        deleteOrder, setDeleteOrder,
        isDeleteOpen, setIsDeleteOpen,
        isDeleting,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        isStatusOpen, setIsStatusOpen, isUpdatingStatus,
        handleTambah, handleEdit, handleUpdate, triggerDelete, confirmDelete,
        triggerStatusChange, confirmStatusChange
    };
};