import React, { useState, useEffect } from "react";
import Modal from "./Modal.jsx";
import { productService } from "../../api/services/productService.js";

const getUnit = (type) => (type || "").toUpperCase() === "ACCESSORIES" ? "Pcs" : "Kg";

const EditStockOpnameModal = ({ isOpen, onClose, opname, onSave, isSaving }) => {
    const [rowData, setRowData] = useState({});
    const [liveStock, setLiveStock] = useState({}); // productId -> stok sistem terkini
    const [isLoadingStock, setIsLoadingStock] = useState(false);

    // Isi ulang input stok fisik & catatan setiap kali opname yang diedit berganti
    useEffect(() => {
        if (opname) {
            const initial = {};
            (opname.items || []).forEach((it) => {
                initial[it.productId] = {
                    stokFisik: it.stokFisik !== null && it.stokFisik !== undefined ? String(it.stokFisik) : "",
                    catatan: it.catatan || "",
                };
            });
            setRowData(initial);
        }
    }, [opname]);

    // Ambil stok sistem TERKINI dari data produk (bukan nilai yang dibekukan saat opname dibuat).
    // Ini penting karena selama status masih DRAFT, opname belum "commit" ke inventory,
    // jadi stok sistem yang relevan adalah kondisi stok saat ini, bukan snapshot lama.
    useEffect(() => {
        if (!isOpen || !opname) return;
        setIsLoadingStock(true);
        productService.getAllProducts({ limit: 200 })
            .then((res) => {
                if (res && res.success) {
                    const map = {};
                    res.data.forEach((p) => {
                        let stock = p.totalStock;
                        if (opname.storeId) {
                            const storeStock = p.stockPerStore?.find((s) => s.store.id === opname.storeId);
                            stock = storeStock ? storeStock.quantity : 0;
                        }
                        map[p.id] = stock;
                    });
                    setLiveStock(map);
                }
            })
            .finally(() => setIsLoadingStock(false));
    }, [isOpen, opname]);

    if (!opname) return null;

    const handleFieldChange = (productId, field, value) => {
        setRowData((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    // Fallback ke stokSistem yang tersimpan di item kalau data live belum/gagal dimuat
    const getStokSistem = (item) => liveStock[item.productId] ?? item.stokSistem;

    const getSelisih = (stokSistem, productId) => {
        const stokFisik = rowData[productId]?.stokFisik;
        if (stokFisik === undefined || stokFisik === "") return null;
        return Number(stokFisik) - stokSistem;
    };

    const handleSubmit = () => {
        const items = (opname.items || [])
            .filter((it) => rowData[it.productId]?.stokFisik !== "")
            .map((it) => {
                const stokSistem = getStokSistem(it);
                return {
                    productId: it.productId,
                    stokSistem,
                    stokFisik: Number(rowData[it.productId].stokFisik),
                    catatan: rowData[it.productId]?.catatan?.trim() || undefined,
                };
            });

        if (items.length === 0) {
            alert("Isi minimal 1 stok fisik produk.");
            return;
        }

        const missingNote = items.find((it) => {
            const selisih = it.stokFisik - it.stokSistem;
            return selisih !== 0 && !it.catatan;
        });
        if (missingNote) {
            const product = opname.items.find((it) => it.productId === missingNote.productId)?.product;
            alert(`Produk "${product?.name}" memiliki selisih, catatan wajib diisi.`);
            return;
        }

        onSave(opname, items);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Stock Opname"
        >
            <div className="font-inter space-y-6">
                <div className="text-sm">
                    <span className="text-gray-500">Cabang Toko</span>
                    <p className="font-semibold text-black">{opname.store?.name || "-"}</p>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                    {(opname.items || []).map((item) => {
                        const unit = getUnit(item.product?.type);
                        const stokSistem = getStokSistem(item);
                        const selisih = getSelisih(stokSistem, item.productId);
                        return (
                            <div key={item.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-black">{item.product?.name}</p>
                                        <p className="text-xs text-gray-700">{item.product?.code} • {item.product?.type}</p>
                                    </div>
                                    <span className="text-xs text-black">
                                        Stok Sistem: <b className="text-black">
                                            {isLoadingStock ? "..." : `${stokSistem} ${unit}`}
                                        </b>
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