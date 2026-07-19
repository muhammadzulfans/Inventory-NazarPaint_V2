import { useState, useEffect, useCallback } from "react";
import { productService } from "../../api/services/productService.js";
import useAuthStore from "../../store/authStore.js";

export const useProductInventoryKaryawan = () => {
    const { user } = useAuthStore();
    const storeId = user?.storeId || "";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    const [totalSummary, setTotalSummary] = useState({
        totalStokKg: 0, totalStokPcs: 0, hasKg: false, hasPcs: false,
    });
    const [totalCount, setTotalCount] = useState(0);

    const getUnit = (item) => {
        const t = (item.type || "").toUpperCase();
        return (t === "ACCESSORIES" || t === "AKSESORIS") ? "Pcs" : "Kg";
    };

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        const res = await productService.getAllProducts({
            search: debouncedSearch,
            type,
            page: pagination.page,
            limit: pagination.limit,
        });
        if (res) {
            setProducts(res.data || []);
            if (res.pagination) {
                setPagination((prev) => ({
                    ...prev,
                    totalPages: res.pagination.totalPages || 1,
                }));
                setTotalCount(res.pagination.total || 0);
            }
        }
        setIsLoading(false);
    }, [debouncedSearch, type, pagination.page, pagination.limit]);

    // fetch KHUSUS buat total ? filter sama kayak fetchProducts, tapi limit besar & selalu page 1
    const fetchTotalSummary = useCallback(async () => {
        const res = await productService.getAllProducts({
            search: debouncedSearch,
            type,
            page: 1,
            limit: 1000,
        });
        if (res) {
            const list = res.data || [];
            let totalStokKg = 0, totalStokPcs = 0, hasKg = false, hasPcs = false;

            list.forEach((item) => {
                const stock = storeId
                    ? (item.stockPerStore?.find((s) => String(s.store.id).toLowerCase() === String(storeId).toLowerCase())?.quantity ?? 0)
                    : (item.totalStock ?? 0);

                if (getUnit(item) === "Kg") { totalStokKg += stock; hasKg = true; }
                else { totalStokPcs += stock; hasPcs = true; }
            });

            setTotalSummary({ totalStokKg, totalStokPcs, hasKg, hasPcs });
        }
    }, [debouncedSearch, type, storeId]);
    // ? sengaja TIDAK include pagination.page/limit, biar gak fetch ulang pas cuma ganti halaman

    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination((prev) => ({ ...prev, page: 1 }));
        }, 500);
        return () => clearTimeout(t);
    }, [search]);

    useEffect(() => {
        setPagination((prev) => ({ ...prev, page: 1 }));
    }, [type]);

    useEffect(() => {
        fetchProducts().catch((err) => console.error("Gagal memuat produk:", err));
    }, [fetchProducts]);

    useEffect(() => {
        fetchTotalSummary().catch((err) => console.error("Gagal memuat total stok:", err));
    }, [fetchTotalSummary]);

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (newLimit) => {
        setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
    };

    return {
        products, isLoading,
        search, setSearch,
        type, setType,
        storeId,
        pagination, handlePageChange, handleRowsPerPageChange,
        totalSummary,
        totalCount,
    };
};