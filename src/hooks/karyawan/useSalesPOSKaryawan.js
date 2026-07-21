import { useState, useEffect, useCallback } from "react";
import { productService } from "../../api/services/productService.js";
import { salesService } from "../../api/services/salesService.js";
import useAuthStore from "../../store/authStore.js";

export const PRODUCT_TYPES_BACKEND = [
    { value: "ALL", label: "Semua Tipe" },
    { value: "PRO", label: "Tipe Pro" },
    { value: "SUPER", label: "Tipe Super" },
    { value: "GLOSS", label: "Tipe Gloss" },
    { value: "ACCESSORIES", label: "Aksesoris" },
];

export const useSalesPOSKaryawan = () => {
    const { user } = useAuthStore();
    const storeId = user?.storeId || "";

    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedType, setSelectedType] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, searchQuery]);

    const fetchBackendProducts = useCallback(async () => {
        setIsLoading(true);
        const params = { page: currentPage, limit: rowsPerPage };
        if (selectedType !== "ALL") params.type = selectedType;
        if (searchQuery) params.search = searchQuery;

        const response = await productService.getAllProducts(params);

        if (response && response.success) {
            const transformed = response.data.map((item) => {
                const storeStock = item.stockPerStore?.find((s) => s.store.id === storeId);
                const currentStock = storeStock ? storeStock.quantity : 0;
                const normalizedType = item.type ? item.type.toUpperCase().trim() : "";
                return {
                    id: item.id,
                    name: item.name,
                    type: normalizedType,
                    price: item.sellPrice,
                    unit: normalizedType === "ACCESSORIES" ? "Pcs" : "Kg",
                    stock: currentStock,
                    hexColor: item.hexColor || (normalizedType === "ACCESSORIES" ? "#808080" : "#9ca3af"), // langsung dari backend, fallback aman kalau kosong
                    icon: item.icon || null,
                    code: item.code || "-",
                };
            });
            setProducts(transformed);
            if (response.pagination) {
                setTotalPages(response.pagination.totalPages || 1);
            }
        }
        setIsLoading(false);
    }, [selectedType, searchQuery, storeId, currentPage, rowsPerPage]);

    useEffect(() => {
        fetchBackendProducts();
    }, [fetchBackendProducts]);

    const addToCart = (product) => {
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
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const updateQuantity = (productId, amount) => {
        const targetProduct = products.find((p) => p.id === productId);
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

    const handleProcessPayment = async () => {
        if (cart.length === 0) return;
        setIsProcessing(true);

        const payload = {
            customerName: customerName || "Pelanggan Umum",
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
                fetchBackendProducts();
            } else {
                setWarningMessage(response?.message || "Transaksi gagal diproses. Silakan coba lagi.");
                setIsWarningOpen(true);
            }
        } catch (error) {
            const backendMessage = error?.response?.data?.message;
            setWarningMessage(backendMessage || "Terjadi kesalahan saat memproses transaksi.");
            setIsWarningOpen(true);
        } finally {
            setIsProcessing(false);
        }
    };

    return {
        products, isLoading, selectedType, setSelectedType, searchQuery, setSearchQuery,
        cart, customerName, setCustomerName,
        isSuccessOpen, setIsSuccessOpen, addToCart, updateQuantity, removeFromCart, subtotal,
        totalItems, handleProcessPayment, currentPage, setCurrentPage, totalPages, rowsPerPage, setRowsPerPage,
        isWarningOpen, setIsWarningOpen, warningMessage,
        isProcessing,
    };
};