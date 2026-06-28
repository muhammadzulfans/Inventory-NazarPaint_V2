import { useState, useEffect, useCallback } from "react";
import { productService } from "../../api/services/productService.js"; // Sesuaikan path ke api lu
import { storeService } from "../../api/services/storeService.js";

export const useProductInventory = () => {
    // ==========================================
    // 1. FILTER & TABLE STATES
    // ==========================================
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [type, setType] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]); // options untuk dropdown cabang

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    // ==========================================
    // 2. CRUD & MODAL STATES (BARU DITAMBAHKAN)
    // ==========================================
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // State untuk Form Tambah/Edit
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'ADD' });

    // State untuk Delete
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState(null);

    // ==========================================
    // 3. FETCH LOGIC
    // ==========================================
    // Fetch cabang sekali saat mount
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

    const fetchProducts = useCallback(async () => {
        setIsLoading(true);
        const res = await productService.getAllProducts({
            search: debouncedSearch,
            type,
            storeId,
            page: pagination.page,
            limit: pagination.limit
        });
        if (res) {
            const list = res.data || [];

            const mappedList = list.map((item) => {
                let finalStock = item.totalStock ?? 0;

                if (storeId) {
                    // Cari stok cabang yang COCOK dengan storeId dropdown
                    const branchData = item.stockPerStore?.find(
                        (s) => String(s.store.id).toLowerCase() === String(storeId).toLowerCase()
                    );
                    // Jika ketemu ambil quantity-nya, jika tidak ada di list berarti stoknya 0
                    finalStock = branchData ? branchData.quantity : 0;
                }

                // Kembalikan objek produk baru dengan totalStock yang sudah disesuaikan per cabang
                return {
                    ...item,
                    totalStock: finalStock
                };
            });

            setProducts(mappedList);

            if (res.pagination) {
                setPagination(prev => ({
                    ...prev,
                    totalPages: res.pagination.totalPages || 1,
                }));
            }
        }
        setIsLoading(false);
    }, [debouncedSearch, type, storeId, pagination.page, pagination.limit]);

    // EFFECT 1: Handle Debounce Search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setDebouncedSearch(search);
            setPagination(prev => ({ ...prev, page: 1 }));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // EFFECT 2: Reset page saat storeId atau type berubah
    useEffect(() => {
        setPagination(prev => ({ ...prev, page: 1 }));
    }, [storeId, type]);

    // EFFECT 3: Trigger Fetch Data
    useEffect(() => {
        fetchProducts().catch((error) => {
            console.error("Gagal memuat produk:", error);
        });
    }, [fetchProducts]);

    // ==========================================
    // 4. PAGINATION HANDLERS
    // ==========================================
    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    // ==========================================
    // 5. CRUD HANDLERS (BARU DITAMBAHKAN)
    // ==========================================

    // Handler Buka Modal Tambah/Edit
    const openModal = (type, item = null) => {
        if (type === 'EDIT' && item) {
            setSelectedProduct({
                id: item.id,
                kodeBarang: item.code || "",
                namaBarang: item.name || "",
                tipeBarang: item.type || "",
                hargaPokok: item.basePrice || "",
                hargaJual: item.sellPrice || "",
            });
        } else {
            setSelectedProduct({
                id: null,
                kodeBarang: "", namaBarang: "",
                tipeBarang: "", hargaPokok: "", hargaJual: ""
            });
        }
        setModalConfig({ isOpen: true, type });
    };

    // Handler Simpan Data (Create/Update)
    const handleSaveProduct = async (payload, type) => {
        let result;
        if (type === 'ADD') {
            result = await productService.createProduct(payload);
        } else {
            result = await productService.updateProduct(payload.id, payload);
        }

        if (result?.success) {
            setSuccessMessage(
                type === 'ADD'
                    ? "Data produk berhasil ditambahkan!"
                    : "Data produk berhasil diperbarui!"
            );
            setModalConfig(prev => ({ ...prev, isOpen: false }));
            setIsSuccessOpen(true);
            await fetchProducts(); // Refresh tabel
            return true;
        } else {
            alert(result?.message || "Gagal memproses produk.");
            return false;
        }
    };

    // Handler Trigger Modal Hapus
    const triggerDelete = (item) => {
        setProductToDelete({ id: item.id, name: item.name || "Produk Tanpa Nama" });
        setIsDeleteOpen(true);
    };

    // Handler Konfirmasi Hapus
    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            const result = await productService.deleteProduct(productToDelete.id);
            if (result?.success) {
                setIsDeleteOpen(false);
                setSuccessMessage("Data produk berhasil dihapus!");
                setIsSuccessOpen(true);
                await fetchProducts(); // Refresh tabel
            } else {
                alert(result?.message || "Gagal menghapus produk.");
            }
        } catch (err) {
            alert(err.response?.data?.message || "Terjadi kesalahan sistem.");
        } finally {
            setIsLoading(false);
        }
    };

    // ==========================================
    // 6. RETURN SEMUA STATES & FUNCTIONS
    // ==========================================
    return {
        // Table & Filter States
        products,
        isLoading,
        setIsLoading,
        search,
        setSearch,
        type,
        setType,
        storeId,
        setStoreId,
        storeOptions,
        pagination,
        setPagination,
        fetchProducts,
        handlePageChange,
        handleRowsPerPageChange,

        // CRUD States
        isSuccessOpen, setIsSuccessOpen, successMessage,
        selectedProduct, setSelectedProduct,
        modalConfig, setModalConfig,
        isDeleteOpen, setIsDeleteOpen,
        productToDelete, setProductToDelete,

        // CRUD Functions
        openModal, handleSaveProduct,
        triggerDelete, handleConfirmDelete
    };
};