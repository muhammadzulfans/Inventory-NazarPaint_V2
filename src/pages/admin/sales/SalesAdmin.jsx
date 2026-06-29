// src/pages/admin/sales/SalesAdmin.jsx
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import authStore from "../../../store/authStore.js";

// Import Data & Helper Terpisah
import { DUMMY_PRODUCTS, PRODUCT_TYPES } from "../../../dummy/dataAdmin/Data/salesTableData.js";

// Import Reusable Components bawaan proyekmu
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import KeranjangItem from "../../../components/ui/KeranjangItem.jsx";
import ProductCard from "../../../components/ui/ProductCard.jsx";
import CategoryPillsOptions from "../../../components/ui/CategoryPillsOptions.jsx";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";

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
    const filteredProducts = DUMMY_PRODUCTS.filter((product) => {
        const typeMatch = selectedType === "ALL" || product.type === selectedType;
        const searchMatch =
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.type.toLowerCase().includes(searchQuery.toLowerCase());
        return typeMatch && searchMatch;
    });

    const handleProcessPayment = () => {
        if (cart.length === 0) return;
        console.log("Processing payment for:", cart, "Customer:", customerName);
        setIsSuccessOpen(true);
        setCart([]);
        setCustomerName("");
    };

    return (
        // Samakan container utama dengan Detail Sales (px-8 pt-6 pb-10 bg-white min-h-full)
        <div className="px-8 pt-6 pb-10 bg-white min-h-full w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Kelola Transaksi Penjualan</h1>
            </div>

            {/* UBAH DISINI: Ganti flex menjadi grid 4 kolom seperti halaman lainnya */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Area Produk (Mengambil 3 Kolom dari total 4 kolom) */}
                <div className="lg:col-span-3 p-6 bg-card rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                    {/* Filters and Search */}
                    <div className="flex flex-col md:flex-row items-center justify-between pb-6 gap-4 border-b border-gray-100 mb-6">
                        <CategoryPillsOptions
                            options={PRODUCT_TYPES}
                            selectedValue={selectedType}
                            onSelect={setSelectedType}
                        />

                        <SearchFilter
                            leftIcon={<FiSearch className="text-gray-400 size-5" />}
                            label="Cari produk..."
                            value={searchQuery}
                            isInput={true}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-80 h-11 bg-white rounded-full border border-gray-100 px-2 focus-within:ring-1 focus-within:ring-buttonBlue text-sm flex-shrink-0"
                        />
                    </div>

                    {/* Product Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 content-start pb-6">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                </div>

                {/* Area Keranjang / KeranjangItem (Mengambil 1 Kolom sisanya) */}
                {/* Pastikan di dalam komponen KeranjangItem lu, hilangkan class 'w-1/4', ganti jadi 'w-full' */}
                <div className="w-full">
                    <KeranjangItem
                        cart={cart}
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        totalItems={totalItems}
                        subtotal={subtotal}
                        onUpdateQuantity={updateQuantity}
                        onRemoveFromCart={removeFromCart}
                        onProcessPayment={handleProcessPayment}
                    />
                </div>

            </div>

            {/* Success Modal */}
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message="Transaksi Berhasil Diproses!"
            />
        </div>
    );
};

export default SalesAdmin;