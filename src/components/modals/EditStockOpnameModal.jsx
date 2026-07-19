import React, { useState, useEffect } from "react";
import { FiPlus, FiShoppingBag } from "react-icons/fi";
import Modal from "./Modal.jsx";
import FilterDropdown from "../ui/FilterDropdown.jsx";
import { productService } from "../../api/services/productService.js";
import ProductVisual from "../ui/Productvisual.jsx";

const getUnit = (type) => (type || "").toUpperCase() === "ACCESSORIES" ? "Pcs" : "Kg";

const EditStockOpnameModal = ({ isOpen, onClose, opname, onSave, isSaving }) => {
    const [rowData, setRowData] = useState({});
    const [extraItems, setExtraItems] = useState([]); // item baru yang ditambahkan
    const [productOptions, setProductOptions] = useState([]);
    const [selectedNewProductId, setSelectedNewProductId] = useState("");
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

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
            setExtraItems([]);
        }
    }, [opname]);

    useEffect(() => {
        if (!isOpen || !opname) return;
        setIsLoadingProducts(true);
        productService.getAllProducts({ limit: 100 }).then((res) => {
            if (res && res.success) {
                const transformed = res.data.map((p) => {
                    let stock = p.totalStock;
                    if (opname.storeId) {
                        const storeStock = p.stockPerStore?.find((s) => s.store.id === opname.storeId);
                        stock = storeStock ? storeStock.quantity : 0;
                    }
                    return {
                        id: p.id,
                        name: p.name,
                        code: p.code || "-",
                        type: p.type,
                        unit: getUnit(p.type),
                        hexColor: p.hexColor || (p.type === "ACCESSORIES" ? "#808080" : "#9ca3af"),
                        icon: p.icon || null,
                        stokSistem: stock,
                    };
                });
                setProductOptions(transformed);
            }
            setIsLoadingProducts(false);
        });
    }, [isOpen, opname]);

    if (!opname) return null;

    const handleFieldChange = (productId, field, value) => {
        setRowData((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    const getSelisih = (stokSistem, productId) => {
        const stokFisik = rowData[productId]?.stokFisik;
        if (stokFisik === undefined || stokFisik === "") return null;
        return Number(stokFisik) - stokSistem;
    };

    const existingProductIds = new Set([
        ...(opname.items || []).map((it) => it.productId),
        ...extraItems.map((it) => it.productId),
    ]);
    const availableToAdd = productOptions.filter((p) => !existingProductIds.has(p.id));

    const handleAddItem = () => {
        if (!selectedNewProductId) return;
        const product = productOptions.find((p) => p.id === selectedNewProductId);
        if (!product) return;

        setExtraItems((prev) => [...prev, product]);
        setRowData((prev) => ({
            ...prev,
            [product.id]: { stokFisik: "", catatan: "" },
        }));
        setSelectedNewProductId("");
    };

    const handleRemoveExtraItem = (productId) => {
        setExtraItems((prev) => prev.filter((it) => it.id !== productId));
        setRowData((prev) => {
            const copy = { ...prev };
            delete copy[productId];
            return copy;
        });
    };

    const handleSubmit = () => {
        const existingItems = (opname.items || [])
            .filter((it) => rowData[it.productId]?.stokFisik !== "")
            .map((it) => ({
                productId: it.productId,
                stokFisik: Number(rowData[it.productId].stokFisik),
                catatan: rowData[it.productId]?.catatan?.trim() || undefined,
            }));

        const newItems = extraItems
            .filter((it) => rowData[it.id]?.stokFisik !== "")
            .map((it) => ({
                productId: it.id,
                stokFisik: Number(rowData[it.id].stokFisik),
                catatan: rowData[it.id]?.catatan?.trim() || undefined,
            }));

        const allItems = [...existingItems, ...newItems];

        if (allItems.length === 0) {
            alert("Isi minimal 1 stok fisik produk.");
            return;
        }

        const missingNote = existingItems.find((it) => {
            const original = opname.items.find((oi) => oi.productId === it.productId);
            const selisih = it.stokFisik - original.stokSistem;
            return selisih !== 0 && !it.catatan;
        });
        if (missingNote) {
            const product = opname.items.find((it) => it.productId === missingNote.productId)?.product;
            alert(`Produk "${product?.name}" memiliki selisih, catatan wajib diisi.`);
            return;
        }

        onSave(opname, allItems);
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

                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                    {(opname.items || []).map((item) => {
                        const unit = getUnit(item.product?.type);
                        const selisih = getSelisih(item.stokSistem, item.productId);
                        return (
                            <div key={item.id} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ProductVisual
                                            product={item.product}
                                            size={40}
                                            className="rounded-lg border border-gray-200"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-black">{item.product?.name}</p>
                                            <p className="text-xs text-gray-700">{item.product?.code} • {item.product?.type}</p>
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

                    {extraItems.map((product) => {
                        const unit = getUnit(product.type);
                        const selisih = getSelisih(product.stokSistem, product.id);
                        return (
                            <div key={product.id} className="p-3 bg-blue-50 rounded-xl border border-blue-100 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ProductVisual
                                            product={product}
                                            size={40}
                                            className="rounded-lg border border-gray-200"
                                        />
                                        <div>
                                            <p className="text-sm font-semibold text-black">{product.name} <span className="text-[10px] text-blue-600 font-normal">(baru)</span></p>
                                            <p className="text-xs text-gray-700">{product.code} • {product.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-black">
                                            Stok Sistem: <b className="text-black">{product.stokSistem} {unit}</b>
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExtraItem(product.id)}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-black">Stok Fisik</label>
                                        <input
                                            type="number"
                                            min={0}
                                            value={rowData[product.id]?.stokFisik ?? ""}
                                            onChange={(e) => handleFieldChange(product.id, "stokFisik", e.target.value)}
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
                                        value={rowData[product.id]?.catatan ?? ""}
                                        onChange={(e) => handleFieldChange(product.id, "catatan", e.target.value)}
                                        placeholder={selisih !== null && selisih !== 0 ? "Wajib diisi (ada selisih)" : "Opsional"}
                                        className="w-full border rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-buttonBlue"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <FilterDropdown
                        icon={FiShoppingBag}
                        label={isLoadingProducts ? "Memuat produk..." : "+ Pilih produk untuk ditambahkan..."}
                        value={selectedNewProductId}
                        onChange={(val) => setSelectedNewProductId(val)}
                        options={availableToAdd.map((p) => ({
                            value: p.id,
                            label: `${p.name} (${p.code})`,
                        }))}
                        className="flex-1 pb-8"
                        triggerClassName="px-4 py-1"
                        optionClassName="py-1"
                        maxHeight={200}
                    />
                    <button
                        type="button"
                        onClick={handleAddItem}
                        disabled={!selectedNewProductId}
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg text-sm font-medium flex items-center gap-1.5 transition"
                    >
                        <FiPlus size={16} /> Tambah
                    </button>
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