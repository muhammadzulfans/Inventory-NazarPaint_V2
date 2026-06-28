import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiShoppingCart, FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import authStore from "../../../store/authStore.js";
import InputField from "../../../components/forms/InputField.jsx";
import SuccessModal from "../../../components/modals/SuccessModal";

// Dummy data for products based on the image
const dummyProducts = [
    {
        id: 1,
        name: "White Gloss Paint",
        type: "Tipe Gloss",
        price: 85000,
        unit: "kaleng",
        stock: 24,
        color: "bg-gray-100",
    },
    {
        id: 2,
        name: "Red Matte Paint",
        type: "Tipe Super",
        price: 72000,
        unit: "kaleng",
        stock: 18,
        color: "bg-red-500",
    },
    {
        id: 3,
        name: "Navy Blue Exterior",
        type: "Tipe Super",
        price: 92000,
        unit: "kaleng",
        stock: 15,
        color: "bg-blue-900",
    },
    {
        id: 4,
        name: "Pastel Yellow Interior",
        type: "Tipe Super",
        price: 78500,
        unit: "kaleng",
        stock: 30,
        color: "bg-yellow-100",
    },
    {
        id: 5,
        name: "Forest Green Matte",
        type: "Tipe Pro",
        price: 81000,
        unit: "kaleng",
        stock: 12,
        color: "bg-green-800",
    },
    {
        id: 6,
        name: "Cement Gray Primer",
        type: "Accessories",
        price: 58000,
        unit: "kaleng",
        stock: 40,
        color: "bg-gray-400",
    },
    {
        id: 7,
        name: "Coral Pink Interior",
        type: "Tipe Super",
        price: 76000,
        unit: "kaleng",
        stock: 22,
        color: "bg-red-300",
    },
    {
        id: 8,
        name: "Black Gloss Enamel",
        type: "Tipe Gloss",
        price: 88000,
        unit: "kaleng",
        stock: 9,
        color: "bg-gray-900",
    },
    {
        id: 9,
        name: "Putih Dinding Avitex",
        type: "Tipe Pro",
        price: 45000,
        unit: "kaleng",
        stock: 60,
        color: "bg-white border",
    },
    {
        id: 10,
        name: "Paint Roller 20cm",
        type: "Accessories",
        price: 34000,
        unit: "pcs",
        stock: 35,
        color: "bg-blue-600",
    },
    {
        id: 11,
        name: "Brush Set Pro 5pcs",
        type: "Accessories",
        price: 65000,
        unit: "set",
        stock: 20,
        color: "bg-purple-600",
    },
    {
        id: 12,
        name: "Thinner Premium 1L",
        type: "Accessories",
        price: 28000,
        unit: "botol",
        stock: 50,
        color: "bg-orange-500",
    },
];

const productTypes = [
    { value: "ALL", label: "Semua Tipe" },
    { value: "Tipe Pro", label: "Tipe Pro" },
    { value: "Tipe Super", label: "Tipe Super" },
    { value: "Tipe Gloss", label: "Tipe Gloss" },
    { value: "Accessories", label: "Accessories" },
];

const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};

const SalesAdmin = () => {
    const { user } = authStore();
    const [selectedType, setSelectedType] = useState("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [cart, setCart] = useState([]);
    const [customerName, setCustomerName] = useState("");
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);

    // Cart logic
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

    // Calculations
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Filtering
    const filteredProducts = dummyProducts.filter((product) => {
        const typeMatch = selectedType === "ALL" || product.type === selectedType;
        const searchMatch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.type.toLowerCase().includes(searchQuery.toLowerCase());
        return typeMatch && searchMatch;
    });

    const handleProcessPayment = () => {
        if (cart.length === 0) {
            alert("Keranjang masih kosong!");
            return;
        }
        // In real app, this would call an API
        console.log("Processing payment for:", cart, "Customer:", customerName);
        setIsSuccessOpen(true);
        setCart([]);
        setCustomerName("");
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Kelola Transaksi Penjualan</h1>
            </div>
            {/* Main Content Area */}
            <div className="flex py-1 gap-8">
                {/* Product Selection Area (Left) */}
                <div className="flex-1 w-3/4 p-6 bg-card rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                    {/* Filters and Search */}
                    <div className="flex items-center justify-between flex-shrink-0 pb-6">
                        {/* Tipe Cat Pills */}
                        <div className="flex items-center gap-5">
                            {productTypes.map((type) => (
                                <button
                                    key={type.value}
                                    onClick={() => setSelectedType(type.value)}
                                    className={`px-5 py-2.5 rounded-full text-sm font-inter font-medium whitespace-nowrap transition-colors duration-150 ${
                                        selectedType === type.value
                                            ? "bg-button text-black"
                                            : "bg-white text-black"
                                    }`}
                                >
                                    {type.label}
                                </button>
                            ))}
                        </div>

                        {/* Search Input */}
                        <div className="relative flex-shrink-0 w-80">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                            <input
                                type="text"
                                placeholder="Cari produk..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-11 pl-12 pr-4 bg-white rounded-full border border-gray-100 outline-none focus:ring-1 focus:ring-buttonBlue text-sm"
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1 overflow-y-auto pr-2 -mr-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 content-start pb-6">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-14 h-14 rounded-xl flex-shrink-0 ${product.color}`}
                                    ></div>
                                    <div className="flex-1 space-y-0.5">
                                        <h3 className="font-inter font-semibold text-base text-black truncate">
                                            {product.name}
                                        </h3>
                                        <p className="text-xs font-inter text-gray-500 uppercase">
                                            {product.type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between gap-2">
                                    <div className="space-y-0.5">
                                        <p className="text-lg font-inter font-bold text-black">
                                            {formatRupiah(product.price)}
                                        </p>
                                        <p className="text-xs font-inter text-gray-500">
                                            per {product.unit}
                                        </p>
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            product.stock > 10
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        Stok {product.stock}
                                    </div>
                                </div>

                                <button
                                    onClick={() => addToCart(product)}
                                    className="w-full flex items-center justify-center gap-2 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-inter font-medium text-black transition"
                                >
                                    <FiPlus />
                                    Tambah
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Cart / "FormCreatePenjualan" Area (Right) */}
                <div className="w-1/4 flex-shrink-0 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)] bg-card flex flex-col overflow-hidde">
                    {/* Cart Header */}
                    <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-inter font-semibold text-black">Keranjang</h2>
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-black text-xs font-bold">
                            <FiShoppingCart />
                            <span>
                                {totalItems} item{totalItems !== 1 ? "s" : ""}
                            </span>
                        </div>
                    </div>

                    {/* Customer Name Input */}
                    <div className="px-6 py-4 flex-shrink-0">
                        <InputField
                            placeholder="Nama pelanggan.."
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 px-6 py-2 overflow-y-auto space-y-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-gray-400 pt-10">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                                    <FiShoppingCart className="size-10" />
                                </div>
                                <p className="text-sm font-inter font-medium px-10">
                                    Belum ada produk. Klik produk untuk menambahkan.
                                </p>
                            </div>
                        ) : (
                            cart.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-lg flex-shrink-0 ${item.color}`}
                                    ></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-inter font-semibold text-black truncate">
                                            {item.name}
                                        </p>
                                        <p className="text-xs font-inter text-gray-500">
                                            {formatRupiah(item.price)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 border border-gray-200 rounded-full p-0.5">
                                        <button
                                            onClick={() => updateQuantity(item.id, -1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                        >
                                            <FiMinus size={14} />
                                        </button>
                                        <span className="text-sm font-inter font-semibold text-black w-5 text-center">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, 1)}
                                            className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                                        >
                                            <FiPlus size={14} />
                                        </button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-500 ml-1 flex-shrink-0"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Cart Footer (Summary & Payment) */}
                    <div className="px-6 py-6 border-t border-gray-100 bg-gray-50 flex-shrink-0 space-y-6">
                        <div className="space-y-2.5 text-sm font-inter">
                            <div className="flex items-center justify-between text-gray-600">
                                <span>
                                  Subtotal ({totalItems} item{totalItems !== 1 ? "s" : ""})
                                </span>
                                <span className="font-medium text-black">
                                  {formatRupiah(subtotal)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-gray-600">
                                <span>Diskon</span>
                                <span className="font-medium text-black">-</span>
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex items-center justify-between text-base font-bold text-black">
                                <span>Total</span>
                                <span>{formatRupiah(subtotal)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleProcessPayment}
                            disabled={cart.length === 0}
                            className="w-full h-12 flex items-center justify-center bg-button hover:bg-button2 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl text-sm font-inter font-semibold text-black transition shadow-sm"
                        >
                            Proses Pembayaran
                        </button>
                    </div>
                </div>
            </div>

            {/* Success Modal for Payment (Simplified Cycling UI) */}
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message="Transaksi Berhasil Diproses!"
            />
        </div>
    );
};

export default SalesAdmin;