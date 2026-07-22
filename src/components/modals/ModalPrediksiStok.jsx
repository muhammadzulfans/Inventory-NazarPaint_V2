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
            // Ubah storeId menjadi nama cabang teks (sesuaikan dengan isi storeOptions/database Supabase)
            // Misalnya storeId 1 = Balamoa, 2 = Singkil, 3 = Suradadi (atau sesuaikan dengan value di dropdownmu)
            let cabangName = "Balamoa";
            if (String(storeId) === "2" || String(storeId).toLowerCase().includes("singkil")) cabangName = "Singkil";
            if (String(storeId) === "3" || String(storeId).toLowerCase().includes("suradadi")) cabangName = "Suradadi";

            const response = await api.get('/predictions', {
                params: {
                    cabang: cabangName,
                    kode: product.code
                }
            });

            const found = response.data.data.find(
                item => String(item.kode_cat) === String(product.code) &&
                    item.cabang.toLowerCase() === cabangName.toLowerCase()
            );

            setPredictionData(found || null);
        } catch (err) {
            console.error("Gagal memuat detail prediksi:", err);
        } finally {
            setLoading(false);
        }
    };

    // // Helper kecil untuk mapping storeId ke nama cabang jika diperlukan
    // const getStoreName = (id) => {
    //     // Sesuaikan dengan data cabang di app kamu, misal: 1 = Balamoa, dst.
    //     return "Balamoa";
    // };

    if (!isOpen) return null;

    const rekomendasiStok = predictionData ? predictionData.rekomendasi_stok_jual : "-";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Prediksi Stok & Order (ARIMA)"
            subtitle={product ? `${product.name} (${product.code})` : "Estimasi kebutuhan"}
        >
            <div className="space-y-6">
                {/* Ringkasan Kartu */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-card rounded-xl p-3 flex flex-col items-center text-center">
                        <FiPackage className="text-txtNav mb-1" size={20} />
                        <p className="text-xs text-txtNav font-inter">Stok Saat Ini</p>
                        <p className="text-lg font-inter font-bold text-black">{product?.totalStock ?? 0}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3 flex flex-col items-center text-center">
                        <FiAlertTriangle className="text-yellow-600 mb-1" size={20} />
                        <p className="text-xs text-txtNav font-inter">Rekomendasi Stok Jual</p>
                        <p className="text-lg font-inter font-bold text-blue-600">
                            {loading ? "Memuat..." : `${rekomendasiStok} Pcs/Kg`}
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Mengambil data dari model ARIMA...</div>
                ) : predictionData ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
                        <p className="font-semibold mb-1">Hasil Peramalan Bulanan:</p>
                        <p>Target Bulan: <span className="font-bold">{predictionData.target_month}</span></p>
                        <p>Cabang: <span className="font-bold">{predictionData.cabang}</span></p>
                        <p className="mt-2 text-xs text-gray-600">
                            * Nilai rekomendasi dihitung otomatis berdasarkan histori penjualan menggunakan algoritma ARIMA.
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