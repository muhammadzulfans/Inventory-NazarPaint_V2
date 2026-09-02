import React, { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import { FiTrendingUp, FiPackage, FiAlertTriangle } from "react-icons/fi";
import api from "../../api/axios"; // Sesuaikan path axios kamu

const ModalPrediksiStok = ({ isOpen, onClose, product, storeId }) => {
    const [predictionData, setPredictionData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            fetchPredictionDetail();
        }
    }, [isOpen, product, storeId]);

    const fetchPredictionDetail = async () => {
        setLoading(true);
        try {
            let cabangName = "Balamoa";
            if (String(storeId) === "2" || String(storeId).toLowerCase().includes("singkil")) cabangName = "Singkil";
            if (String(storeId) === "3" || String(storeId).toLowerCase().includes("suradadi")) cabangName = "Suradadi";

            // Menggunakan method POST sesuai endpoint backend Express kita (`/api/predictions`)
            const response = await api.post('/predictions', {
                cabang: cabangName,
                kode_cat: product.code
            });

            // Mengambil data dari response backend Express yang membungkus hasil Flask
            const resultData = response.data.data;
            setPredictionData(resultData || null);
        } catch (err) {
            console.error("Gagal memuat detail prediksi:", err);
            setPredictionData(null);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const prediksiPenjualan = predictionData ? predictionData.prediksi_stok_pembelian : "-";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Prediksi Stok Pembelian"
            subtitle={product ? `${product.name} (${product.code})` : "Estimasi penjualan"}
        >
            <div className="space-y-6">
                {/* Ringkasan Kartu */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card rounded-xl p-3 flex flex-col items-center text-center">
                        <FiPackage className="text-txtNav mb-1" size={20} />
                        <p className="text-xs text-txtNav font-inter">Stok Saat Ini</p>
                        <p className="text-lg font-inter font-bold text-black">{product?.totalStock ?? 0} Pcs/Kg</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3 flex flex-col items-center text-center">
                        <FiTrendingUp className="text-yellow-600 mb-1" size={20} />
                        <p className="text-xs text-txtNav font-inter">Hasil Prediksi</p>
                        <p className="text-lg font-inter font-bold text-blue-600">
                            {loading ? "Memuat..." : `${prediksiPenjualan} Pcs/Kg`}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Mengambil data dari model ARIMA...</div>
                ) : predictionData ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                        <p className="font-semibold mb-1">Keterangan Hasil Prediksi:</p>
                        <p>Target Bulan: <span className="font-bold">{predictionData.target_bulan || "2026-08"}</span></p>
                        <p>Cabang: <span className="font-bold">{predictionData.cabang}</span></p>
                        <p className="mt-2 text-xs text-gray-600">
                            * Nilai prediksi dihitung otomatis berdasarkan histori penjualan menggunakan algoritma ARIMA.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        Belum ada data prediksi tersimpan untuk produk ini pada periode tersebut.
                    </div>
                )}

                <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 border-2 border-line rounded-lg text-sm font-semibold text-txtNav hover:bg-cardBG transition"
                >
                    Tutup
                </button>
            </div>
        </Modal>
    );
};

export default ModalPrediksiStok;