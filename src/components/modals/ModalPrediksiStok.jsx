import React from "react";
import Modal from "./Modal.jsx";
import { FiTrendingUp, FiPackage, FiAlertTriangle } from "react-icons/fi";

// TODO: ganti dengan data asli dari endpoint prediksi saat backend sudah siap
const DUMMY_PREDIKSI = [
    { label: "Minggu 1", actual: 42, predicted: 45 },
    { label: "Minggu 2", actual: 38, predicted: 40 },
    { label: "Minggu 3", actual: 55, predicted: 50 },
    { label: "Minggu 4", actual: 47, predicted: 52 },
    { label: "Minggu 5", actual: null, predicted: 58 },
    { label: "Minggu 6", actual: null, predicted: 61 },
];

const ModalPrediksiStok = ({ isOpen, onClose, product }) => {
    if (!isOpen) return null;

    const chartData = DUMMY_PREDIKSI;
    const maxValue = Math.max(...chartData.map((d) => Math.max(d.actual || 0, d.predicted || 0))) * 1.15;

    const chartWidth = 480;
    const chartHeight = 220;
    const paddingLeft = 36;
    const paddingBottom = 28;
    const plotWidth = chartWidth - paddingLeft - 10;
    const plotHeight = chartHeight - paddingBottom - 10;
    const stepX = plotWidth / (chartData.length - 1);

    const toX = (i) => paddingLeft + i * stepX;
    const toY = (val) => 10 + plotHeight - (val / maxValue) * plotHeight;

    const buildPath = (key) => {
        const points = chartData
            .map((d, i) => (d[key] !== null && d[key] !== undefined ? `${toX(i)},${toY(d[key])}` : null))
            .filter(Boolean);
        return points.length > 0 ? `M ${points.join(" L ")}` : "";
    };

    const rekomendasiQty = Math.round(chartData[chartData.length - 1].predicted * 1.1);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Prediksi Stok & Order"
            subtitle={product ? `${product.name} (${product.code})` : "Estimasi kebutuhan pembelian"}
        >
            <div className="space-y-6">
                {/* Ringkasan Kartu */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-card rounded-xl p-3 flex flex-col items-center text-center">
                        <FiPackage className="text-txtNav mb-1" size={20} />
                        <p className="text-xs text-txtNav font-inter">Stok Saat Ini</p>
                        <p className="text-lg font-inter font-bold text-black">{product?.totalStock ?? "-"}</p>
                    </div>
                    <div className="bg-card rounded-xl p-3 flex flex-col items-center text-center">
                        <FiTrendingUp className="text-green-600 mb-1" size={20} />
                        <p className="text-xs text-txtNav font-inter">Prediksi Minggu Depan</p>
                        <p className="text-lg font-inter font-bold text-black">{chartData[4].predicted} {product?.unit || "Kg"}</p>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-3 flex flex-col items-center text-center">
                        <FiAlertTriangle className="text-yellow-600 mb-1" size={20} />
                        <p className="text-xs text-txtNav font-inter">Rekomendasi Order</p>
                        <p className="text-lg font-inter font-bold text-black">{rekomendasiQty} {product?.unit || "Kg"}</p>
                    </div>
                </div>

                {/* Grafik */}
                <div className="bg-white border border-line rounded-xl p-4">
                    <div className="flex items-center gap-4 mb-3 text-xs font-inter">
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-0.5 bg-blue-500 inline-block" />
                            <span className="text-txtNav">Aktual</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-3 h-0.5 bg-orange-400 inline-block border-dashed" style={{ borderTop: "2px dashed #fb923c", background: "none" }} />
                            <span className="text-txtNav">Prediksi</span>
                        </div>
                    </div>

                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto">
                        {/* Garis grid horizontal */}
                        {[0, 0.25, 0.5, 0.75, 1].map((f) => (
                            <line
                                key={f}
                                x1={paddingLeft} x2={chartWidth - 10}
                                y1={10 + plotHeight * (1 - f)} y2={10 + plotHeight * (1 - f)}
                                stroke="#f0f0f0" strokeWidth="1"
                            />
                        ))}

                        {/* Garis Aktual */}
                        <path d={buildPath("actual")} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
                        {/* Garis Prediksi (dashed) */}
                        <path d={buildPath("predicted")} fill="none" stroke="#fb923c" strokeWidth="2.5" strokeDasharray="6 4" />

                        {/* Titik-titik */}
                        {chartData.map((d, i) => (
                            <React.Fragment key={i}>
                                {d.actual !== null && <circle cx={toX(i)} cy={toY(d.actual)} r="3.5" fill="#3b82f6" />}
                                {d.predicted !== null && <circle cx={toX(i)} cy={toY(d.predicted)} r="3.5" fill="#fb923c" />}
                            </React.Fragment>
                        ))}

                        {/* Label sumbu X */}
                        {chartData.map((d, i) => (
                            <text
                                key={d.label}
                                x={toX(i)} y={chartHeight - 6}
                                fontSize="9" fill="#9ca3af" textAnchor="middle" fontFamily="Inter, sans-serif"
                            >
                                {d.label.replace("Minggu ", "M")}
                            </text>
                        ))}
                    </svg>
                </div>

                <p className="text-xs text-txtNav font-inter italic">
                    * Data prediksi masih berupa contoh tampilan (belum tersambung ke backend).
                </p>

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