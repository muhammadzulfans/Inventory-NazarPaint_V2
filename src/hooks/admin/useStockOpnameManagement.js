import { useState, useEffect, useCallback } from "react";
import { storeService } from "../../api/services/storeService.js";
import { STOCK_OPNAME_DUMMY } from "../../dummy/dataAdmin/Data/stockOpnameDummyData.js";

// ⚠️ SEMENTARA: backend /stock-opname belum siap, jadi pakai dummy data.
// Ganti bagian fetch di bawah dengan stockOpnameService.getAll() begitu backend jadi.

export const useStockOpnameManagement = ({ fixedStatus } = {}) => {
    const [opnameData, setOpnameData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

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
            // Simulasi delay network biar kerasa kayak fetch asli
            await new Promise((resolve) => setTimeout(resolve, 200));

            let result = [...STOCK_OPNAME_DUMMY];

            if (fixedStatus) {
                result = result.filter((o) => o.status === fixedStatus);
            }
            if (storeId) {
                result = result.filter((o) => o.storeId === storeId);
            }
            if (debouncedSearch) {
                const q = debouncedSearch.toLowerCase();
                result = result.filter((o) =>
                    o.id.toLowerCase().includes(q) ||
                    o.items.some((it) => it.namaBarang.toLowerCase().includes(q) || it.kode.includes(q))
                );
            }
            if (dateRange.startDate && dateRange.endDate) {
                const start = new Date(`${dateRange.startDate}T00:00:00`);
                const end = new Date(`${dateRange.endDate}T23:59:59`);
                result = result.filter((o) => {
                    const d = new Date(o.tanggal);
                    return d >= start && d <= end;
                });
            }

            const totalRows = result.length;
            const totalPages = Math.max(1, Math.ceil(totalRows / pagination.limit));
            const startIdx = (pagination.page - 1) * pagination.limit;
            const pageRows = result.slice(startIdx, startIdx + pagination.limit);

            setOpnameData(pageRows);
            setPagination((prev) => ({ ...prev, totalPages }));
        } catch (err) {
            console.error("Fetch Stock Opname Error:", err);
            setError("Gagal memuat data stock opname.");
        } finally {
            setIsLoading(false);
        }
    }, [debouncedSearch, storeId, dateRange, fixedStatus, pagination.page, pagination.limit]);

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

    return {
        opnameData, isLoading, error,
        search, setSearch,
        storeId, setStoreId, storeOptions,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
    };
};