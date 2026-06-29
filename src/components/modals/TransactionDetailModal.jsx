// src/components/modals/TransactionDetailModal.jsx
import React from "react";
import { FiX, FiCornerUpLeft } from "react-icons/fi";
import Modal from "./Modal";

const TransactionDetailModal = ({ isOpen, onClose, transaction }) => {
    if (!transaction) return null;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(number);
    };

    // Data dummy fallback untuk mengisi daftar item dibeli jika hook belum menyediakannya
    const items = transaction.items || [
        { id: 1, name: "White Gloss Paint", qtyText: "2 kaleng × Rp 85.000", price: 170000, color: "bg-gray-100" },
        { id: 2, name: "Red Matte Paint", qtyText: "1 kaleng × Rp 72.000", price: 72000, color: "bg-red-500" }
    ];

    const subtotal = transaction.subtotal || transaction.hargaTotal || 242000;
    const diskon = transaction.diskon || 0;
    const pajak = transaction.pajak || 0;
    const totalAkhir = subtotal - diskon + pajak;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Transaksi"
            subtitle={`${transaction.id || "TRX-240626-001"} · ${transaction.waktu || "08:14"}, 24 Juni 2026`}
        >
            {/* Struktur Konten Dua Kolom Sesuai Foto Mockup */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-inter -mt-2">

                {/* KOLOM KIRI: ITEM DIBELI */}
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Item Dibeli</h3>
                            <span className="text-xs text-gray-400 font-medium">{items.length} item</span>
                        </div>

                        {/* List Items */}
                        <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                            {items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg shrink-0 ${item.color || "bg-gray-200"}`}></div>
                                        <div>
                                            <p className="text-sm font-semibold text-black">{item.name || item.namaBarang}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">{item.qtyText || `${item.totalProduk || 1} kaleng · Ready`}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-bold text-black">{formatRupiah(item.price || item.hargaSatuan * item.totalProduk)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Metadata Pelanggan & Kasir */}
                    <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Pelanggan</span>
                            <span className="font-semibold text-black">{transaction.pelanggan || "Budi Santoso"}</span>
                        </div>
                        {/*<div className="flex justify-between">*/}
                        {/*    <span className="text-gray-400">Kasir</span>*/}
                        {/*    <span className="font-semibold text-black">{transaction.kasir || "Rina"}</span>*/}
                        {/*</div>*/}
                    </div>
                </div>

                {/* KOLOM KANAN: RINGKASAN PEMBAYARAN */}
                <div className="flex flex-col justify-between">
                    <div>
                        <h3 className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-3">Ringkasan Pembayaran</h3>
                        <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm">
                            <div className="flex justify-between text-gray-500">
                                <span>Subtotal</span>
                                <span className="font-semibold text-black">{formatRupiah(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Diskon</span>
                                <span className="font-semibold text-black">-</span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                                <span>Pajak (0%)</span>
                                <span className="font-semibold text-black">Rp 0</span>
                            </div>
                            <hr className="border-gray-200 my-2" />
                            <div className="flex justify-between text-base font-bold text-black pt-1">
                                <span>Total Akhir</span>
                                <span>{formatRupiah(totalAkhir)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Kembali Aksi Pojok Kanan Bawah */}
                    <div className="flex justify-end mt-6">
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

            </div>
        </Modal>
    );
};

export default TransactionDetailModal;