import { useState, useEffect } from "react";
import InputField from "../../../components/forms/InputField.jsx";
import DropDownField from "../../../components/forms/DropDownField.jsx";
import DateField from "../../../components/forms/DateField.jsx";

const emptyItem = () => ({ productId: "", kode: "", namaBarang: "", type: "", quantity: "" });

const FormCreateMutasi = ({ onSimpan, storeOptions, productOptions, editMutasi, onBatalEdit }) => {
    const isEditMode = !!editMutasi;

    const [form, setForm] = useState({
        fromStoreId: "",
        toStoreId: "",
        tanggal: "",
        note: "",
    });

    const [items, setItems] = useState([emptyItem()]);

    // Pre-fill saat editMutasi berubah
    useEffect(() => {
        if (editMutasi) {
            setForm({
                fromStoreId: editMutasi.fromStoreId || "",
                toStoreId: editMutasi.toStoreId || "",
                tanggal: editMutasi.date ? editMutasi.date.split("T")[0] : "",
                note: editMutasi.note || "",
            });
            setItems(
                (editMutasi.items || []).map((item) => ({
                    productId: item.productId || "",
                    kode: item.product?.code || "",
                    namaBarang: item.product?.name || "",
                    type: item.product?.type || "",
                    quantity: item.quantity ? String(item.quantity) : "",
                }))
            );
        } else {
            setForm({ fromStoreId: "", toStoreId: "", tanggal: "", note: "" });
            setItems([emptyItem()]);
        }
    }, [editMutasi]);

    const setForm_ = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    const setItem = (index, key, val) => {
        setItems((prev) => prev.map((item, i) => i === index ? { ...item, [key]: val } : item));
    };

    const handleProductChange = (index, productId) => {
        const found = productOptions.find((p) => p.value === productId);
        setItems((prev) => prev.map((item, i) =>
            i === index ? {
                ...item,
                productId,
                kode: found?.code || "",
                namaBarang: found?.name || "",
                type: found?.type || "",
            } : item
        ));
    };

    const addItem = () => setItems((prev) => [...prev, emptyItem()]);

    const removeItem = (index) => {
        if (items.length === 1) return;
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSimpan = async () => {
        const { fromStoreId, toStoreId, tanggal } = form;

        if (!fromStoreId) { alert("Pilih cabang pengirim."); return; }
        if (!toStoreId)   { alert("Pilih cabang penerima."); return; }
        if (fromStoreId === toStoreId) { alert("Cabang pengirim dan penerima tidak boleh sama."); return; }
        if (!tanggal)     { alert("Tanggal mutasi wajib diisi."); return; }

        for (let i = 0; i < items.length; i++) {
            if (!items[i].productId) { alert(`Item ke-${i + 1}: pilih produk.`); return; }
            if (!items[i].quantity || Number(items[i].quantity) <= 0) {
                alert(`Item ke-${i + 1}: jumlah harus lebih dari 0.`); return;
            }
        }

        const payload = {
            fromStoreId,
            toStoreId,
            date: tanggal,
            note: form.note || null,
            items: items.map((item) => ({
                productId: item.productId,
                quantity: Number(item.quantity),
            })),
        };

        const result = await onSimpan(payload);
        if (result?.success) {
            setForm({ fromStoreId: "", toStoreId: "", tanggal: "", note: "" });
            setItems([emptyItem()]);
        }
    };

    return (
        <div className="bg-card text-black rounded-2xl px-6 py-7 shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-5">
            <h2 className="font-inter font-medium text-lg">
                {isEditMode ? "Edit Mutasi Produk" : "Tambah Mutasi Produk"}
            </h2>
            <hr className="border-black/10" />

            <DropDownField
                label="Cabang Pengirim"
                options={storeOptions}
                value={form.fromStoreId}
                onChange={setForm_("fromStoreId")}
                placeholder="Pilih cabang pengirim..."
            />
            <DropDownField
                label="Cabang Penerima"
                options={storeOptions}
                value={form.toStoreId}
                onChange={setForm_("toStoreId")}
                placeholder="Pilih cabang penerima..."
            />
            <DateField
                label="Tanggal Mutasi"
                value={form.tanggal}
                onChange={setForm_("tanggal")}
            />

            {/* ITEMS — multi-item dinamis */}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-inter font-medium">Daftar Produk</span>
                    <button
                        onClick={addItem}
                        className="text-xs font-inter font-semibold text-button2 border border-button2 px-3 py-1 rounded-lg hover:bg-button hover:text-black transition"
                    >
                        + Tambah Produk
                    </button>
                </div>

                {items.map((item, index) => (
                    <div key={index} className="flex flex-col gap-3 p-4 bg-white rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-inter font-semibold text-gray-500">Produk {index + 1}</span>
                            {items.length > 1 && (
                                <button
                                    onClick={() => removeItem(index)}
                                    className="text-xs text-trash hover:underline"
                                >
                                    Hapus
                                </button>
                            )}
                        </div>
                        <DropDownField
                            label="Pilih Produk"
                            options={productOptions}
                            value={item.productId}
                            onChange={(val) => handleProductChange(index, val)}
                            placeholder="Pilih produk..."
                        />
                        <InputField
                            label="Kode Barang"
                            placeholder="Otomatis"
                            value={item.kode}
                            onChange={(e) => setItem(index, "kode", e.target.value)}
                        />
                        <InputField
                            label="Nama Barang"
                            placeholder="Otomatis"
                            value={item.namaBarang}
                            onChange={(e) => setItem(index, "namaBarang", e.target.value)}
                        />
                        <InputField
                            label="Total Produk (Kg)"
                            type="number"
                            placeholder="Contoh: 5"
                            value={item.quantity}
                            onChange={(e) => setItem(index, "quantity", e.target.value)}
                        />
                    </div>
                ))}
            </div>

            {/* Tombol Batal hanya saat mode edit */}
            {isEditMode && (
                <button
                    onClick={onBatalEdit}
                    className="py-3 border-2 border-line rounded-xl text-sm font-inter font-semibold text-txtNav hover:bg-gray-50 transition"
                >
                    Batal Edit
                </button>
            )}

            <button
                onClick={handleSimpan}
                className="mt-2 bg-button font-inter font-semibold text-sm py-3 rounded-xl hover:bg-button2 transition-colors shadow"
            >
                {isEditMode ? "Update Mutasi" : "Simpan Transaksi"}
            </button>
        </div>
    );
};

export default FormCreateMutasi;