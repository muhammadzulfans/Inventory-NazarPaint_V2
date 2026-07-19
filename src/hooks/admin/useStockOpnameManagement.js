import { useState, useEffect, useCallback } from "react";
import { stockOpnameService } from "../../api/services/stockOpnameService.js";
import { storeService } from "../../api/services/storeService.js";

export const useStockOpnameManagement = () => {
    const [opnameData, setOpnameData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]);

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const [editOpname, setEditOpname] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const [deleteOpname, setDeleteOpname] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [finalizeTarget, setFinalizeTarget] = useState(null);
    const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const fetchOpname = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await stockOpnameService.getAll({
                search: debouncedSearch,
                storeId,
                page: pagination.page,
                limit: pagination.limit,
            });
            if (res) {
                setOpnameData(res.data || []);
                if (res.pagination) {
                    setPagination((prev) => ({ ...prev, totalPages: res.pagination.totalPages || 1 }));
                }
            }
        } catch (err) {
            setError("Gagal memuat data stock opname.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, storeId, pagination.page, pagination.limit]);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [storeId]);

    useEffect(() => {
        fetchOpname();
    }, [fetchOpname]);

    const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
    const handleRowsPerPageChange = (newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));

    const handleEdit = (row) => {
        setEditOpname(row);
    };

    const handleUpdate = async (opname, items) => {
        setIsUpdating(true);
        try {
            await stockOpnameService.update(opname.id, { items });
            setEditOpname(null);
            setSuccessMessage("Stock opname berhasil diperbarui!");
            setIsSuccessOpen(true);
            await fetchOpname();
        } catch (err) {
            alert("Gagal memperbarui: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdating(false);
        }
    };

    const triggerDelete = (row) => {
        setDeleteOpname(row);
        setIsDeleteOpen(true);
    };

    const confirmDelete = async () => {
        setIsDeleting(true);
        try {
            await stockOpnameService.delete(deleteOpname.id);
            setIsDeleteOpen(false);
            setDeleteOpname(null);
            setSuccessMessage("Stock opname berhasil dihapus!");
            setIsSuccessOpen(true);
            await fetchOpname();
        } catch (err) {
            alert("Gagal menghapus: " + (err.response?.data?.message || err.message));
        } finally {
            setIsDeleting(false);
        }
    };

    const triggerFinalize = (row) => {
        setFinalizeTarget(row);
        setIsFinalizeOpen(true);
    };

    const confirmFinalize = async () => {
        setIsFinalizing(true);
        try {
            await stockOpnameService.selesai(finalizeTarget.id);
            setIsFinalizeOpen(false);
            setFinalizeTarget(null);
            setSuccessMessage("Stock opname berhasil diselesaikan!");
            setIsSuccessOpen(true);
            await fetchOpname();
        } catch (err) {
            alert("Gagal menyelesaikan: " + (err.response?.data?.message || err.message));
        } finally {
            setIsFinalizing(false);
        }
    };

    return {
        opnameData, isLoading, error,
        search, setSearch,
        storeId, setStoreId, storeOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        editOpname, setEditOpname, handleEdit, handleUpdate, isUpdating,
        deleteOpname, setDeleteOpname, isDeleteOpen, setIsDeleteOpen, isDeleting, triggerDelete, confirmDelete,
        finalizeTarget, isFinalizeOpen, setIsFinalizeOpen, isFinalizing, triggerFinalize, confirmFinalize,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        isOwner: true,
    };
};