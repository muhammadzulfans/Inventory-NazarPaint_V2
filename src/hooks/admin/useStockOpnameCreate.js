import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { storeService } from "../../api/services/storeService.js";
import { productService } from "../../api/services/productService.js";
import { stockOpnameService } from "../../api/services/stockOpnameService.js";

export const useStockOpnameCreate = () => {
    const location = useLocation();
    const editOpname = location.state?.editOpname || null;

    const [storeOptions, setStoreOptions] = useState([]);
    const [selectedStore, setSelectedStore] = useState(editOpname?.storeId || "");
    const [editingId] = useState(editOpname?.id || null);

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
                    if (!editOpname) setRowData({});
                    setPagination((prev) => ({
                        ...prev, page: 1,
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
            .map((p) => ({
                productId: p.id,
                stokFisik: Number(rowData[p.id].stokFisik),
                catatan: rowData[p.id]?.catatan?.trim() || undefined,
            }));
    };

    const handleSubmit = async () => {
        if (!selectedStore) { alert("Pilih cabang toko terlebih dahulu."); return; }

        const items = buildItemsToSubmit();
        if (items.length === 0) { alert("Isi minimal 1 stok fisik produk sebelum menyimpan."); return; }

        // Validasi catatan wajib jika ada selisih
        const missingNote = items.find((it) => {
            const product = products.find((p) => p.id === it.productId);
            const selisih = it.stokFisik - (product?.stokSistem ?? 0);
            return selisih !== 0 && !it.catatan;
        });
        if (missingNote) {
            const product = products.find((p) => p.id === missingNote.productId);
            alert(`Produk "${product?.namaBarang}" memiliki selisih, catatan wajib diisi.`);
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = { storeId: selectedStore, items };

            if (editingId) {
                // Backend tidak punya endpoint update — edit dilakukan dengan
                // menghapus draft lama lalu membuat draft baru dengan data terkini.
                await stockOpnameService.delete(editingId);
                await stockOpnameService.create(payload);
                setSuccessMessage("Draft stock opname berhasil diperbarui!");
            } else {
                await stockOpnameService.create(payload);
                setSuccessMessage(`Hasil opname untuk ${items.length} produk berhasil disimpan sebagai draft!`);
            }

            setIsSuccessOpen(true);
            if (!editingId) setRowData({});
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
        isEditing: !!editingId,
    };
};