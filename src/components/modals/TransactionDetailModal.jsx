import React from "react";
import { FiCornerUpLeft } from "react-icons/fi";
import Modal from "./Modal"; // Menggunakan Modal utama proyekmu

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // MURNI DATA DUMMY TEMPORER UNTUK SIMULASI STRUK NOTA KASIR
    const dummyItems = [
        { name: "White Gloss Paint (229)", qty: 5, unit: "Kg", singlePrice: 16000, color: "bg-gray-100" },
        { name: "Green Leaf Paint (207)", qty: 10, unit: "Kg", singlePrice: 20000, color: "bg-green-500" },
        { name: "Paint Roller 20cm (5100)", qty: 2, unit: "Pcs", singlePrice: 34000, color: "bg-pink-400" }
    ];

    // Kalkulasi hitungan otomatis murni dari data dummy di atas
    const calculatedSubtotal = dummyItems.reduce((sum, item) => sum + (item.singlePrice * item.qty), 0);
    const diskon = 0;
    const totalAkhir = calculatedSubtotal - diskon;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Transaksi Kasir"
            subtitle={`Order ID: ${transaction.id || "NZR-00001"} • 12 Jan 2025`}
        >
            <div className="font-inter space-y-6">

                {/* 1. SEKSYEN DAFTAR ITEM YANG DIBELI */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Item Dibeli</h3>
                        <span className="text-xs text-gray-400 font-semibold">{dummyItems.length} Produk</span>
                    </div>

                    {/* Kotak List Scroll Item */}
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                        {dummyItems.map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg shrink-0 border border-gray-200 ${item.color}`}></div>
                                    <div>
                                        <p className="text-sm font-semibold text-black">{item.name}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {item.qty} {item.unit} x {formatRupiah(item.singlePrice)}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-black">
                                    {formatRupiah(item.singlePrice * item.qty)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. SEKSYEN METADATA INFORMASI */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-400">Nama Pelanggan</span>
                        <span className="font-semibold text-black">Walk-in Customer</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-400">Cabang Toko</span>
                        <span className="font-semibold text-black">NazarPaint Tegal</span>
                    </div>
                </div>

                {/* 3. SEKSYEN RINGKASAN TOTAL PEMBAYARAN */}
                <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-3">Ringkasan Pembayaran</h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-sm border border-gray-100">
                        <div className="flex justify-between text-gray-500">
                            <span>Subtotal</span>
                            <span className="font-semibold text-black">{formatRupiah(calculatedSubtotal)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500">
                            <span>Diskon Potongan</span>
                            <span className="font-semibold text-black">-</span>
                        </div>
                        <hr className="border-gray-200" />
                        <div className="flex justify-between text-base font-bold text-black pt-0.5">
                            <span>Total Akhir</span>
                            <span className="text-green-600">{formatRupiah(totalAkhir)}</span>
                        </div>
                    </div>
                </div>

                {/* 4. TOMBOL AKSI KEMBALI POJOK KANAN BAWAH */}
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

export default TransactionDetailModal;