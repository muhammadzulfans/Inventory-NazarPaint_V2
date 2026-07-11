import { useState, useEffect, useCallback, useRef } from "react";
import { productService } from "../../api/services/productService.js";
import { storeService } from "../../api/services/storeService.js";
import { salesService } from "../../api/services/salesService.js";
import { getColorHexByCode } from "../../utils/productColor.js";

export const PRODUCT_TYPES_BACKEND = [
    { value: "ALL", label: "Semua Tipe" },
    { value: "PRO", label: "Tipe Pro" },
    { value: "SUPER", label: "Tipe Super" },
    { value: "GLOSS", label: "Tipe Gloss" },
    { value: "ACCESSORIES", label: "Aksesoris" },
];

export const useSalesPOS = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStoreId, setSelectedStoreId] = useState("");
    const [storeOptions, setStoreOptions] = useState([]);
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // State Warning / Validasi
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

    // ==========================================
    // STATE BARU: Loading khusus proses checkout
    // ==========================================
    const [isProcessing, setIsProcessing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, searchQuery, selectedStoreId]);

    useEffect(() => {
        storeService.getAll()
            .then((res) => {
                const stores = res.data || [];
                setStoreOptions([
                    { value: "", label: "Semua Cabang" },
                    ...stores.map((s) => ({ value: s.id, label: s.name }))
                ]);
            })
            .catch(() => {
                setStoreOptions([
                    { value: "", label: "Semua Cabang" },
                    { value: "store-tegal", label: "NazarPaint Tegal" }
                ]);
            });
    }, []);

    // Dipisah jadi function sendiri (pakai useCallback) biar bisa dipanggil ulang
    // setelah transaksi sukses, buat refresh stok produk terbaru.
    const fetchBackendProducts = useCallback(async () => {
        setIsLoading(true);
        const params = { page: currentPage, limit: rowsPerPage };
        if (selectedType !== "ALL") params.type = selectedType;
        if (searchQuery) params.search = searchQuery;

        const response = await productService.getAllProducts(params);

        if (response && response.success) {
            const transformed = response.data.map((item) => {
                let currentStock = item.totalStock;
                if (selectedStoreId) {
                    const storeStock = item.stockPerStore?.find(s => s.store.id === selectedStoreId);
                    currentStock = storeStock ? storeStock.quantity : 0;
                }
                const normalizedType = item.type ? item.type.toUpperCase().trim() : "";
                return {
                    id: item.id,
                    name: item.name,
                    type: normalizedType,
                    price: item.sellPrice,
                    unit: item.unit || "Kg",
                    stock: currentStock,
                    hexColor: getColorHexByCode(item.code, normalizedType),
                    code: item.code || "-"
                };
            });
            setProducts(transformed);
            if (response.pagination) {
                setTotalPages(response.pagination.totalPages || 1);
            }
        }
        setIsLoading(false);
    }, [selectedType, searchQuery, selectedStoreId, currentPage, rowsPerPage]);

    useEffect(() => {
        fetchBackendProducts();
    }, [fetchBackendProducts]);

    const addToCart = (product) => {
        if (!selectedStoreId || selectedStoreId === "") {
            setWarningMessage("Produk tidak bisa ditambahkan ke keranjang, Anda harus memilih cabang terlebih dahulu!");
            setIsWarningOpen(true);
            return;
        }

        if (product.stock <= 0) {
            setWarningMessage(`Stok barang "${product.name}" tidak bisa ditambahkan, karena stok belum tersedia.`);
            setIsWarningOpen(true);
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity >= product.stock) {
                    setWarningMessage(`Gagal menambah jumlah! Stok tersedia hanya ${product.stock} ${product.unit}.`);
                    setIsWarningOpen(true);
                    return prevCart;
                }
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };


    // Ref buat nyimpen cabang sebelumnya, biar bisa bedain "ganti cabang" vs "load pertama kali"
    const renderCabang = useRef(true);

// Reset keranjang setiap kali cabang toko diganti
    useEffect(() => {
        if (renderCabang.current) {
            renderCabang.current = false;
            return; // skip di render pertama, jangan clear cart yang emang masih kosong
        }

        if (cart.length > 0) {
            setCart([]);
            setWarningMessage("Cabang toko diganti, keranjang belanja akan otomatis kosong karena stok bisa berbeda tiap cabang.");
            setIsWarningOpen(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedStoreId]);


    const updateQuantity = (productId, amount) => {
        const targetProduct = products.find(p => p.id === productId);
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === productId) {
                        const nextQty = item.quantity + amount;
                        if (amount > 0 && targetProduct && nextQty > targetProduct.stock) {
                            setWarningMessage(`Stok tidak mencukupi! Maksimal pembelian ${targetProduct.stock} ${targetProduct.unit}.`);
                            setIsWarningOpen(true);
                            return item;
                        }
                        return { ...item, quantity: Math.max(0, nextQty) };
                    }
                    return item;
                })
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // ==========================================
    // INTEGRASI CREATE PENJUALAN KE BACKEND
    // ==========================================
    const handleProcessPayment = async () => {
        if (cart.length === 0) return;

        if (!selectedStoreId) {
            setWarningMessage("Anda harus memilih cabang toko sebelum memproses pembayaran!");
            setIsWarningOpen(true);
            return;
        }

        setIsProcessing(true);

        const payload = {
            storeId: selectedStoreId,
            customerName: customerName,
            items: cart.map((item) => ({
                productId: item.id,
                quantity: item.quantity,
                sellPrice: item.price,
                totalPrice: item.price * item.quantity,
            })),
        };

        try {
            const response = await salesService.create(payload);

            if (response && response.success !== false) {
                setIsSuccessOpen(true);
                setCart([]);
                setCustomerName("");
                // Refresh daftar produk supaya stok terbaru (habis dikurangi) langsung kelihatan
                fetchBackendProducts();
            } else {
                setWarningMessage(response?.message || "Transaksi gagal diproses. Silakan coba lagi.");
                setIsWarningOpen(true);
            }
        } catch (error) {
            const backendMessage = error?.response?.data?.message;
            // warning jika tidak memliki cabang
            setWarningMessage(backendMessage || "Terjadi kesalahan saat memproses transaksi. Cek koneksi atau stok barang.");
            setIsWarningOpen(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        products, isLoading, selectedType, setSelectedType, searchQuery, setSearchQuery,
        selectedStoreId, setSelectedStoreId, storeOptions, cart, customerName, setCustomerName,
        isSuccessOpen, setIsSuccessOpen, addToCart, updateQuantity, removeFromCart, subtotal,
        totalItems, handleProcessPayment, currentPage, setCurrentPage, totalPages, rowsPerPage, setRowsPerPage,
        isWarningOpen, setIsWarningOpen, warningMessage,
        // Export state processing biar tombol bisa di-disable pas loading
        isProcessing,
    };
};