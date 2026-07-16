import React from "react";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";

const TableAdmin = ({ data = [], onEdit, onDelete, isLoading, isEditable = false, storeId, showBasePrice = true }) => {
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

    // Satuan ditentukan dari tipe produk, bukan field unit
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

    const totalStokKg = data
        .filter((item) => getUnit(item) === "Kg")
        .reduce((acc, item) => acc + getDisplayStock(item), 0);
    const totalStokPcs = data
        .filter((item) => getUnit(item) === "Pcs")
        .reduce((acc, item) => acc + getDisplayStock(item), 0);
    const hasKg = data.some((item) => getUnit(item) === "Kg");
    const hasPcs = data.some((item) => getUnit(item) === "Pcs");

    const maxCols = 4 + (showBasePrice ? 1 : 0) + 2 + (isEditable ? 1 : 0);

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
                    <td className="flex flex-row justify-between  py-8 font-inter text-sm text-green-700">
                        {hasKg &&
                            <div>
                                {totalStokKg} Kg
                            </div>
                        }
                        {hasPcs &&
                            <div>
                                {totalStokPcs} Pcs
                            </div>}
                    </td>
                    {showBasePrice && <td></td>}
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