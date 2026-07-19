import { useState, useEffect, useCallback } from "react";
import { orderService } from "../../api/services/orderService.js";
import { storeService } from "../../api/services/storeService.js";
import useAuthStore from "../../store/authStore.js";

export const useOrderManagement = ({ fixedStatus } = {}) => {
    const { user } = useAuthStore();
    const [orderData, setOrderData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [totalSummary, setTotalSummary] = useState({ totalItem: 0, totalHarga: 0 });

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]);

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const [editOrder, setEditOrder] = useState(null);
    const [deleteOrder, setDeleteOrder] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [statusOrder, setStatusOrder] = useState(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

    // State BARU untuk reject/batalkan PO
    const [rejectOrder, setRejectOrder] = useState(null);
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);

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

    const fetchOrders = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await orderService.getAll({
                search: debouncedSearch,
                type,
                storeId,
                status: fixedStatus,
                page: pagination.page,
                limit: pagination.limit
            });
            if (res) {
                setOrderData(res.data || []);
                if (res.pagination) {
                    setPagination(prev => ({ ...prev, totalPages: res.pagination.totalPages || 1 }));
                }
            }
        } catch (err) {
            console.error("Fetch Orders Error:", err);
            setError("Gagal memuat data pembelian.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, type, storeId, fixedStatus, pagination.page, pagination.limit]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [storeId, type]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handlePageChange = (newPage) => setPagination(prev => ({ ...prev, page: newPage }));
    const handleRowsPerPageChange = (newLimit) => setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));

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

    const handleEdit = (item) => {
        setEditOrder(item);
    };

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

    const triggerDelete = (item) => {
        setDeleteOrder(item);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await orderService.delete(deleteOrder.id);
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

    const triggerStatusChange = (item) => {
        if (item.status === "PENDING") {
            setStatusOrder(item);
            setIsStatusOpen(true);
        }
    };

    const confirmStatusChange = async () => {
        setIsUpdatingStatus(true);
        try {
            await orderService.updateStatus(statusOrder.id);
            setIsStatusOpen(false);
            setStatusOrder(null);
            setSuccessMessage("Barang berhasil diterima, stok bertambah!");
            setIsSuccessOpen(true);
            await fetchOrders();
        } catch (err) {
            alert("Gagal menerima barang: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    // Handler BARU untuk reject/batalkan PO ? hanya bisa dari status PENDING (raw backend value)
    const triggerRejectChange = (item) => {
        if (item.status === "PENDING") {
            setRejectOrder(item);
            setIsRejectOpen(true);
        }
    };

    const confirmRejectChange = async () => {
        setIsRejecting(true);
        try {
            await orderService.reject(rejectOrder.id);
            setIsRejectOpen(false);
            setRejectOrder(null);
            setSuccessMessage("Pesanan berhasil ditolak.");
            setIsSuccessOpen(true);
            await fetchOrders();
        } catch (err) {
            alert("Gagal menolak pesanan: " + (err.response?.data?.message || err.message));
        } finally {
            setIsRejecting(false);
        }
    };

    // fetch KHUSUS buat total ? filter sama kayak fetchOrders, tapi limit besar & selalu page 1
    const fetchTotalSummary = useCallback(async () => {
        try {
            const res = await orderService.getAll({
                search: debouncedSearch,
                type,
                storeId,
                status: fixedStatus,
                page: 1,
                limit: 1000,
            });
            if (res) {
                const list = res.data || [];
                const totalItem = list.reduce((sum, order) => sum + (order.items || []).length, 0);
                const totalHarga = list.reduce((sum, order) => {
                    const orderTotal = (order.items || []).reduce((s, item) => s + (item.totalPrice ?? 0), 0);
                    return sum + orderTotal;
                }, 0);
                setTotalSummary({ totalItem, totalHarga });
            }
        } catch (err) {
            console.error("Fetch Order Total Summary Error:", err);
        }
    }, [debouncedSearch, type, storeId, fixedStatus]);

    useEffect(() => {
        fetchTotalSummary();
    }, [fetchTotalSummary]);

    return {
        orderData, isLoading, error, fetchOrders,
        totalSummary,
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
        triggerStatusChange, confirmStatusChange,
        // Reject exports
        rejectOrder, isRejectOpen, setIsRejectOpen, isRejecting,
        triggerRejectChange, confirmRejectChange,
    };
};