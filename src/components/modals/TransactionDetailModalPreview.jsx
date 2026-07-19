import React from "react";
import { FiCornerUpLeft } from "react-icons/fi";
import Modal from "./Modal.jsx";
import ProductVisual from "../ui/Productvisual.jsx";

const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);

const formatTanggal = (date) =>
    date
        ? new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        : "-";

const TransactionDetailModalPreview = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    const items = transaction.items || [];

    const subtotal = items.reduce(
        (sum, it) => sum + (it.totalPrice ?? it.sellPrice * it.quantity),
        0
    );

    const isAccessories = (product) => (product?.type || "").toUpperCase() === "ACCESSORIES";

    const totalKg = items
        .filter((it) => !isAccessories(it.product))
        .reduce((sum, it) => sum + it.quantity, 0);
    const totalPcs = items
        .filter((it) => isAccessories(it.product))
        .reduce((sum, it) => sum + it.quantity, 0);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Transaksi Kasir"
            subtitle={`Order ID: ${transaction.orderNumber || transaction.id} • ${formatTanggal(transaction.date)}`}
        >
            <div className="font-inter space-y-6">
                {/* Daftar Item Dibeli */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Item Dibeli</h3>
                        <span className="text-xs text-gray-400 font-semibold">{items.length} Item</span>
                    </div>

                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                        {items.map((item) => {
                            const product = item.product || {};
                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <ProductVisual
                                            product={product}
                                            size={40}
                                            className="rounded-lg border border-gray-200"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-black">
                                                {product.name} {product.code ? `(${product.code})` : ""}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {item.quantity} {isAccessories(product) ? "Pcs" : "Kg"} x {formatRupiah(item.sellPrice)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-black">
                                        {formatRupiah(item.totalPrice ?? item.sellPrice * item.quantity)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Metadata */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Nama Pelanggan</span>
                        <span className="font-semibold text-black">{transaction.customerName || "Walk-in Customer"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Cabang Toko</span>
                        <span className="font-semibold text-black">{transaction.store?.name || "-"}</span>
                    </div>
                </div>

                {/* Ringkasan Pembayaran */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-3">Ringkasan Pembayaran</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm border border-gray-100">
                        <div className="flex justify-between text-gray-500">
                            <span>Total Kuantitas (Kg)</span>
                            <span className="font-semibold text-black">{totalKg} Kg</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Total Kuantitas (Pcs)</span>
                            <span className="font-semibold text-black">{totalPcs} Pcs</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span className="font-semibold text-black">{formatRupiah(subtotal)}</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between text-base font-bold text-black pt-0.5">
                            <span>Total Akhir</span>
                            <span className="text-green-600">{formatRupiah(subtotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-inter font-semibold shadow-sm transition flex items-center gap-2"
                    >
                        <FiCornerUpLeft size={16} />
                        Kembali
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default TransactionDetailModalPreview;