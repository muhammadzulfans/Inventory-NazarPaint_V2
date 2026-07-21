import { FiEdit, FiEye, FiCheck, FiX } from "react-icons/fi";
import React, { useState, useRef, useEffect } from "react";

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

const TableOrderAdmin = ({ data = [], onPreview, onEdit, onStatusChange, onReject, totalItem = 0, totalHarga = 0 }) => {
    // Key row yang popup pilihan status-nya lagi kebuka (cuma 1 yang bisa kebuka sekaligus)
    const [openPopupKey, setOpenPopupKey] = useState(null);
    const popupRef = useRef(null);

    // Klik di luar popup otomatis nutup
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setOpenPopupKey(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    const isPopupOpen = openPopupKey === row.key;

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

                            <td className="p-3 text-center relative">
                                {isPending ? (
                                    <>
                                        <button
                                            onClick={() => setOpenPopupKey(isPopupOpen ? null : row.key)}
                                            className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md hover:opacity-80 transition-all cursor-pointer ${STATUS_BADGE_CLASS[row.status]}`}
                                            title="Klik untuk ubah status"
                                        >
                                            {STATUS_LABEL[row.status]}
                                        </button>

                                        {isPopupOpen && (
                                            <div
                                                ref={popupRef}
                                                className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-40"
                                            >
                                                <button
                                                    onClick={() => {
                                                        setOpenPopupKey(null);
                                                        onStatusChange && onStatusChange(row.rawPayload);
                                                    }}
                                                    className="w-full text-left px-3 py-2.5 text-xs font-semibold text-green-700 hover:bg-green-50 flex items-center gap-2 transition"
                                                >
                                                    <FiCheck size={14} /> RECEIVED
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setOpenPopupKey(null);
                                                        onReject && onReject(row.rawPayload);
                                                    }}
                                                    className="w-full text-left px-3 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-100 transition"
                                                >
                                                    <FiX size={14} /> REJECTED
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <span className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md ${STATUS_BADGE_CLASS[row.status]}`}>
                                        {STATUS_LABEL[row.status] || row.status}
                                    </span>
                                )}
                            </td>

                            <td className="p-3 flex justify-center items-center">
                                <button className="text-blue-500" onClick={() => onPreview && onPreview(row.rawPayload)}>
                                    <FiEye className="size-7 p-1 border border-blue-500 rounded-md hover:bg-blue-50 transition" />
                                </button>
                            </td>

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
                                </div>
                            </td>
                        </tr>
                    );
                })
            )}

            <tr className="font-inter font-bold text-base border-b bg-gray-50/30 text-center">
                <td className="p-5 text-center">Total</td>
                <td></td>
                <td className="p-3 font-inter">{totalItem} Item</td>
                <td className="p-3 font-inter text-green-600">
                    Rp. {totalHarga.toLocaleString("id-ID")}
                </td>
                <td></td><td></td><td></td><td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableOrderAdmin;