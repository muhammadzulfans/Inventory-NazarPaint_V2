import { HiOutlinePencilSquare, HiOutlineEye } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";
import React from "react";

const TableHistorySalesAdmin = ({ data = [], onPreview, onEdit, onDelete }) => {
    // Karena kolom sekarang berbasis per transaksi (bukan per item barang),
    // kita olah datanya langsung dari object parent 'sale'
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

    // Menghitung grand total untuk baris paling bawah (footer)
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
                    {/* total kolom sekarang ada 7 */}
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                        Belum ada transaksi
                    </td>
                </tr>
            ) : (
                rows.map((row, index) => (
                    <tr key={index} className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 text-center font-medium">{row.id}</td>
                        <td className="p-3">{row.customerName}</td>
                        <td className="p-3 text-center">{row.itemCount} Item</td>
                        <td className="p-3 text-center">
                            {row.totalHarga.toLocaleString("id-ID") ? (
                                <span
                                    className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                    Rp. {row.totalHarga.toLocaleString("id-ID")}
                                </span>
                            ) : "-"}
                        </td>
                        {/*<td className="p-3 text-center font-medium text-green-600">*/}
                        {/*    Rp. {row.totalHarga.toLocaleString("id-ID")}*/}
                        {/*</td>*/}
                        <td className="p-3 text-center">{row.tanggal}</td>

                        {/* KOLOM PREVIEW */}
                        <td className="p-3 flex justify-center items-center">
                            <button className="text-blue-500" onClick={() => onPreview && onPreview(row.rawPayload)}>
                                <HiOutlineEye className="size-7 p-1 border border-blue-500 rounded-md hover:bg-blue-50 transition" />
                            </button>
                        </td>

                        {/* KOLOM AKSI */}
                        <td className="p-3">
                            <div className="flex justify-center items-center gap-2">
                                <button className="text-pen" onClick={() => onEdit && onEdit(row.rawPayload)}>
                                    <HiOutlinePencilSquare className="size-7 p-1 border border-pen rounded-md hover:bg-yellow-50 transition" />
                                </button>
                                <button className="text-trash" onClick={() => onDelete && onDelete(row.rawPayload)}>
                                    <PiTrashBold className="size-7 p-1 border border-trash rounded-md hover:bg-red-50 transition" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
            )}
            {/* BARIS TOTAL FOOTER */}
            <tr className="font-inter font-bold text-base border-b bg-gray-50/30 text-center">
                <td className="p-5 text-center">Total</td>
                <td></td>
                <td className="p-3 font-inter ">{grandTotalItem} Item</td>
                <td className="p-3 font-inter text-green-600">
                    Rp. {grandTotalHarga.toLocaleString("id-ID")}
                </td>
                {/* Sisa kolom dikosongkan agar sejajar (Tgl Penjualan, Preview, Aksi) */}
                <td></td><td></td><td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableHistorySalesAdmin;