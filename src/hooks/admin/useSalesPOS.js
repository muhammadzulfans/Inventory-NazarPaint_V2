import { useState, useEffect } from "react";
import { productService } from "../../api/services/productService.js";
import { storeService } from "../../api/services/storeService.js";

const getColorHexByCode = (code, type) => {
    if (type === "ACCESSORIES" || type === "AKSESORIS") {
        return "#f472b6";
    }
    const colorMap = {
        "207": "#22c55e", "210": "#ef4444", "211": "#000000", "219": "#78350f",
        "309": "#f97316", "321": "#ffffff", "329": "#eab308", "331": "#16a34a",
        "5100": "#15803d", "512": "#111827", "311": "#3b82f6",
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

    // ==========================================
    // STATE MODAL WARNING / VALIDASI BARU
    // ==========================================
    const [isWarningOpen, setIsWarningOpen] = useState(false);
    const [warningMessage, setWarningMessage] = useState("");

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

    useEffect(() => {
        const fetchBackendProducts = async () => {
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
        };
        fetchBackendProducts();
    }, [selectedType, searchQuery, selectedStoreId, currentPage, rowsPerPage]);

    // ==========================================
    // VALIDASI KONDISI AMBIL BARANG MASUK KERANJANG
    // ==========================================
    const addToCart = (product) => {
        // KONDISI 1: Belum pilih cabang toko
        if (!selectedStoreId || selectedStoreId === "") {
            setWarningMessage("Produk tidak bisa ditambahkan ke keranjang, Anda harus memilih cabang terlebih dahulu!");
            setIsWarningOpen(true);
            return;
        }

        // KONDISI 2: Stok kosong / habis di cabang bersangkutan
        if (product.stock <= 0) {
            setWarningMessage(`Stok barang "${product.name}" tidak bisa ditambahkan, karena stok belum tersedia.`);
            setIsWarningOpen(true);
            return;
        }

        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                // KONDISI 3: Cek jika penambahan qty di keranjang melebihi stok yang ada
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

    const updateQuantity = (productId, amount) => {
        const targetProduct = products.find(p => p.id === productId);
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === productId) {
                        const nextQty = item.quantity + amount;
                        // Validasi batas atas saat menaikkan qty lewat tombol + di keranjang
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

    const handleProcessPayment = () => {
        if (cart.length === 0) return;
        setIsSuccessOpen(true);
        setCart([]);
        setCustomerName("");
    };

    return {
        products, isLoading, selectedType, setSelectedType, searchQuery, setSearchQuery,
        selectedStoreId, setSelectedStoreId, storeOptions, cart, customerName, setCustomerName,
        isSuccessOpen, setIsSuccessOpen, addToCart, updateQuantity, removeFromCart, subtotal,
        totalItems, handleProcessPayment, currentPage, setCurrentPage, totalPages, rowsPerPage, setRowsPerPage,
        // Lempar state warning baru ke UI
        isWarningOpen, setIsWarningOpen, warningMessage
    };
};