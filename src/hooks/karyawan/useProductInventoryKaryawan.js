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
            }
        }
        setIsLoading(false);
    }, [debouncedSearch, type, pagination.page, pagination.limit]);

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
        storeId, // dipakai TableAdmin buat nampilin stok cabang karyawan sendiri
        pagination, handlePageChange, handleRowsPerPageChange,
    };
};