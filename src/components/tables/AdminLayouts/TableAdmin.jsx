import React from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";

const TableAdmin = ({ data = [], onEdit, onDelete, isLoading, isEditable = false, storeId }) => {
    const formatDate = (isoString) => {
        if (!isoString) return "-";
        try {
            return new Date(isoString).toLocaleDateString("id-ID", {
                day: "numeric", month: "short", year: "numeric",
            });
        } catch { return "-"; }
    };

    const formatRupiah = (val) =>
        val != null ? `Rp ${Number(val).toLocaleString("id-ID")}` : "-";

    // Hitung total stok semua produk
    const totalStokKeseluruhan = data.reduce((acc, item) => {
        if (storeId) {
            // Gunakan toString() dan convert ke lowercase biar kalau ada beda tipe data tetep ketemu
            const storeStock = item.stockPerStore?.find(
                s => String(s.store.id).toLowerCase() === String(storeId).toLowerCase()
            );
            return acc + (storeStock ? storeStock.quantity : 0);
        }
        return acc + (item.totalStock ?? 0);
    }, 0);

    const maxCols = isEditable ? 8 : 7;

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">Kode Barang</th>
                <th className="p-3 border-l border-cardBG">Nama Barang</th>
                <th className="p-3 border-l border-cardBG">Tipe Barang</th>
                <th className="p-3 border-l border-cardBG">Total Stok</th>
                <th className="p-3 border-l border-cardBG">Harga Pokok</th>
                <th className="p-3 border-l border-cardBG">Harga Jual</th>
                <th className="p-3 border-l border-cardBG">Pembaruan Terakhir</th>
                {isEditable && <th className="p-3 border-x border-cardBG">Aksi</th>}
            </tr>
            </thead>
            <tbody className="text-black">
            {isLoading ? (
                <tr>
                    <td colSpan={maxCols} className="text-center py-10 text-txtNav font-medium">
                        <div className="flex items-center justify-center gap-3">
                            {/* Spinner Biru Tailwind Murni - Menggunakan utility border standar */}
                            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Menghubungkan ke server...</span>
                        </div>
                    </td>
                </tr>
            ) : data.length === 0 ? (
                <tr>
                    <td colSpan={maxCols} className="text-center py-10 text-txtNav">
                        Tidak ada data produk tersedia.
                    </td>
                </tr>
            ) : (
                data.map((item, index) => {
                    let displayStock = item.totalStock ?? 0;
                    if (storeId) {
                        const storeStock = item.stockPerStore?.find(
                            s => String(s.store.id).toLowerCase() === String(storeId).toLowerCase()
                        );
                        displayStock = storeStock ? storeStock.quantity : 0;
                    }

                    return (
                        <tr key={item.id || index}
                            className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                            {/* code → dari backend */}
                            <td className="p-3">{item.code ?? "-"}</td>
                            {/* name → dari backend */}
                            <td className="p-3 font-medium">{item.name ?? "-"}</td>
                            {/* type → dari backend */}
                            <td className="p-3">
                                {item.type ? (
                                    <span
                                        className="uppercase text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                            {item.type}
                                        </span>
                                ) : "-"}
                            </td>
                            {/* totalStock → dari backend */}
                            <td className="p-3 font-semibold text-green-700">
                                {item.totalStock ?? 0} {item.unit ?? "Kg"}
                            </td>
                            {/* basePrice → dari backend */}
                            <td className="p-3">{formatRupiah(item.basePrice)}</td>
                            {/* sellPrice → dari backend */}
                            <td className="p-3 font-medium text-green-600">{formatRupiah(item.sellPrice)}</td>
                            <td className="p-3">{formatDate(item.updatedAt)}</td>
                            {isEditable && (
                                <td className="p-3">
                                    <div className="flex justify-between items-center gap-1">
                                        <button type="button" onClick={() => onEdit(item)} className="text-pen">
                                            <HiOutlinePencilSquare
                                                className="size-7 p-1 border border-pen rounded-md hover:bg-yellow-50 transition"/>
                                        </button>
                                        <button type="button" onClick={() => onDelete(item)} className="text-trash">
                                            <PiTrashBold
                                                className="size-7 p-1 border border-trash rounded-md hover:bg-red-50 transition"/>
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    );
                })
            )}
            {!isLoading && data.length > 0 && (
                <tr className="font-inter font-bold text-lg border-b bg-gray-50/30">
                    <td className="px-3 py-6">Jumlah</td>
                    <td></td>
                    <td></td>
                    <td className="p-3 font-inter text-sm text-green-700">
                        {totalStokKeseluruhan} Kg
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    {isEditable && <td></td>}
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default TableAdmin;