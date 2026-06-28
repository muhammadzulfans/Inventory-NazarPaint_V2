import { useState } from "react";
import InputField from "../../../components/forms/InputField.jsx";
import DropDownField from "../../../components/forms/DropDownField.jsx";
import DateField from "../../../components/forms/DateField.jsx";
import SidebarButton from "../../../components/sidebar/SidebarButton.jsx";
import {LuLayoutDashboard} from "react-icons/lu";

const tipeOptions = [
    { value: "Pro", label: "Pro" },
    { value: "Super", label: "Super" },
    { value: "Gloss", label: "Gloss" },
];

const FormCreatePenjualanKaryawan = ({ onSimpan }) => {
    const [form, setForm] = useState({
        kode: "", namaBaranag: "", type: "",
        totalProduk: "", hargaSatuan: "", tanggal: "",
    });

    const set = (key) => (val) => setForm((p) => ({ ...p, [key]: val }));

    const handleSimpan = () => {
        const { kode, namaBaranag, type, totalProduk, hargaSatuan, tanggal } = form;
        if (!kode || !namaBaranag || !type || !totalProduk || !hargaSatuan || !tanggal) {
            alert("Lengkapi semua field terlebih dahulu.");
            return;
        }
        onSimpan({
            kode,
            namaBaranag,
            type,
            totalProduk: Number(totalProduk),
            hargaSatuan: Number(hargaSatuan),
            tanggal,
        });
        setForm({ kode: "", namaBaranag: "", type: "", totalProduk: "", hargaSatuan: "", tanggal: "" });
    };

    return (
        <div className="bg-card text-black rounded-2xl px-6 py-7 shadow-[0_4px_4px_rgba(0,0,0,0.25)] flex flex-col gap-5">
            <h2 className=" font-inter font-medium text-lg">Tambah Penjualan</h2>
            <hr className="border-white/20" />

            <InputField
                label={<span>Kode Barang</span>}
                placeholder="Contoh: 229"
                value={form.kode}
                onChange={(e) => set("kode")(e.target.value)}
            />
            <InputField
                label={<span>Nama Barang</span>}
                placeholder="Contoh: White"
                value={form.namaBaranag}
                onChange={(e) => set("namaBaranag")(e.target.value)}
            />
            <DropDownField
                label={<span>Tipe Barang</span>}
                options={tipeOptions}
                value={form.type}
                onChange={set("type")}
                placeholder="Pilih tipe..."
            />
            <InputField
                label={<span>Total Produk (Kg)</span>}
                type="number"
                placeholder="Contoh: 5"
                value={form.totalProduk}
                onChange={(e) => set("totalProduk")(e.target.value)}
            />
            <InputField
                label={<span>Harga Satuan (Rp)</span>}
                type="number"
                placeholder="Contoh: 16000"
                value={form.hargaSatuan}
                onChange={(e) => set("hargaSatuan")(e.target.value)}
            />
            <DateField
                label={<span>Tanggal Penjualan</span>}
                value={form.tanggal}
                onChange={set("tanggal")}
            />

            <button
                onClick={handleSimpan}
                className="mt-2 bg-button text- font-inter font-semibold text-sm py-3 rounded-xl hover:bg-green-50 transition-colors shadow"
            >
                Simpan Transaksi
            </button>
        </div>
    );
};

export default FormCreatePenjualanKaryawan;