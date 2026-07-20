import { useState, useEffect, useCallback } from "react";
import { stockOpnameService } from "../../api/services/stockOpnameService.js";

export const useStockOpnameManagementKaryawan = () => {
    const [opnameData, setOpnameData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });
    const [editOpname, setEditOpname] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const fetchOpname = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const res = await stockOpnameService.getAll({
                search: debouncedSearch,
                startDate: dateRange.startDate || undefined,
                endDate: dateRange.endDate || undefined,
                page: pagination.page,
                limit: pagination.limit,
                // storeId TIDAK dikirim, backend auto-scope ke cabang karyawan
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

    return {
        opnameData, isLoading, error,
        search, setSearch,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        editOpname, setEditOpname, handleEdit, handleUpdate, isUpdating,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        canManage: true,
    };
};