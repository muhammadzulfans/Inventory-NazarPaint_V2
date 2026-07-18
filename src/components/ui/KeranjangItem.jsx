import React from "react";
import { FiShoppingCart } from "react-icons/fi";
import ChartItemKeranjang from "./ChartItemKeranjang.jsx";
import { formatRupiah } from "../../Data/DropdownOptions.jsx";
import InputField from "../../components/forms/InputField.jsx";

const KeranjangItem = ({
                           cart,
                           customerName,
                           setCustomerName,
                           totalItems,
                           subtotal,
                           onUpdateQuantity,
                           onRemoveFromCart,
                           onProcessPayment,
                           isProcessing,
                       }) => {
    return (
        <div className="w-full rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)] bg-card flex flex-col overflow-hidden">
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
                        <ChartItemKeranjang
                            key={item.id}
                            item={item}
                            onUpdateQuantity={onUpdateQuantity}
                            onRemoveFromCart={onRemoveFromCart}
                        />
                    ))
                )}
            </div>

            {/* Cart Footer (Summary & Payment) */}
            <div className="px-6 py-6 border-t border-gray-100 bg-gray-50 flex-shrink-0 space-y-6">
                <div className="space-y-2.5 text-sm font-inter">
                    <div className="flex items-center justify-between text-base font-bold text-black">
                        <span>Total ({totalItems} item{totalItems !== 1 ? "s" : ""})</span>
                        <span>{formatRupiah(subtotal)}</span>
                    </div>
                </div>

                <button
                    onClick={onProcessPayment}
                    disabled={cart.length === 0}
                    className="w-full h-12 flex items-center justify-center bg-button hover:bg-button2 disabled:bg-gray-200 disabled:text-gray-400 rounded-xl text-sm font-inter font-semibold text-black transition shadow-sm"
                >
                    {isProcessing ? "Memproses..." : "Proses Pembayaran"}
                </button>
            </div>
        </div>
    );
};

export default KeranjangItem;