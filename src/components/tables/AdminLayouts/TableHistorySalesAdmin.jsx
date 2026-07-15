import { HiOutlinePencilSquare, HiOutlineEye } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";
import React from "react";

const TableHistorySalesAdmin = ({
                                    data = [], onPreview, onEdit, onDelete,
                                    showDeleteAction = true,
                                    isEditAllowed, // function opsional: (rawPayload) => boolean
                                }) => {
    const rows = data.map((sale) => {
        const itemCount = sale.itemCount ?? (sale.items || []).length;
        const totalPriceInSale = (sale.items || []).reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);
        return {
            id: sale.orderNumber,
            customerName: sale.customerName || "-",
            itemCount,
            totalHarga: totalPriceInSale,
            tanggal: sale.date
                ? new Date(sale.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                : "-",
            rawPayload: sale
        };
    });

    const grandTotalItem = rows.reduce((t, r) => t + r.itemCount, 0);
    const grandTotalHarga = rows.reduce((t, r) => t + r.totalHarga, 0);

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">ID Penjualan</th>
                <th className="p-3 border-l border-cardBG">Nama Pelanggan</th>
                <th className="p-3 border-l border-cardBG">Jumlah Item</th>
                <th className="p-3 border-l border-cardBG">Total Harga</th>
                <th className="p-3 border-l border-cardBG">Tanggal</th>
                <th className="p-3 border-l border-cardBG">Preview</th>
                <th className="p-3 border-x border-cardBG">Aksi</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                        Belum ada transaksi
                    </td>
                </tr>
            ) : (
                rows.map((row, index) => {
                    // Default: selalu boleh edit (dipakai Admin). Karyawan kirim function pembatas.
                    const canEdit = isEditAllowed ? isEditAllowed(row.rawPayload) : true;

                    return (
                        <tr key={index} className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                            <td className="p-3 text-center font-medium">{row.id}</td>
                            <td className="p-3">{row.customerName}</td>
                            <td className="p-3 text-center">{row.itemCount} Item</td>
                            <td className="p-3 text-center">
                                {row.totalHarga.toLocaleString("id-ID") ? (
                                    <span className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                        Rp. {row.totalHarga.toLocaleString("id-ID")}
                                    </span>
                                ) : "-"}
                            </td>
                            <td className="p-3 text-center">{row.tanggal}</td>

                            <td className="p-3 text-center">
                                <button className="text-blue-500" onClick={() => onPreview && onPreview(row.rawPayload)}>
                                    <HiOutlineEye className="size-7 p-1 border border-blue-500 rounded-md hover:bg-blue-50 transition" />
                                </button>
                            </td>

                            <td className="p-3">
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        className={`text-pen ${canEdit ? "hover:bg-yellow-50" : "opacity-30 cursor-not-allowed"}`}
                                        onClick={() => canEdit && onEdit && onEdit(row.rawPayload)}
                                        disabled={!canEdit}
                                        title={!canEdit ? "Transaksi ini sudah lewat dari hari ini" : undefined}
                                    >
                                        <HiOutlinePencilSquare className="size-7 p-1 border border-pen rounded-md transition" />
                                    </button>
                                    {showDeleteAction && (
                                        <button className="text-trash" onClick={() => onDelete && onDelete(row.rawPayload)}>
                                            <PiTrashBold className="size-7 p-1 border border-trash rounded-md hover:bg-red-50 transition" />
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })
            )}
            <tr className="font-inter font-bold text-base border-b bg-gray-50/30 text-center">
                <td className="px-3 py-6 text-left" colSpan={2}>Total</td>
                <td className="p-3 font-inter">{grandTotalItem} Item</td>
                <td className="p-3 font-inter text-green-600">
                    Rp. {grandTotalHarga.toLocaleString("id-ID")}
                </td>
                <td></td><td></td><td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableHistorySalesAdmin;