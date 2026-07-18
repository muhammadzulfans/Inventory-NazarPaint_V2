import React, { useState, useEffect } from "react";
import {FiTrash2, FiPlus, FiShoppingBag} from "react-icons/fi";
import Modal from "./Modal.jsx";
import InputField from "../forms/InputField.jsx";
import { productService } from "../../api/services/productService.js";
import FilterDropdown from "../ui/FilterDropdown.jsx";

const formatRupiah = (number) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number || 0);

const EditSaleModal = ({ isOpen, onClose, sale, onSave, isSaving }) => {
    const [customerName, setCustomerName] = useState("");
    const [items, setItems] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [selectedNewProductId, setSelectedNewProductId] = useState("");
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    useEffect(() => {
        if (sale) {
            setCustomerName(sale.customerName || "");
            setItems(
                (sale.items || []).map((it) => ({
                    productId: it.productId,
                    name: it.product?.name || "Produk",
                    code: it.product?.code || "-",
                    type: it.product?.type || "",
                    unit: it.product?.unit || "",
                    sellPrice: it.sellPrice,
                    quantity: it.quantity,
                }))
            );
        }
    }, [sale]);

    // Ambil daftar produk + stok khusus di cabang transaksi ini setiap modal dibuka
    useEffect(() => {
        if (!isOpen || !sale) return;
        setIsLoadingProducts(true);
        productService.getAllProducts({ limit: 100 }).then((res) => {
            if (res && res.success) {
                const transformed = res.data.map((p) => {
                    let stock = p.totalStock;
                    if (sale.storeId) {
                        const storeStock = p.stockPerStore?.find((s) => s.store.id === sale.storeId);
                        stock = storeStock ? storeStock.quantity : 0;
                    }
                    return {
                        id: p.id,
                        name: p.name,
                        code: p.code || "-",
                        type: p.type,
                        unit: p.unit || "Kg",
                        sellPrice: p.sellPrice,
                        stock,
                    };
                });
                setProductOptions(transformed);
            }
            setIsLoadingProducts(false);
        });
    }, [isOpen, sale]);

    if (!sale) return null;

    const handleQtyChange = (productId, value) => {
        const qty = Math.max(1, Number(value) || 1);
        setItems((prev) =>
            prev.map((it) => (it.productId === productId ? { ...it, quantity: qty } : it))
        );
    };

    const handleRemoveItem = (productId) => {
        setItems((prev) => prev.filter((it) => it.productId !== productId));
    };

    const handleAddItem = () => {
        if (!selectedNewProductId) return;
        const product = productOptions.find((p) => p.id === selectedNewProductId);
        if (!product || product.stock <= 0) return; // extra guard, walau dropdown udah disable

        setItems((prev) => {
            const existing = prev.find((it) => it.productId === product.id);
            if (existing) {
                return prev.map((it) =>
                    it.productId === product.id ? { ...it, quantity: it.quantity + 1 } : it
                );
            }
            return [
                ...prev,
                {
                    productId: product.id,
                    name: product.name,
                    code: product.code,
                    type: product.type,
                    unit: product.unit,
                    sellPrice: product.sellPrice,
                    quantity: 1,
                },
            ];
        });
        setSelectedNewProductId("");
    };

    // Produk yang belum ada di daftar item, biar gak duplikat di dropdown tambah
    const availableToAdd = productOptions.filter(
        (p) => !items.some((it) => it.productId === p.id)
    );

    const subtotal = items.reduce((sum, it) => sum + it.sellPrice * it.quantity, 0);
    const totalKg = items
        .filter((it) => (it.unit || "").toLowerCase() === "kg")
        .reduce((sum, it) => sum + it.quantity, 0);
    const totalPcs = items
        .filter((it) => (it.unit || "").toLowerCase() === "pcs")
        .reduce((sum, it) => sum + it.quantity, 0);

    const handleSubmit = () => {
        if (items.length === 0) {
            alert("Transaksi harus memiliki minimal 1 item barang.");
            return;
        }
        const payload = {
            customerName: customerName || null,
            items: items.map((it) => ({
                productId: it.productId,
                quantity: it.quantity,
                sellPrice: it.sellPrice,
                totalPrice: it.sellPrice * it.quantity,
            })),
        };
        onSave(sale.id, payload);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Edit Transaksi Penjualan"
            subtitle={sale.orderNumber}
        >
            <div className="font-inter space-y-6">
                <InputField
                    label="Nama Pelanggan"
                    placeholder="Nama pelanggan.."
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                />

                {/* Daftar Item Dibeli */}
                <div>
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Daftar Item Dibeli</h3>
                        <span className="text-xs text-gray-400 font-semibold">{items.length} Item</span>
                    </div>

                    <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                        {items.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-4">Belum ada item.</p>
                        ) : (
                            items.map((item) => {
                                const product = item.product || {};
                                const hex = product.hexColor || (product.type === "ACCESSORIES" ? "#808080" : "#9ca3af"); // langsung dari backend
                                return (
                                    <div
                                        key={item.productId}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <div
                                                className="w-10 h-10 rounded-lg shrink-0 border border-gray-200"
                                                style={{ backgroundColor: hex }}
                                            ></div>
                                            <div>
                                                <p className="text-sm font-semibold text-black">
                                                    {item.name} {item.code ? `(${item.code})` : ""}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {formatRupiah(item.sellPrice)} / {item.unit}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                min={1}
                                                value={item.quantity}
                                                onChange={(e) => handleQtyChange(item.productId, e.target.value)}
                                                className="w-16 border rounded-lg px-2 py-1 text-center outline-none focus:ring-1 focus:ring-buttonBlue"
                                            />
                                            <span className="text-xs text-gray-500">{item.unit}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveItem(item.productId)}
                                                className="text-trash p-1.5 border border-trash rounded-md hover:bg-red-50 transition"
                                            >
                                                <FiTrash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Tambah Item — stok habis tetap tampil, tapi disabled */}
                <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <FilterDropdown
                        icon={FiShoppingBag}
                        label={isLoadingProducts ? "Memuat produk..." : "+ Pilih produk untuk ditambahkan..."}
                        value={selectedNewProductId}
                        onChange={(val) => setSelectedNewProductId(val)}
                        options={availableToAdd.map((p) => ({
                            value: p.id,
                            label: `${p.name} (${p.code}) — ${formatRupiah(p.sellPrice)}/${p.unit}${p.stock <= 0 ? " — Stok Habis" : ""}`,
                            disabled: p.stock <= 0,
                        }))}
                        className="flex-1 pb-8"
                        triggerClassName="px-4 py-1"      // lebih compact
                        optionClassName="py-1"          // list item lebih rapat
                        maxHeight={200}
                    />
                    <button
                        type="button"
                        onClick={handleAddItem}
                        disabled={
                            !selectedNewProductId ||
                            (productOptions.find((p) => p.id === selectedNewProductId)?.stock ?? 0) <= 0
                        }
                        className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 disabled:opacity-40 rounded-lg text-sm font-medium flex items-center gap-1.5 transition"
                    >
                        <FiPlus size={16} /> Tambah
                    </button>
                </div>

                {/* Ringkasan */}
                <div className="pt-4 border-t border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                        <span>Total Kuantitas (Kg)</span>
                        <span className="font-semibold text-black">{totalKg} Kg</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                        <span>Total Kuantitas (Pcs)</span>
                        <span className="font-semibold text-black">{totalPcs} Pcs</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-gray-100">
                        <span>Total Harga</span>
                        <span className="text-green-600">{formatRupiah(subtotal)}</span>
                    </div>
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

export default EditSaleModal;
