import { FiEdit, FiEye, FiXCircle } from "react-icons/fi";
import React from "react";

// Mapping label tampilan ? raw value backend TETAP PENDING/RECEIVED/CANCELLED
const STATUS_LABEL = {
    PENDING: "ORDER",
    RECEIVED: "RECEIVED",
    CANCELLED: "REJECTED",
};

const STATUS_BADGE_CLASS = {
    PENDING: "bg-yellow-100 text-yellow-700",
    RECEIVED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
};

const TableOrderAdmin = ({ data = [], onPreview, onEdit, onStatusChange, onReject }) => {
    const rows = data.map((order) => {
        const items = order.items || [];
        const totalPriceInOrder = items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);

        return {
            key: order.id || order.orderNumber || "-",
            id: order.orderNumber || "-",
            storeName: order.store?.name || "-",
            itemCount: items.length,
            totalHarga: totalPriceInOrder,
            status: order.status,
            tanggal: order.date
                ? new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                : "-",
            rawPayload: order
        };
    });

    const grandTotalItem = rows.reduce((t, r) => t + r.itemCount, 0);
    const grandTotalHarga = rows.reduce((t, r) => t + r.totalHarga, 0);

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">ID Pembelian</th>
                <th className="p-3 border-l border-cardBG">Nama Toko</th>
                <th className="p-3 border-l border-cardBG">Jumlah Item</th>
                <th className="p-3 border-l border-cardBG">Total Harga</th>
                <th className="p-3 border-l border-cardBG">Tanggal</th>
                <th className="p-3 border-l border-cardBG">Status</th>
                <th className="p-3 border-l border-cardBG">Preview</th>
                <th className="p-3 border-x border-cardBG">Aksi</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                        Belum ada transaksi pembelian
                    </td>
                </tr>
            ) : (
                rows.map((row) => {
                    const isPending = row.status === "PENDING";

                    return (
                        <tr key={row.key} className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                            <td className="p-3 font-medium text-center">{row.id}</td>
                            <td className="p-3">{row.storeName}</td>
                            <td className="p-3 text-center">{row.itemCount} Item</td>
                            <td className="p-3 text-center">
                                {row.totalHarga ? (
                                    <span className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                        Rp. {row.totalHarga.toLocaleString("id-ID")}
                                    </span>
                                ) : "-"}
                            </td>
                            <td className="p-3 text-center">{row.tanggal}</td>

                            {/* KOLOM STATUS */}
                            <td className="p-3 text-center">
                                {isPending ? (
                                    <button
                                        onClick={() => onStatusChange && onStatusChange(row.rawPayload)}
                                        className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md hover:opacity-80 transition-all cursor-pointer ${STATUS_BADGE_CLASS[row.status]}`}
                                        title="Klik untuk terima pesanan"
                                    >
                                        {STATUS_LABEL[row.status]}
                                    </button>
                                ) : (
                                    <span className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md ${STATUS_BADGE_CLASS[row.status]}`}>
                                        {STATUS_LABEL[row.status] || row.status}
                                    </span>
                                )}
                            </td>

                            {/* KOLOM PREVIEW */}
                            <td className="p-3 flex justify-center items-center">
                                <button className="text-blue-500" onClick={() => onPreview && onPreview(row.rawPayload)}>
                                    <FiEye className="size-7 p-1 border border-blue-500 rounded-md hover:bg-blue-50 transition" />
                                </button>
                            </td>

                            {/* KOLOM AKSI: Edit + Reject saja, Delete di-hide sementara */}
                            <td className="p-3">
                                <div className="flex justify-center items-center gap-2">
                                    <button
                                        className={`text-pen ${!isPending ? "opacity-30 cursor-not-allowed" : "hover:bg-yellow-50"}`}
                                        onClick={() => isPending && onEdit && onEdit(row.rawPayload)}
                                        disabled={!isPending}
                                        title={!isPending ? "Hanya bisa diedit saat status ORDER" : "Edit pesanan"}
                                    >
                                        <FiEdit className="size-7 p-1 border border-current rounded-md transition" />
                                    </button>
                                    <button
                                        className={`text-red-600 ${!isPending ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50"}`}
                                        onClick={() => isPending && onReject && onReject(row.rawPayload)}
                                        disabled={!isPending}
                                        title={!isPending ? "Hanya bisa ditolak saat status ORDER" : "Tolak/batalkan pesanan"}
                                    >
                                        <FiXCircle className="size-7 p-1 border border-current rounded-md transition" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })
            )}

            <tr className="font-inter font-bold text-base border-b bg-gray-50/30 text-center">
                <td className="p-5 text-center">Total</td>
                <td></td>
                <td className="p-3 font-inter">{grandTotalItem} Item</td>
                <td className="p-3 font-inter text-green-600">
                    Rp. {grandTotalHarga.toLocaleString("id-ID")}
                </td>
                <td></td><td></td><td></td><td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableOrderAdmin;