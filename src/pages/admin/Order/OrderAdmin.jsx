import { useState, useEffect } from "react";
import { storeService } from "../../../api/services/storeService.js";
import { productService } from "../../../api/services/productService.js";
import { orderService } from "../../../api/services/orderService.js";
import useAuthStore from "../../../store/authStore.js";

// Import UI Components dari project lu
import DropDownField from "../../../components/forms/DropDownField.jsx";
import InputField from "../../../components/forms/InputField.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";

// Icons
import { FiTrash2, FiFileText } from "react-icons/fi";

const OrderAdmin = () => {
    const { user } = useAuthStore();

    // Data dropdown options
    const [storeOptions, setStoreOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);

    // Master Form State
    const [selectedStore, setSelectedStore] = useState("");

    // Form Item State (Input field produk sementara)
    const [itemForm, setItemForm] = useState({
        productId: "",
        quantity: "",
        basePrice: "",
        kode: "",
        namaBarang: "",
        type: "",
        deskripsi: "", // Tambah field deskripsi sesuai kolom mockup
    });

    // Temporary list state (Daftar Item Pesanan di bawah)
    const [orderItems, setOrderItems] = useState([]);

    // Modal & Loading States
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Master Data
    useEffect(() => {
        storeService.getAll()
            .then((res) => {
                const stores = res.data || [];
                setStoreOptions(stores.map((s) => ({ label: s.name, value: s.id })));
            })
            .catch((err) => console.error("Error fetch stores:", err));

        productService.getAllProducts({ page: 1, limit: 100 })
            .then((res) => {
                const list = Array.isArray(res.data) ? res.data : (res.data?.data || []);
                setProductOptions(
                    list.map((p) => ({
                        label: `[${p.code}] ${p.name}`,
                        value: p.id,
                        code: p.code,
                        name: p.name,
                        type: p.type,
                        basePrice: p.basePrice || p.price || 0,
                    }))
                );
            })
            .catch((err) => console.error("Error fetch products:", err));
    }, []);

    // Handle saat produk dipilih di dropdown
    const handleProductChange = (productId) => {
        const found = productOptions.find((p) => p.value === productId);
        setItemForm({
            productId,
            kode: found?.code || "",
            namaBarang: found?.name || "",
            type: found?.type || "",
            quantity: "",
            basePrice: found?.basePrice ? String(found.basePrice) : "",
            deskripsi: "Restock reguler bulanan", // Default value pengisi deskripsi biar mirip foto
        });
    };

    // Tambahkan item dari form ke daftar tabel bawah
    const handleAddItemToList = () => {
        const { productId, quantity, basePrice, kode, namaBarang, type, deskripsi } = itemForm;

        if (!selectedStore) {
            alert("Pilih cabang toko terlebih dahulu bro!");
            return;
        }
        if (!productId) {
            alert("Pilih produk terlebih dahulu!");
            return;
        }
        if (!quantity || Number(quantity) <= 0) {
            alert("Kuantitas harus lebih besar dari 0!");
            return;
        }
        if (!basePrice || Number(basePrice) <= 0) {
            alert("Harga satuan harus lebih besar dari 0!");
            return;
        }

        const existingItemIndex = orderItems.findIndex((item) => item.productId === productId);
        if (existingItemIndex > -1) {
            const updatedItems = [...orderItems];
            updatedItems[existingItemIndex].quantity += Number(quantity);
            updatedItems[existingItemIndex].totalPrice = updatedItems[existingItemIndex].quantity * updatedItems[existingItemIndex].basePrice;
            setOrderItems(updatedItems);
        } else {
            setOrderItems((prev) => [
                ...prev,
                {
                    productId,
                    kode,
                    namaBarang,
                    type,
                    deskripsi: deskripsi || "Restock produk",
                    quantity: Number(quantity),
                    basePrice: Number(basePrice),
                    totalPrice: Number(quantity) * Number(basePrice),
                },
            ]);
        }

        // Reset input field item
        setItemForm({
            productId: "",
            quantity: "",
            basePrice: "",
            kode: "",
            namaBarang: "",
            type: "",
            deskripsi: "",
        });
    };

    // Hitung akumulasi untuk footer tabel & ringkasan kanan
    const totalUnitItems = orderItems.reduce((acc, item) => acc + item.quantity, 0); // Total unit (misal: 80 unit)
    const totalJenisProduk = orderItems.length; // Total Jenis Produk (misal: 2 jenis)
    const totalOrderAmount = orderItems.reduce((acc, item) => acc + item.totalPrice, 0);

    // Kirim data pesanan ke Backend
    const handleCreatePurchaseOrder = async () => {
        if (orderItems.length === 0) return;

        setIsSubmitting(true);
        try {
            const payload = {
                storeId: selectedStore,
                date: new Date().toISOString().split("T")[0],
                userId: user?.id,
                items: orderItems.map((item) => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    basePrice: item.basePrice,
                })),
            };

            await orderService.create(payload);
            setSuccessMessage("Pesanan Pembelian Berhasil Dibuat!");
            setIsSuccessOpen(true);

            setOrderItems([]);
            setSelectedStore("");
        } catch (err) {
            alert("Gagal membuat pesanan: " + (err.response?.data?.message || err.message));
        } {
            setIsSubmitting(false);
        }
    };

    const handleCancelAll = () => {
        if (window.confirm("Apakah anda yakin ingin membatalkan semua daftar pesanan ini?")) {
            setOrderItems([]);
            setSelectedStore("");
        }
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-[#f4f5f7] min-h-screen text-black font-inter">
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* SISI KIRI: INPUT FORM & TABEL ITEM KANVAS */}
                <div className="flex-1 w-full lg:w-3/4 flex flex-col gap-6">

                    {/* CARD 1: FORM INPUT */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-yellow-50 p-2 rounded-lg text-yellow-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                </svg>
                            </div>
                            <h2 className="text-md font-semibold text-gray-800">Tambah Item ke Pesanan</h2>
                        </div>

                        <div className="flex flex-col gap-4">
                            <DropDownField
                                label="CABANG TOKO *"
                                options={storeOptions}
                                value={selectedStore}
                                onChange={(val) => setSelectedStore(val)}
                                placeholder="Cari atau pilih cabang toko..."
                                disabled={orderItems.length > 0}
                            />

                            <DropDownField
                                label="PRODUK *"
                                options={productOptions}
                                value={itemForm.productId}
                                onChange={handleProductChange}
                                placeholder="Cari produk berdasarkan nama atau tipe..."
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    label="KUANTITAS PESANAN (KG/PCS) *"
                                    type="number"
                                    placeholder="0"
                                    value={itemForm.quantity}
                                    onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                                />
                                <InputField
                                    label="HARGA SATUAN (HARGA BELI) *"
                                    type="number"
                                    placeholder="0"
                                    value={itemForm.basePrice}
                                    onChange={(e) => setItemForm({ ...itemForm, basePrice: e.target.value })}
                                />
                            </div>

                            <div className="flex justify-end mt-2">
                                <button
                                    onClick={handleAddItemToList}
                                    className="bg-[#fce78d] hover:bg-[#fbdc5c] text-gray-700 font-semibold text-xs px-5 py-3 rounded-xl transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <span className="text-sm">+</span> Tambahkan ke Daftar Pesanan
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* CARD 2: DAFTAR ITEM PESANAN (TABEL ISI DUA FOTO TERBARU) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
                            <h2 className="text-sm font-bold text-gray-800">Daftar Item Pesanan</h2>
                            <span className="text-xs text-gray-400 font-medium">{totalJenisProduk} item</span>
                        </div>

                        {orderItems.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-6">
                                <div className="border-2 border-dashed border-gray-200 p-4 rounded-full mb-3 text-gray-300">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                                    </svg>
                                </div>
                                <p className="text-xs text-gray-400 font-medium">Belum ada item. Tambahkan produk di atas.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col w-full">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-xs text-left align-middle">
                                        <thead className="bg-[#f8fafc] text-gray-400 font-semibold tracking-wider uppercase border-b border-gray-100">
                                        <tr>
                                            <th className="p-4 w-12 text-center">#</th>
                                            <th className="p-4">Produk</th>
                                            {/*<th className="p-4">Deskripsi</th>*/}
                                            <th className="p-4">Kuantitas</th>
                                            <th className="p-4">Harga Satuan</th>
                                            <th className="p-4">Subtotal Harga</th>
                                            <th className="p-4 text-center">Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 text-gray-700">
                                        {orderItems.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/40 transition-colors">
                                                <td className="p-4 text-center text-gray-400 font-medium">{idx + 1}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        {/* Placeholder Lingkaran Warna / Thumbnail Proyek Lu */}
                                                        <div className="w-7 h-7 bg-slate-300 rounded-full flex-shrink-0"></div>
                                                        <div>
                                                            <p className="font-bold text-gray-800 text-sm">{item.namaBarang}</p>
                                                            <p className="text-xxs text-gray-400 font-medium capitalize">{item.type}</p>
                                                            <p className="text-xxs text-gray-400 font-medium capitalize">{item.kode}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/*<td className="p-4 text-gray-400 font-medium">{item.deskripsi}</td>*/}
                                                <td className="p-4 font-bold text-gray-800">{item.quantity} Kg</td>
                                                <td className="p-4 font-bold text-gray-800">Rp {item.basePrice.toLocaleString("id-ID")}</td>
                                                <td className="p-4 font-bold text-gray-800">Rp {item.totalPrice.toLocaleString("id-ID")}</td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-2">
                                                        {/*<button className="bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 p-2 rounded-lg border border-gray-100 transition-colors">*/}
                                                        {/*    <FiFileText size={14} />*/}
                                                        {/*</button>*/}
                                                        <button
                                                            onClick={() => setOrderItems(orderItems.filter((_, i) => i !== idx))}
                                                            className="bg-gray-50 hover:bg-red-50  text-red-500 p-2 rounded-lg border border-gray-100 transition-colors"
                                                        >
                                                            <FiTrash2 size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* TABLE FOOTER SUMMARY (Sesuai Foto 2 bagian Bawah Tabel) */}
                                <div className="bg-[#f8fafc] px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-bold text-gray-700">
                                    <div className="flex gap-4">
                                        <p>Total Kuantitas: <span className="text-gray-800 font-extrabold bg-blue-300 rounded-lg p-1">{totalUnitItems} Kg</span></p>
                                        <p>Total Kuantitas: <span className="text-gray-800 font-extrabold bg-blue-300 rounded-lg p-1">{totalUnitItems} Pcs</span></p>
                                        <p>Total Item: <span className="text-gray-800 font-extrabold bg-blue-300 rounded-lg p-1">{totalJenisProduk} Item</span></p>
                                    </div>
                                    <div className="text-sm">
                                        Total: <span className="text-gray-800 font-extrabold">Rp {totalOrderAmount.toLocaleString("id-ID")}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* SISI KANAN: RINGKASAN ORDER PANEL */}
                <div className="w-full lg:w-1/4 flex flex-col gap-4">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-5">
                        <div className="flex items-center gap-2 mb-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                            </svg>
                            <h2 className="text-sm font-bold text-gray-800">Ringkasan Order</h2>
                        </div>

                        <div className="flex justify-between text-xs border-b border-gray-100 pb-3">
                            <span className="text-gray-400 font-medium">Cabang Toko</span>
                            <span className="font-bold text-gray-800 truncate max-w-[140px]">
                                {storeOptions.find((s) => s.value === selectedStore)?.label || "Belum dipilih"}
                            </span>
                        </div>

                        <div className="flex justify-between text-xs border-b border-gray-100 pb-3 items-center">
                            <span className="text-gray-400 font-medium">Total Akhir Kuantitas</span>
                            <span className="font-bold text-gray-800">
                                {orderItems.length > 0 ? `( ${totalUnitItems} Kg )` : "Belum dipilih"}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs border-b border-gray-100 pb-3 items-center">
                            <span className="text-gray-400 font-medium">Total Akhir Kuantitsa</span>
                            <span className="font-bold text-gray-800">
                                {orderItems.length > 0 ? `( ${totalUnitItems} Pcs )` : "Belum dipilih"}
                            </span>
                        </div>
                        <div className="flex justify-between text-xs border-b border-gray-100 pb-3 items-center">
                            <span className="text-gray-400 font-medium">Total Akhir Item</span>
                            <span className="font-bold text-gray-800">
                                {orderItems.length > 0 ? `( ${totalJenisProduk} Item )` : "Belum dipilih"}
                            </span>
                        </div>

                        <div className="bg-[#191d26] text-white rounded-xl p-4 flex justify-between items-center my-1 shadow-inner">
                            <span className="text-xxs text-gray-400 font-semibold tracking-wide uppercase">Total Akhir</span>
                            <span className="text-md font-bold text-[#fbdc5c]">Rp {totalOrderAmount.toLocaleString("id-ID")}</span>
                        </div>

                        <button
                            disabled={orderItems.length === 0 || isSubmitting}
                            onClick={handleCreatePurchaseOrder}
                            className={`w-full py-3.5 rounded-xl font-bold text-xs shadow-sm transition-colors text-center ${
                                orderItems.length === 0
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-[#fce78d] hover:bg-[#fbdc5c] text-gray-700"
                            }`}
                        >
                            {isSubmitting ? "Memproses..." : "Buat Pesanan Pembelian"}
                        </button>

                        <button
                            onClick={handleCancelAll}
                            className="w-full py-3.5 border border-gray-200 rounded-xl font-bold text-xs text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                            <span>✕</span> Batal
                        </button>
                    </div>
                </div>

            </div>

            {/* MODAL SUCCESS */}
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message={successMessage}
            />
        </div>
    );
};

export default OrderAdmin;