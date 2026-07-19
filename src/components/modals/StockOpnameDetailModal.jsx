import React from "react";
import { FiCornerUpLeft } from "react-icons/fi";
import Modal from "./Modal.jsx";
import ProductVisual from "../ui/Productvisual.jsx";

const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
        return new Date(isoString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch { return "-"; }
};

const getUnit = (type) => (type || "").toUpperCase() === "ACCESSORIES" ? "Pcs" : "Kg";

const StockOpnameDetailModal = ({ isOpen, onClose, opname }) => {
    if (!opname) return null;
    const items = opname.items || [];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Detail Stock Opname"
            subtitle={formatDate(opname.date)}
        >
            <div className="font-inter space-y-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className="text-gray-400">Cabang Toko</span>
                        <p className="font-semibold text-black">{opname.store?.name || "-"}</p>
                    </div>
                    <div>
                        <span className="text-gray-400">Petugas</span>
                        <p className="font-semibold text-black">{opname.user?.name || "-"}</p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Item Opname</h3>
                        <span className="text-xs text-gray-400 font-semibold">{items.length} Item</span>
                    </div>

                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {items.map((item) => {
                            const unit = getUnit(item.product?.type);
                            return (
                                <div key={item.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <ProductVisual
                                                product={item.product}
                                                size={40}
                                                className="rounded-lg border border-gray-200"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold text-black">{item.product?.name}</p>
                                                <p className="text-xs text-gray-400">{item.product?.code} • {item.product?.type}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                            item.selisih === 0 ? "bg-gray-100 text-gray-600" :
                                                item.selisih > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                        }`}>
                                            {item.selisih > 0 ? "+" : ""}{item.selisih} {unit}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-gray-500">
                                        <span>Stok Sistem: <b className="text-black">{item.stokSistem} {unit}</b></span>
                                        <span>Stok Fisik: <b className="text-black">{item.stokFisik} {unit}</b></span>
                                    </div>
                                    {item.catatan && (
                                        <p className="text-xs text-gray-500 italic">Catatan: {item.catatan}</p>
                                    )}
                                </div>
                            );
                        })}
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

export default StockOpnameDetailModal;