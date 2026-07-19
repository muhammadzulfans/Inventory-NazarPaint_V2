import { useState, useEffect, useCallback, useMemo } from "react";
import { mutasiService } from "../../api/services/mutasiService.js";
import { storeService } from "../../api/services/storeService.js";
import { productService } from "../../api/services/productService.js";

const flattenMutasiRows = (mutasiList) =>
    mutasiList.flatMap((mutasi) =>
        (mutasi.items || []).map((item, itemIndex) => ({
            mutasiId: mutasi.id,
            mutasiRaw: mutasi,
            status: mutasi.status || "PENDING",
            cabangPengirim: mutasi.fromStore?.name || "-",
            cabangPenerima: mutasi.toStore?.name || "-",
            fromStoreId: mutasi.fromStoreId,
            toStoreId: mutasi.toStoreId,
            note: mutasi.note || "",
            tanggal: mutasi.date,
            tanggalDisplay: mutasi.date
                ? new Date(mutasi.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                : "-",
            kode: item.product?.code || "-",
            namaBarang: item.product?.name || "-",
            type: item.product?.type || "-",
            quantity: item.quantity ?? 0,
            // Kg/Pcs diturunkan dari tipe produk, bukan dari field unit backend
            unit: item.product?.type === "ACCESSORIES" ? "Pcs" : "Kg",
            isFirst: itemIndex === 0,
        }))
    );

export const useMutasiAdmin = () => {
    const [allRows, setAllRows] = useState([]); // hasil flatten dari SELURUH data (limit besar)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [filterStoreId, setFilterStoreId] = useState("");

    const totalSummary = useMemo(() => {
        const totalKg = allRows.filter((r) => r.unit === "Kg").reduce((t, r) => t + r.quantity, 0);
        const totalPcs = allRows.filter((r) => r.unit === "Pcs").reduce((t, r) => t + r.quantity, 0);
        return { totalKg, totalPcs };
    }, [allRows]);

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const [storeOptions, setStoreOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    const [editMutasi, setEditMutasi] = useState(null);

    const [deleteMutasi, setDeleteMutasi] = useState(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [statusTarget, setStatusTarget] = useState(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

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
                        label: `[${p.code}] ${p.name} – ${p.type}`,
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

    // Fetch batch besar (bukan per-page), flatten dilakukan di sini,
    // pagination 10 baris/halaman dihitung manual dengan slice()
    const fetchMutasi = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await mutasiService.getAll({
                search,
                type,
                storeId: filterStoreId,
                page: 1,
                limit: 1000,
            });
            const flat = flattenMutasiRows(res.data || []);
            setAllRows(flat);
        } catch (err) {
            setError("Gagal memuat data mutasi.");
        } finally {
            setLoading(false);
        }
    }, [search, type, filterStoreId]);

    useEffect(() => {
        fetchMutasi();
    }, [fetchMutasi]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [search, type, filterStoreId]);

    // Recompute totalPages tiap kali data mentah / limit berubah
    useEffect(() => {
        setPagination((prev) => ({
            ...prev,
            totalPages: Math.max(1, Math.ceil(allRows.length / prev.limit)),
        }));
    }, [allRows]);

    const paginatedRows = useMemo(() => {
        const start = (pagination.page - 1) * pagination.limit;
        return allRows.slice(start, start + pagination.limit);
    }, [allRows, pagination.page, pagination.limit]);

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

    const handleEdit = (mutasi) => {
        setEditMutasi(mutasi);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

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

    const handleUpdate = async (payload) => {
        if (!editMutasi?.id) return { success: false };
        try {
            const res = await mutasiService.updateMutation(editMutasi.id, payload);
            if (res.success) {
                setSuccessMessage("Mutasi berhasil diperbarui!");
                setIsSuccessOpen(true);
                setEditMutasi(null);
                await fetchMutasi();
                return { success: true };
            }
        } catch (err) {
            alert("Gagal memperbarui mutasi: " + (err.response?.data?.message || err.message));
            return { success: false };
        }
    };

    const triggerStatusChange = (mutasi) => {
        setStatusTarget(mutasi);
        setIsStatusOpen(true);
    };

    const confirmStatusChange = async () => {
        setIsUpdatingStatus(true);
        try {
            if (statusTarget.status === "PENDING") {
                await mutasiService.send(statusTarget.id);
            } else if (statusTarget.status === "ON_GOING") {
                await mutasiService.receive(statusTarget.id);
            }
            setIsStatusOpen(false);
            setStatusTarget(null);
            setSuccessMessage("Status mutasi berhasil diperbarui!");
            setIsSuccessOpen(true);
            await fetchMutasi();
        } catch (err) {
            alert("Gagal mengubah status: " + (err.response?.data?.message || err.message));
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    const canChangeStatus = () => true;

    return {
        data: paginatedRows, loading, error,
        totalSummary,
        search, setSearch,
        type, setType,
        filterStoreId, setFilterStoreId,
        storeOptions, productOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        handleCreate,
        handleUpdate,
        editMutasi, setEditMutasi, handleEdit,
        handleTriggerDelete, handleConfirmDelete,
        deleteMutasi, isDeleteOpen, isDeleting, setIsDeleteOpen, setDeleteMutasi,
        isSuccessOpen, successMessage, setIsSuccessOpen,
        triggerStatusChange, confirmStatusChange,
        isStatusOpen, setIsStatusOpen, isUpdatingStatus, statusTarget,
        canChangeStatus,
    };
};