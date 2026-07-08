// src/hooks/admin/useSalesPOS.js
import { useState, useEffect } from "react";
import { productService } from "../../api/services/productService.js";
import { storeService } from "../../api/services/storeService.js";

// Fungsi pernyataan / mapping manual kode warna ke nilai Hexa
const getColorHexByCode = (code, type) => {
    if (type === "ACCESSORIES" || type === "AKSESORIS") {
        return "#f472b6"; // Hexa warna Pink (Tailwind pink-400)
    }

    const colorMap = {
        "207": "#22c55e", // Green
        "210": "#ef4444", // Red
        "211": "#000000", // Black
        "219": "#78350f", // Coklat
        "309": "#f97316", // Orange
        "321": "#ffffff", // White
        "329": "#eab308", // Yellow
        "331": "#16a34a", // Green Super
        "5100": "#15803d",// Green Gloss
        "512": "#111827", // Black Gloss
        "311": "#3b82f6", // Blue
    };

    return colorMap[code] || "#9ca3af";
};

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

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(12); // Default tampil 10 data per halaman

    // Reset halaman ke 1 jika user mengubah filter tipe atau mengetik pencarian
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedType, searchQuery, selectedStoreId]);

    // Fetch data cabang toko
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

    // Fetch data produk terpaging berdasarkan state pagination
    useEffect(() => {
        const fetchBackendProducts = async () => {
            setIsLoading(true);

            const params = {
                page: currentPage,
                limit: rowsPerPage
            };

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

                // Set total halaman secara dinamis dari response data metadata backend
                if (response.pagination) {
                    setTotalPages(response.pagination.totalPages || 1);
                }
            }
            setIsLoading(false);
        };

        fetchBackendProducts();
    }, [selectedType, searchQuery, selectedStoreId, currentPage, rowsPerPage]);

    // Cart Logic
    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const updateQuantity = (productId, amount) => {
        setCart((prevCart) =>
            prevCart
                .map((item) =>
                    item.id === productId
                        ? { ...item, quantity: Math.max(0, item.quantity + amount) }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    };

    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleProcessPayment = () => {
        if (cart.length === 0) return;
        setIsSuccessOpen(true);
        setCart([]);
        setCustomerName("");
    };

    return {
        products,
        isLoading,
        selectedType,
        setSelectedType,
        searchQuery,
        setSearchQuery,
        selectedStoreId,
        setSelectedStoreId,
        storeOptions,
        cart,
        customerName,
        setCustomerName,
        isSuccessOpen,
        setIsSuccessOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        subtotal,
        totalItems,
        handleProcessPayment,
        // Return state pagination untuk digunakan di file UI
        currentPage,
        setCurrentPage,
        totalPages,
        rowsPerPage,
        setRowsPerPage
    };
};