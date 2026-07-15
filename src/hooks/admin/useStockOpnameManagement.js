import { useState, useEffect, useCallback } from "react";
import { stockOpnameService } from "../../api/services/stockOpnameService.js";
import { storeService } from "../../api/services/storeService.js";
import useAuthStore from "../../store/authStore.js";

export const useStockOpnameManagement = ({ fixedStatus } = {}) => {
    const { user } = useAuthStore();
    const isOwner = user?.role === "OWNER";

    const [opnameData, setOpnameData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // Finalisasi (DRAFT -> SELESAI)
    const [finalizeTarget, setFinalizeTarget] = useState(null);
    const [isFinalizeOpen, setIsFinalizeOpen] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

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
                status: fixedStatus,
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
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
            console.error("Fetch Stock Opname Error:", err);
            setError("Gagal memuat data stock opname.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, storeId, fixedStatus, dateRange, pagination.page, pagination.limit]);

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [storeId, dateRange]);

    useEffect(() => {
        fetchOpname();
    }, [fetchOpname]);

    const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
    const handleRowsPerPageChange = (newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));

    const triggerFinalize = (opname) => {
        if (!isOwner) {
            alert("Hanya OWNER yang bisa menyelesaikan stock opname.");
            return;
        }
        if (opname.status !== "DRAFT") return;
        setFinalizeTarget(opname);
        setIsFinalizeOpen(true);
    };

    const confirmFinalize = async () => {
        setIsFinalizing(true);
        try {
            await stockOpnameService.selesai(finalizeTarget.id);
            setIsFinalizeOpen(false);
            setFinalizeTarget(null);
            setSuccessMessage("Stock opname diselesaikan, stok sistem sudah disesuaikan!");
            setIsSuccessOpen(true);
            await fetchOpname();
        } catch (err) {
            alert("Gagal menyelesaikan: " + (err.response?.data?.message || err.message));
        } finally {
            setIsFinalizing(false);
        }
    };

    const handleEditSubmit = async (opname, items) => {
        // Backend tidak punya endpoint update — edit dilakukan dengan
        // menghapus draft lama lalu membuat draft baru dengan data terkini.
        await stockOpnameService.delete(opname.id);
        await stockOpnameService.create({ storeId: opname.storeId, items });

        setSuccessMessage("Draft stock opname berhasil diperbarui!");
        setIsSuccessOpen(true);
        await fetchOpname();
    };

    return {
        opnameData, isLoading, error, fetchOpname,
        search, setSearch,
        storeId, setStoreId, storeOptions,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        isOwner,
        finalizeTarget, isFinalizeOpen, setIsFinalizeOpen, isFinalizing, triggerFinalize, confirmFinalize,
        handleEditSubmit,
        isSuccessOpen, setIsSuccessOpen, successMessage,
    };
};