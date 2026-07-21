import { useState, useEffect } from "react";
import { storeService } from "../../api/services/storeService.js";
import { productService } from "../../api/services/productService.js";
import { stockOpnameService } from "../../api/services/stockOpnameService.js";

export const useStockOpnameCreate = () => {
    const [storeOptions, setStoreOptions] = useState([]);
    const [selectedStore, setSelectedStore] = useState("");

    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const [rowData, setRowData] = useState({});

    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        storeService.getAll()
            .then((res) => {
                const stores = res.data || [];
                setStoreOptions(stores.map((s) => ({ label: s.name, value: s.id })));
            })
            .catch(() => {});
    }, []);

    useEffect(() => {
        if (!selectedStore) {
            setProducts([]);
            setRowData({});
            return;
        }

        setIsLoadingProducts(true);
        productService.getAllProducts({ page: 1, limit: 200 })
            .then((res) => {
                if (res && res.success) {
                    const mapped = res.data.map((p) => {
                        const storeStock = p.stockPerStore?.find((s) => s.store.id === selectedStore);
                        return {
                            id: p.id,
                            kode: p.code || "-",
                            namaBarang: p.name,
                            type: p.type,
                            unit: p.unit || "Kg",
                            stokSistem: storeStock ? storeStock.quantity : 0,
                        };
                    });
                    setProducts(mapped);
                    setRowData({});
                    setPagination((prev) => ({
                        ...prev, page: 1,
                        totalPages: Math.max(1, Math.ceil(mapped.length / prev.limit)),
                    }));
                }
            })
            .catch((err) => console.error("Error fetch products:", err))
            .finally(() => setIsLoadingProducts(false));
    }, [selectedStore]);

    const handleFieldChange = (productId, field, value) => {
        setRowData((prev) => ({
            ...prev,
            [productId]: {
                stokFisik: prev[productId]?.stokFisik ?? "",
                catatan: prev[productId]?.catatan ?? "",
                ...prev[productId],
                [field]: value,
            },
        }));
    };

    const getSelisih = (productId, stokSistem) => {
        const stokFisik = rowData[productId]?.stokFisik;
        if (stokFisik === undefined || stokFisik === "") return null;
        return Number(stokFisik) - stokSistem;
    };

    const filledCount = products.filter((p) => {
        const v = rowData[p.id]?.stokFisik;
        return v !== undefined && v !== "";
    }).length;

    const handlePageChange = (newPage) => setPagination((prev) => ({ ...prev, page: newPage }));
    const handleRowsPerPageChange = (newLimit) => {
        setPagination((prev) => ({
            ...prev, limit: newLimit, page: 1,
            totalPages: Math.max(1, Math.ceil(products.length / newLimit)),
        }));
    };

    const paginatedProducts = products.slice(
        (pagination.page - 1) * pagination.limit,
        pagination.page * pagination.limit
    );

    // Kirim SEMUA produk cabang, bukan cuma yang diisi — produk yang belum
    // dihitung tetap tersimpan sebagai baris item dengan stokFisik null.
    const buildItemsToSubmit = () => {
        return products.map((p) => {
            const stokFisikRaw = rowData[p.id]?.stokFisik;
            const hasStokFisik = stokFisikRaw !== undefined && stokFisikRaw !== "";
            return {
                productId: p.id,
                stokSistem: p.stokSistem,
                stokFisik: hasStokFisik ? Number(stokFisikRaw) : null,
                catatan: rowData[p.id]?.catatan?.trim() || undefined,
            };
        });
    };

    const handleSubmit = async () => {
        if (!selectedStore) { alert("Pilih cabang toko terlebih dahulu."); return; }
        if (products.length === 0) { alert("Tidak ada produk untuk cabang ini."); return; }
        if (filledCount === 0) { alert("Isi minimal 1 stok fisik produk sebelum menyimpan."); return; }

        const items = buildItemsToSubmit();

        // Validasi catatan wajib jika ada selisih (hanya untuk item yang sudah diisi)
        const missingNote = items.find((it) => {
            if (it.stokFisik === null) return false;
            const selisih = it.stokFisik - it.stokSistem;
            return selisih !== 0 && !it.catatan;
        });
        if (missingNote) {
            const product = products.find((p) => p.id === missingNote.productId);
            alert(`Produk "${product?.namaBarang}" memiliki selisih, catatan wajib diisi.`);
            return;
        }

        setIsSubmitting(true);
        try {
            await stockOpnameService.create({ storeId: selectedStore, items });
            setSuccessMessage(`Hasil opname untuk ${filledCount} produk berhasil disimpan sebagai draft!`);
            setIsSuccessOpen(true);
            setRowData({});
        } catch (err) {
            alert("Gagal menyimpan hasil opname: " + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        storeOptions, selectedStore, setSelectedStore,
        products, paginatedProducts,
        isLoadingProducts,
        rowData, handleFieldChange, getSelisih,
        filledCount,
        pagination, handlePageChange, handleRowsPerPageChange,
        isSubmitting, handleSubmit,
        isSuccessOpen, setIsSuccessOpen, successMessage,
    };
};