import { useState, useEffect } from "react";
import { storeService } from "../../api/services/storeService.js";
import { productService } from "../../api/services/productService.js";
import { stockOpnameService } from "../../api/services/stockOpnameService.js";
import useAuthStore from "../../store/authStore.js";

export const useStockOpnameCreateKaryawan = () => {
    const { user } = useAuthStore();
    const storeId = user?.storeId || "";

    const [products, setProducts] = useState([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    const [rowData, setRowData] = useState({});
    const [pagination, setPagination] = useState({ page: 1, limit: 10, totalPages: 1 });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        if (!storeId) {
            setProducts([]);
            return;
        }

        setIsLoadingProducts(true);
        productService.getAllProducts({ page: 1, limit: 200 })
            .then((res) => {
                if (res && res.success) {
                    const mapped = res.data.map((p) => {
                        const storeStock = p.stockPerStore?.find((s) => s.store.id === storeId);
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
    }, [storeId]);

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
        const items = buildItemsToSubmit();
        if (items.length === 0) { alert("Isi minimal 1 stok fisik produk sebelum menyimpan."); return; }

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
            // storeId tidak perlu dikirim eksplisit — backend override otomatis
            // dari req.user.storeId untuk role KARYAWAN
            await stockOpnameService.create({ items });
            setSuccessMessage(`Hasil opname untuk ${items.length} produk berhasil disimpan sebagai draft!`);
            setIsSuccessOpen(true);
            setRowData({});
        } catch (err) {
            alert("Gagal menyimpan hasil opname: " + (err.response?.data?.message || err.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        products, paginatedProducts,
        isLoadingProducts,
        rowData, handleFieldChange, getSelisih,
        filledCount,
        pagination, handlePageChange, handleRowsPerPageChange,
        isSubmitting, handleSubmit,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        isEditing: false, // karyawan tidak pernah masuk mode edit
    };
};