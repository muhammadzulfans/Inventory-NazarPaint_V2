import React from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";
import { FiBarChart2 } from "react-icons/fi";

const TableAdmin = ({
                        data = [], onEdit, onDelete, onPreview, isLoading, isEditable = false, storeId, showBasePrice = true,
                        totalStokKg = 0, totalStokPcs = 0, hasKg = false, hasPcs = false
}) => {

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

    const getUnit = (item) => {
        const type = (item.type || "").toUpperCase();
        return (type === "ACCESSORIES" || type === "AKSESORIS") ? "Pcs" : "Kg";
    };

    const getDisplayStock = (item) => {
        if (storeId) {
            const storeStock = item.stockPerStore?.find(
                s => String(s.store.id).toLowerCase() === String(storeId).toLowerCase()
            );
            return storeStock ? storeStock.quantity : 0;
        }
        return item.totalStock ?? 0;
    };

    const showPreview = typeof onPreview === "function";
    const maxCols = 4 + (showBasePrice ? 1 : 0) + 2 + (showPreview ? 1 : 0) + (isEditable ? 1 : 0);

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">Kode Barang</th>
                <th className="p-3 border-l border-cardBG">Nama Barang</th>
                <th className="p-3 border-l border-cardBG">Tipe Barang</th>
                <th className="p-3 border-l border-cardBG">Total Stok</th>
                {showBasePrice && <th className="p-3 border-l border-cardBG">Harga Pokok</th>}
                <th className="p-3 border-l border-cardBG">Harga Jual</th>
                <th className="p-3 border-l border-cardBG">Pembaruan Terakhir</th>
                {showPreview && <th className="p-3 border-l border-cardBG">Prediksi</th>}
                {isEditable && <th className="p-3 border-x border-cardBG">Aksi</th>}
            </tr>
            </thead>
            <tbody className="text-black">
            {isLoading ? (
                <tr>
                    <td colSpan={maxCols} className="text-center py-10 text-txtNav font-medium">
                        <div className="flex items-center justify-center gap-3">
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
                    const displayStock = getDisplayStock(item);

                    return (
                        <tr key={item.id || index}
                            className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                            <td className="p-3">{item.code ?? "-"}</td>
                            <td className="p-3 font-medium">{item.name ?? "-"}</td>
                            <td className="p-3">
                                {item.type ? (
                                    <span
                                        className="uppercase text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                            {item.type}
                                        </span>
                                ) : "-"}
                            </td>
                            <td className="p-3 font-semibold text-green-700">
                                {displayStock} {getUnit(item)}
                            </td>
                            {showBasePrice && <td className="p-3">{formatRupiah(item.basePrice)}</td>}
                            <td className="p-3 font-medium text-green-600">{formatRupiah(item.sellPrice)}</td>
                            <td className="p-3">{formatDate(item.updatedAt)}</td>
                            {showPreview && (
                                <td className="p-3 text-center">
                                    <button
                                        type="button"
                                        onClick={() => onPreview(item)}
                                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition"
                                        title="Lihat prediksi stok & order"
                                    >
                                        <FiBarChart2 size={14} />
                                        Preview
                                    </button>
                                </td>
                            )}
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
                    <td className="p-3 font-inter text-sm text-black ">
                        {totalStokKg === 0 && totalStokPcs === 0 && "0"}
                        {totalStokKg > 0 && `${totalStokKg} Kg`}
                        {totalStokKg > 0 && totalStokPcs > 0 && " / "}
                        {totalStokPcs > 0 && `${totalStokPcs} Pcs`}
                    </td>
                    {showBasePrice && <td></td>}
                    <td></td>
                    <td></td>
                    {showPreview && <td></td>}
                    {isEditable && <td></td>}
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default TableAdmin;