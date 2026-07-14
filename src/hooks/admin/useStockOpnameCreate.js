import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { storeService } from "../../api/services/storeService.js";
import { productService } from "../../api/services/productService.js";

export const useStockOpnameCreate = () => {
    const location = useLocation();
    const editOpname = location.state?.editOpname || null;

    const [storeOptions, setStoreOptions] = useState([]);
    const [selectedStore, setSelectedStore] = useState(editOpname?.storeId || "");
    const [editingId, setEditingId] = useState(editOpname?.id || null);

    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const [rowData, setRowData] = useState(() => {
        if (!editOpname) return {};
        const initial = {};
        editOpname.items.forEach((it) => {
            initial[it.productId] = {
                stokFisik: String(it.stokFisik),
                catatan: it.catatan || "",
            };
        });
        return initial;
    });

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
            if (!editOpname) setRowData({});
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
                    // Jangan reset rowData kalau lagi mode edit dan baru pertama load
                    if (!editOpname) setRowData({});
                    setPagination((prev) => ({
                        ...prev,
                        page: 1,
                        totalPages: Math.max(1, Math.ceil(mapped.length / prev.limit)),
                    }));
                }
            })
            .catch((err) => console.error("Error fetch products:", err))
            .finally(() => setIsLoadingProducts(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
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

    const buildItemsToSubmit = () => {
        return products
            .filter((p) => {
                const v = rowData[p.id]?.stokFisik;
                return v !== undefined && v !== "";
            })
            .map((p) => {
                const stokFisik = Number(rowData[p.id].stokFisik);
                const selisih = stokFisik - p.stokSistem;
                return {
                    productId: p.id, kode: p.kode, namaBarang: p.namaBarang,
                    type: p.type, unit: p.unit,
                    stokSistem: p.stokSistem, stokFisik, selisih,
                    catatan: rowData[p.id]?.catatan?.trim() || "",
                };
            });
    };

    const handleSubmit = async () => {
        if (!selectedStore) { alert("Pilih cabang toko terlebih dahulu."); return; }

        const items = buildItemsToSubmit();
        if (items.length === 0) { alert("Isi minimal 1 stok fisik produk sebelum menyimpan."); return; }

        const missingNote = items.find((it) => it.selisih !== 0 && !it.catatan);
        if (missingNote) {
            alert(`Produk "${missingNote.namaBarang}" memiliki selisih, catatan wajib diisi.`);
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            console.log(editingId ? "Update Stock Opname (dummy):" : "Create Stock Opname (dummy):", {
                id: editingId,
                storeId: selectedStore,
                date: new Date().toISOString(),
                status: "DRAFT",
                items,
            });

            setSuccessMessage(
                editingId
                    ? "Draft stock opname berhasil diperbarui!"
                    : `Hasil opname untuk ${items.length} produk berhasil disimpan sebagai draft!`
            );
            setIsSuccessOpen(true);
            if (!editingId) setRowData({});
        } catch (err) {
            alert("Gagal menyimpan hasil opname.");
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
        isEditing: !!editingId,
    };
};