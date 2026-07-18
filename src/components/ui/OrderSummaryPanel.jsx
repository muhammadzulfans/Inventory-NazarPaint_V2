import React from "react";

const OrderSummaryPanel = ({
                               storeOptions, selectedStore,
                               orderItems, totalUnitItems, totalJenisProduk, totalOrderAmount,
                               isSubmitting, onSubmit, onCancel, isEditingOrder,
                           }) => {
    return (
        <div className="bg-card text-black rounded-2xl px-6 py-7 shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-5">
            <h2 className="font-inter font-medium text-lg">Ringkasan Order</h2>
            <hr className="border-white/20" />

            <div className="flex justify-between text-sm">
                <span className="text-gray-600 font-medium">Cabang Toko</span>
                <span className="font-semibold truncate max-w-[140px]">
                    {storeOptions.find((s) => s.value === selectedStore)?.label || "Belum dipilih"}
                </span>
            </div>

            <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600 font-medium">Total Akhir Kuantitas</span>
                <span className="font-semibold">
                    {orderItems.length > 0 ? `( ${totalUnitItems} Unit )` : "Belum dipilih"}
                </span> 
            </div>
            <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600 font-medium">Total Akhir Item</span>
                <span className="font-semibold">
                    {orderItems.length > 0 ? `( ${totalJenisProduk} Item )` : "Belum dipilih"}
                </span>
            </div>

            <div className="bg-[#191d26] text-white rounded-xl p-4 flex justify-between items-center shadow-inner">
                <span className="text-xs text-gray-400 font-semibold tracking-wide uppercase">Total Akhir</span>
                <span className="text-md font-bold text-[#fbdc5c]">Rp {totalOrderAmount.toLocaleString("id-ID")}</span>
            </div>

            <button
                disabled={orderItems.length === 0 || isSubmitting}
                onClick={onSubmit}
                className={`w-full py-3.5 rounded-xl font-inter font-semibold text-sm shadow transition-colors text-center ${
                    orderItems.length === 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-button hover:bg-button2 text-black"   
                }`}
            >
                {isSubmitting ? "Memproses..." : (isEditingOrder ? "Update Pesanan Pembelian" : "Buat Pesanan Pembelian")}
            </button>

            <button
                onClick={onCancel}
                className="w-full py-3.5 border-2 border-line rounded-xl font-inter font-semibold text-sm text-txtNav hover:bg-white/30 transition-colors"
            >
                Batal
            </button>
        </div>
    );
};

export default OrderSummaryPanel;