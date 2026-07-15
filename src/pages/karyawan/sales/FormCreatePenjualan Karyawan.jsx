import { useState, useEffect } from "react";
import InputField from "../../../components/forms/InputField.jsx";
import DropDownField from "../../../components/forms/DropDownField.jsx";
import DateField from "../../../components/forms/DateField.jsx";
import { storeService } from "../../../api/services/storeService.js";
import { productService } from "../../../api/services/productService.js";
import useAuthStore from "../../../store/authStore.js";

// editSale   = row dari tabel yang diklik edit (null kalau mode create)
// onSimpan   = handler create
// onUpdate   = handler update
// onBatalEdit = reset ke mode create
const FormCreatePenjualanKaryawan = ({ onSimpan, onUpdate, editSale, onBatalEdit }) => {
    const { user } = useAuthStore();
    const isEditMode = !!editSale;

    const [storeOptions, setStoreOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [storeName, setStoreName] = useState("");

    const emptyForm = {
        storeId: user?.storeId || "",
        productId: "",
        kode: "",
        namaBarang: "",
        type: "",
        quantity: "",
        sellPrice: "",
        tanggal: "",
    };

    const [form, setForm] = useState(emptyForm);

    // Saat editSale berubah → pre-fill atau reset form
    useEffect(() => {
        if (editSale) {
            setForm({
                storeId: editSale.storeId || "",
                productId: editSale.productId || "",
                kode: editSale.kode || "",
                namaBarang: editSale.namaBarang || "",
                type: editSale.type || "",
                quantity: editSale.quantity ? String(editSale.quantity) : "",
                sellPrice: editSale.sellPrice ? String(editSale.sellPrice) : "",
                tanggal: editSale.date ? editSale.date.split("T")[0] : "",
            });
        } else {
            setForm({ ...emptyForm, storeId: user?.storeId || "" });
        }
    }, [editSale]);

    useEffect(() => {
        // Fetch cabang
        storeService.getAll().then((res) => {
            const stores = res.data || [];
            setStoreOptions(stores.map((s) => ({ label: s.name, value: s.id })));
            if (user?.storeId) {
                const found = stores.find((s) => s.id === user.storeId);
                if (found) setStoreName(found.name);
            }
        }).catch(() => {});

        // Fetch produk
        productService.getAllProducts({ page: 1, limit: 50 }).then((res) => {
            const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
            setProductOptions(
                list.map((p) => ({
                    label: `[${p.code}] ${p.name}`,
                    value: p.id,
                    code: p.code,
                    name: p.name,
                    type: p.type,
                    sellPrice: p.sellPrice,
                }))
            );
        }).catch(() => {});
    }, []);

    const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    const handleProductChange = (productId) => {
        const found = productOptions.find((p) => p.value === productId);
        setForm((p) => ({
            ...p,
            productId,
            kode: found?.code || "",
            namaBarang: found?.name || "",
            type: found?.type || "",
            sellPrice: found?.sellPrice ? String(found.sellPrice) : "",
        }));
    };

    const handleSimpan = async () => {
        const { storeId, productId, quantity, sellPrice, tanggal } = form;
        if (!storeId)   { alert("Pilih cabang toko terlebih dahulu."); return; }
        if (!productId) { alert("Pilih produk terlebih dahulu."); return; }
        if (!quantity || Number(quantity) <= 0) { alert("Jumlah harus lebih dari 0."); return; }
        if (!sellPrice || Number(sellPrice) <= 0) { alert("Harga satuan harus lebih dari 0."); return; }
        if (!tanggal)   { alert("Tanggal penjualan wajib diisi."); return; }

        const payload = {
            storeId,
            date: tanggal,
            items: [{
                productId,
                quantity: Number(quantity),
                sellPrice: Number(sellPrice),
            }],
        };

        if (isEditMode) {
            await onUpdate(editSale.saleId, payload);
        } else {
            await onSimpan(payload);
            // Reset form setelah create
            setForm({ ...emptyForm, storeId: user?.storeId || "" });
        }
    };

    return (
        <div className="bg-card text-black rounded-2xl px-6 py-7 shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-5">
            <h2 className="font-inter font-medium text-lg">
                {isEditMode ? "Edit Penjualan Produk" : "Tambah Penjualan Produk"}
            </h2>
            <hr className="border-white/20" />

            {/* Cabang Toko */}
            {isEditMode ? (
                // Mode edit: cabang read-only
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-inter font-medium">Cabang Toko</label>
                    <div className="h-11 px-4 flex items-center rounded-xl bg-gray-100 text-sm text-gray-500 border border-gray-200">
                        {editSale?.storeName || "—"}
                    </div>
                </div>
            ) : user?.role === "OWNER" ? (
                <DropDownField
                    label="Cabang Toko"
                    options={storeOptions}
                    value={form.storeId}
                    onChange={set("storeId")}
                    placeholder="Pilih cabang..."
                />
            ) : (
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-inter font-medium">Cabang Toko</label>
                    <div className="h-11 px-4 flex items-center rounded-xl bg-gray-100 text-sm text-gray-500 border border-gray-200">
                        {storeName || "Cabang Anda"}
                    </div>
                </div>
            )}

            <DropDownField
                label="Pilih Produk"
                options={productOptions}
                value={form.productId}
                onChange={handleProductChange}
                placeholder="Pilih produk..."
            />
            <InputField
                label={<span>Kode Barang</span>}
                placeholder="Otomatis dari produk"
                value={form.kode}
                onChange={(e) => set("kode")(e.target.value)}
            />
            <InputField
                label={<span>Nama Barang</span>}
                placeholder="Otomatis dari produk"
                value={form.namaBarang}
                onChange={(e) => set("namaBarang")(e.target.value)}
            />
            <InputField
                label={<span>Tipe Barang</span>}
                placeholder="Otomatis dari produk"
                value={form.type}
                onChange={(e) => set("type")(e.target.value)}
            />
            <InputField
                label={<span>Total Produk (Kg)</span>}
                type="number"
                placeholder="Contoh: 5"
                value={form.quantity}
                onChange={(e) => set("quantity")(e.target.value)}
            />
            <InputField
                label={<span>Harga Satuan (Rp)</span>}
                type="number"
                placeholder="Otomatis dari produk"
                value={form.sellPrice}
                onChange={(e) => set("sellPrice")(e.target.value)}
            />
            <DateField
                label={<span>Tanggal Penjualan</span>}
                value={form.tanggal}
                onChange={set("tanggal")}
            />

            {/* Tombol Batal hanya muncul saat mode edit */}
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
                {isEditMode ? "Update Transaksi" : "Simpan Transaksi"}
            </button>
        </div>
    );
};

export default FormCreatePenjualanKaryawan;