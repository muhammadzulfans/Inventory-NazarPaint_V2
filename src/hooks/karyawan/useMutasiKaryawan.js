import { useState, useEffect, useCallback, useMemo } from "react";
import { mutasiService } from "../../api/services/mutasiService.js";
import useAuthStore from "../../store/authStore.js";

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
            unit: item.product?.type === "ACCESSORIES" ? "Pcs" : "Kg",
            isFirst: itemIndex === 0,
        }))
    );

export const useMutasiKaryawan = () => {
    const [allRows, setAllRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const totalSummary = useMemo(() => {
        const totalKg = allRows.filter((r) => r.unit === "Kg").reduce((t, r) => t + r.quantity, 0);
        const totalPcs = allRows.filter((r) => r.unit === "Pcs").reduce((t, r) => t + r.quantity, 0);
        return { totalKg, totalPcs };
    }, [allRows]);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    const { user } = useAuthStore();

    const [statusTarget, setStatusTarget] = useState(null);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const fetchMutasi = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await mutasiService.getAll({
                search: debouncedSearch,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
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
    }, [debouncedSearch, dateRange]);

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
        fetchMutasi();
    }, [fetchMutasi]);

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

    const canChangeStatus = (mutasi) => {
        if (mutasi.status === "PENDING") return mutasi.fromStoreId === user?.storeId;
        if (mutasi.status === "ON_GOING") return mutasi.toStoreId === user?.storeId;
        return false;
    };

    const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
    const handleRowsPerPageChange = (newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));

    return {
        data: paginatedRows, loading, error,
        totalSummary,
        search, setSearch,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        triggerStatusChange, confirmStatusChange,
        isStatusOpen, setIsStatusOpen, isUpdatingStatus, statusTarget,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        canChangeStatus,
    };
};