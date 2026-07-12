import { useState, useEffect } from "react";
import { storeService } from "../../api/services/storeService.js";
import { productService } from "../../api/services/productService.js";

export const useOrderCreate = () => {
    const [storeOptions, setStoreOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedStore, setSelectedStore] = useState("");

    const emptyItemForm = {
        productId: "", quantity: "", basePrice: "",
        kode: "", namaBarang: "", type: "", deskripsi: "",
    };
    const [itemForm, setItemForm] = useState(emptyItemForm);

    const [orderItems, setOrderItems] = useState([]);
    const [editingItemIndex, setEditingItemIndex] = useState(null); // index item di orderItems yg lagi diedit
    const [editingPurchaseId, setEditingPurchaseId] = useState(null); // null = mode create, ada isi = mode edit nota

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        storeService.getAll()
            .then((res) => {
                const stores = res.data || [];
                setStoreOptions(stores.map((s) => ({ label: s.name, value: s.id })));
            })
            .catch((err) => console.error("Error fetch stores:", err));

        productService.getAllProducts({ page: 1, limit: 100 })
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setProductOptions(
                    list.map((p) => ({
                        label: `[${p.code}] ${p.name}`,
                        value: p.id,
                        code: p.code,
                        name: p.name,
                        type: p.type,
                        basePrice: p.basePrice || p.price || 0,
                    }))
                );
            })
            .catch((err) => console.error("Error fetch products:", err));
    }, []);

    const handleProductChange = (productId) => {
        const found = productOptions.find((p) => p.value === productId);
        setItemForm({
            productId,
            kode: found?.code || "",
            namaBarang: found?.name || "",
            type: found?.type || "",
            quantity: "",
            basePrice: found?.basePrice ? String(found.basePrice) : "",
            deskripsi: "Restock reguler bulanan",
        });
    };

    // Klik item di "Daftar Item Pesanan" -> muat ke form "Tambah Item"
    const handleEditCartItem = (index) => {
        const item = orderItems[index];
        if (!item) return;
        setItemForm({
            productId: item.productId,
            kode: item.kode,
            namaBarang: item.namaBarang,
            type: item.type,
            quantity: String(item.quantity),
            basePrice: String(item.basePrice),
            deskripsi: item.deskripsi || "",
        });
        setEditingItemIndex(index);
    };

    const cancelEditCartItem = () => {
        setEditingItemIndex(null);
        setItemForm(emptyItemForm);
    };

    // Dipanggil dari tombol form: nambah item baru ATAU update item yg lagi diedit
    const handleAddItemToList = () => {
        const { productId, quantity, basePrice, kode, namaBarang, type, deskripsi } = itemForm;

        if (!selectedStore) { alert("Pilih cabang toko terlebih dahulu bro!"); return; }
        if (!productId) { alert("Pilih produk terlebih dahulu!"); return; }
        if (!quantity || Number(quantity) <= 0) { alert("Kuantitas harus lebih besar dari 0!"); return; }
        if (!basePrice || Number(basePrice) <= 0) { alert("Harga satuan harus lebih besar dari 0!"); return; }

        const updatedItem = {
            productId, kode, namaBarang, type,
            deskripsi: deskripsi || "Restock produk",
            quantity: Number(quantity),
            basePrice: Number(basePrice),
            totalPrice: Number(quantity) * Number(basePrice),
        };

        if (editingItemIndex !== null) {
            // MODE EDIT ITEM: replace di posisi yang sama
            setOrderItems((prev) => {
                const copy = [...prev];
                copy[editingItemIndex] = updatedItem;
                return copy;
            });
            setEditingItemIndex(null);
        } else {
            // MODE TAMBAH BARU
            const existingItemIndex = orderItems.findIndex((item) => item.productId === productId);
            if (existingItemIndex > -1) {
                const updatedItems = [...orderItems];
                updatedItems[existingItemIndex].quantity += Number(quantity);
                updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].basePrice;
                setOrderItems(updatedItems);
            } else {
                setOrderItems((prev) => [...prev, updatedItem]);
            }
        }

        setItemForm(emptyItemForm);
    };

    const removeOrderItem = (idx) => {
        setOrderItems(orderItems.filter((_, i) => i !== idx));
        if (editingItemIndex === idx) cancelEditCartItem();
    };

    // Klik Edit di tabel Riwayat -> muat SELURUH item nota itu ke cart
    const loadOrderForEdit = (fullOrder) => {
        setSelectedStore(fullOrder.storeId);
        setOrderItems(
            (fullOrder.items || []).map((it) => ({
                productId: it.productId,
                kode: it.product?.code || "",
                namaBarang: it.product?.name || "",
                type: it.product?.type || "",
                deskripsi: "Restock produk",
                quantity: it.quantity,
                basePrice: it.basePrice ?? it.sellPrice ?? 0,
                totalPrice: it.totalPrice ?? (it.quantity * (it.basePrice ?? 0)),
            }))
        );
        setEditingPurchaseId(fullOrder.id);
        setEditingItemIndex(null);
        setItemForm(emptyItemForm);
    };

    const cancelEditOrder = () => {
        setEditingPurchaseId(null);
        setEditingItemIndex(null);
        setOrderItems([]);
        setSelectedStore("");
        setItemForm(emptyItemForm);
    };

    const totalUnitItems = orderItems.reduce((acc, item) => acc + item.quantity, 0);
    const totalJenisProduk = orderItems.length;
    const totalOrderAmount = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);

    const buildPayload = () => ({
        storeId: selectedStore,
        date: new Date().toISOString().split("T")[0],
        items: orderItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            basePrice: item.basePrice,
        })),
    });

    const resetAfterSubmit = () => {
        setOrderItems([]);
        setSelectedStore("");
        setEditingPurchaseId(null);
        setEditingItemIndex(null);
        setItemForm(emptyItemForm);
    };

    const handleCancelAll = () => {
        if (window.confirm("Apakah anda yakin ingin membatalkan semua daftar pesanan ini?")) {
            cancelEditOrder();
        }
    };

    return {
        storeOptions, productOptions,
        selectedStore, setSelectedStore,
        itemForm, setItemForm,
        orderItems, removeOrderItem,
        editingItemIndex, handleEditCartItem, cancelEditCartItem,
        editingPurchaseId, loadOrderForEdit, cancelEditOrder,
        isSuccessOpen, setIsSuccessOpen, successMessage, setSuccessMessage,
        isSubmitting, setIsSubmitting,
        totalUnitItems, totalJenisProduk, totalOrderAmount,
        handleProductChange, handleAddItemToList, handleCancelAll,
        buildPayload, resetAfterSubmit,
    };
};