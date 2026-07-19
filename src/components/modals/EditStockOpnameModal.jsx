import React, { useState, useEffect } from "react";
import Modal from "./Modal.jsx";


const getUnit = (type) => (type || "").toUpperCase() === "ACCESSORIES" ? "Pcs" : "Kg";

const EditStockOpnameModal = ({ isOpen, onClose, opname, onSave, isSaving }) => {
    const [rowData, setRowData] = useState({});

    useEffect(() => {
        if (opname) {
            const initial = {};
            (opname.items || []).forEach((it) => {
                initial[it.productId] = {
                    stokFisik: String(it.stokFisik),
                    catatan: it.catatan || "",
                };
            });
            setRowData(initial);
        }
    }, [opname]);

    if (!opname) return null;

    const handleFieldChange = (productId, field, value) => {
        setRowData((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    const getSelisih = (item) => {
        const stokFisik = rowData[item.productId]?.stokFisik;
        if (stokFisik === undefined || stokFisik === "") return null;
        return Number(stokFisik) - item.stokSistem;
    };

    const handleSubmit = () => {
        const items = (opname.items || [])
            .filter((it) => rowData[it.productId]?.stokFisik !== "")
            .map((it) => ({
                productId: it.productId,
                stokFisik: Number(rowData[it.productId].stokFisik),
                catatan: rowData[it.productId]?.catatan?.trim() || undefined,
            }));

        if (items.length === 0) {
            alert("Isi minimal 1 stok fisik produk.");
            return;
        }

        const missingNote = items.find((it) => {
            const original = opname.items.find((oi) => oi.productId === it.productId);
            const selisih = it.stokFisik - original.stokSistem;
            return selisih !== 0 && !it.catatan;
        });
        if (missingNote) {
            const product = opname.items.find((it) => it.productId === missingNote.productId)?.product;
            alert(`Produk "${product?.name}" memiliki selisih, catatan wajib diisi.`);
            return;
        }

        // Delegasikan pemanggilan API ke hook lewat prop onSave
        onSave(opname, items);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Stock Opname"
            // subtitle={opname.originalderNumber}
        >
            <div className="font-inter space-y-6">
                <div className="text-sm">
                    <span className="text-gray-500">Cabang Toko</span>
                    <p className="font-semibold text-black">{opname.store?.name || "-"}</p>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {(opname.items || []).map((item) => {
                        const selisih = getSelisih(item);
                        const unit = getUnit(item.product?.type);
                        return (
                            <div key={item.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full shrink-0 border border-gray-200"
                                            style={{ backgroundColor: item.product?.hexColor || (item.product?.type === "ACCESSORIES" ? "#808080" : "#9ca3af") }}
                                        ></div>
                                        <div>
                                            <p className="text-sm font-semibold text-black">{item.product?.name}</p>
                                            <p className="text-xs text-gray-700">{item.product?.code} – {item.product?.type}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-black">
                                        Stok Sistem: <b className="text-black">{item.stokSistem} {unit}</b>
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-black">Stok Fisik</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={rowData[item.productId]?.stokFisik ?? ""}
                                            onChange={(e) => handleFieldChange(item.productId, "stokFisik", e.target.value)}
                                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-buttonBlue"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-black">Selisih</label>
                                        <div className="pt-2">
                                            {selisih !== null ? (
                                                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                                                    selisih === 0 ? "bg-gray-100 text-gray-600" :
                                                        selisih > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                                }`}>
                                                    {selisih > 0 ? "+" : ""}{selisih} {unit}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs">-</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-black">Catatan</label>
                                    <input
                                        type="text"
                                        value={rowData[item.productId]?.catatan ?? ""}
                                        onChange={(e) => handleFieldChange(item.productId, "catatan", e.target.value)}
                                        placeholder={selisih !== null && selisih !== 0 ? "Wajib diisi (ada selisih)" : "Opsional"}
                                        className={`w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-buttonBlue ${
                                            selisih !== null && selisih !== 0 && !rowData[item.productId]?.catatan ? "border-red-300" : ""
                                        }`}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex gap-4 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 border-2 border-line rounded-xl text-sm font-inter font-semibold text-txtNav hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 py-3 bg-button hover:bg-button2 rounded-xl text-sm font-inter font-semibold text-black shadow-md transition disabled:opacity-50"
                    >
                        {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default EditStockOpnameModal;