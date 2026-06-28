import { useState, useEffect, useCallback } from "react";
import { mutasiService } from "../../api/services/mutasiService.js";
import { storeService } from "../../api/services/storeService.js";
import { productService } from "../../api/services/productService.js";

export const useMutasiAdmin = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filterStoreId, setFilterStoreId] = useState("");

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const [storeOptions, setStoreOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    // State edit
    const [editMutasi, setEditMutasi] = useState(null);

    // State delete
    const [deleteMutasi, setDeleteMutasi] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // State success
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        storeService.getAll()
            .then((res) => {
                const stores = res.data || [];
                setStoreOptions(stores.map((s) => ({ label: s.name, value: s.id })));
            })
            .catch(() => {});

        productService.getAllProducts({ page: 1, limit: 100 })
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setProductOptions(
                    list.map((p) => ({
                        label: `[${p.code}] ${p.name} — ${p.type}`,
                        value: p.id,
                        code: p.code,
                        name: p.name,
                        type: p.type,
                        unit: p.unit,
                    }))
                );
            })
            .catch(() => {});
    }, []);

    const fetchMutasi = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await mutasiService.getAll({
                search,
                storeId: filterStoreId,
                page: pagination.page,
                limit: pagination.limit,
            });
            setData(res.data || []);
            if (res.pagination) {
                setPagination((prev) => ({
                    ...prev,
                    totalPages: res.pagination.totalPages || 1,
                    page: res.pagination.page || prev.page,
                }));
            }
        } catch (err) {
            setError("Gagal memuat data mutasi.");
        } finally {
            setLoading(false);
        }
    }, [search, filterStoreId, pagination.page, pagination.limit]);

    useEffect(() => {
        fetchMutasi();
    }, [fetchMutasi]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [search, filterStoreId]);

    // CREATE
    const handleCreate = async (payload) => {
        try {
            await mutasiService.create(payload);
            setSuccessMessage("Mutasi berhasil disimpan!");
            setIsSuccessOpen(true);
            await fetchMutasi();
            return { success: true };
        } catch (err) {
            alert("Gagal: " + (err.response?.data?.message || err.message));
            return { success: false };
        }
    };

    // EDIT — set editMutasi → form pre-fill
    const handleEdit = (mutasi) => {
        setEditMutasi(mutasi);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // DELETE
    const handleTriggerDelete = (mutasi) => {
        setDeleteMutasi(mutasi);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await mutasiService.delete(deleteMutasi.id);
            setIsDeleteOpen(false);
            setDeleteMutasi(null);
            setSuccessMessage("Mutasi berhasil dihapus!");
            setIsSuccessOpen(true);
            await fetchMutasi();
        } catch (err) {
            alert("Gagal menghapus: " + (err.response?.data?.message || err.message));
        } finally {
            setIsDeleting(false);
        }
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (newLimit) => {
        setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    // TAMBAHKAN FUNGSI UPDATE INI:
    const handleUpdate = async (payload) => {
        if (!editMutasi?.id) return { success: false };
        try {
            const res = await mutasiService.updateMutation(editMutasi.id, payload);
            if (res.success) {
                setSuccessMessage("Mutasi berhasil diperbarui!");
                setIsSuccessOpen(true);
                setEditMutasi(null); // Penting: Reset form kembali ke mode Tambah (Create)
                await fetchMutasi(); // Refresh data tabel
                return { success: true };
            }
        } catch (err) {
            alert("Gagal memperbarui mutasi: " + (err.response?.data?.message || err.message));
            return { success: false };
        }
    };

    return {
        data, loading, error,
        search, setSearch,
        filterStoreId, setFilterStoreId,
        storeOptions, productOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        handleCreate,
        handleUpdate,
        editMutasi, setEditMutasi, handleEdit,
        handleTriggerDelete, handleConfirmDelete,
        deleteMutasi, isDeleteOpen, isDeleting, setIsDeleteOpen, setDeleteMutasi,
        isSuccessOpen, successMessage, setIsSuccessOpen,
    };
};