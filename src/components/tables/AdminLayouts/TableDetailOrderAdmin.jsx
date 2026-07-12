import React, { useState } from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi2";

const TableDetailOrderAdmin = ({ data = [] }) => {
    const [expandedIds, setExpandedIds] = useState(new Set());

    const toggleExpand = (key) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(key) ? next.delete(key) : next.add(key);
            return next;
        });
    };

    // Grouping per transaksi (order), bukan lagi flatten per item
    const rows = data.map((order) => {
        const items = order.items || [];

        const processedItems = items.map((item) => {
            const product = item.product || {};
            const itemType = product.type || item.type || "-";
            const unitType = (itemType === "ACCESSORIES" || itemType === "AKSESORIS") ? "Pcs" : "Kg";
            const hargaSatuan = item.basePrice || item.hargaSatuan || item.hargaBeli || 0;
            const totalHarga = item.totalPrice || (hargaSatuan * (item.quantity || 0));

            return {
                kode: product.code || item.kode || "-",
                type: itemType,
                namaBarang: product.name || item.namaBarang || "-",
                quantity: item.quantity || 0,
                unit: unitType,
                hargaSatuan,
                totalHarga,
            };
        });

        const totalHargaOrder = processedItems.reduce((sum, it) => sum + it.totalHarga, 0);

        return {
            key: order.id || order.orderNumber || "-",
            idPembelian: order.orderNumber || "-",
            tanggal: order.date
                ? new Date(order.date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
                : "-",
            status: order.status || "RECEIVED",
            totalHargaOrder,
            items: processedItems,
        };
    });

    const grandTotalHarga = rows.reduce((sum, r) => sum + r.totalHargaOrder, 0);

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">ID Pembelian</th>
                <th className="p-3 border-l border-cardBG">Jumlah Item</th>
                <th className="p-3 border-l border-cardBG">Total Harga</th>
                <th className="p-3 border-l border-cardBG">Tanggal</th>
                <th className="p-3 border-x border-cardBG">Status</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={5} className="text-center py-10 text-gray-400">
                        Belum ada data pembelian yang diterima
                    </td>
                </tr>
            ) : (
                rows.map((row) => {
                    const isExpandable = row.items.length > 1;
                    const isExpanded = expandedIds.has(row.key);

                    return (
                        <React.Fragment key={row.key}>
                            <tr className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                                <td className="p-3 font-medium">
                                    <div className="flex items-center justify-center gap-2">
                                        {isExpandable ? (
                                            <button
                                                onClick={() => toggleExpand(row.key)}
                                                className="text-gray-500 hover:text-black transition-colors shrink-0"
                                            >
                                                {isExpanded ? <HiChevronDown size={18} /> : <HiChevronRight size={18} />}
                                            </button>
                                        ) : (
                                            <span className="w-[18px] shrink-0" />
                                        )}
                                        <span>{row.idPembelian}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">{row.items.length} Item</td>
                                <td className="p-3 text-center">
                                    {row.totalHargaOrder ? (
                                        <span className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                            Rp. {row.totalHargaOrder.toLocaleString("id-ID")}
                                        </span>
                                    ) : "-"}
                                </td>
                                <td className="p-3 text-center">{row.tanggal}</td>
                                <td className="p-3 text-center">
                                    <span className="uppercase text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-md">
                                        {row.status}
                                    </span>
                                </td>
                            </tr>

                            {isExpanded && (
                                <tr>
                                    <td colSpan={5} className="p-0 bg-gray-50/60">
                                        <table className="w-full text-xs font-inter">
                                            <thead className="text-gray-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="pl-14 py-2 text-left font-semibold">Kode</th>
                                                <th className="py-2 text-center font-semibold">Tipe</th>
                                                <th className="py-2 text-left font-semibold">Nama Barang</th>
                                                <th className="py-2 text-center font-semibold">Jumlah</th>
                                                <th className="py-2 text-center font-semibold">Harga Satuan</th>
                                                <th className="py-2 text-center font-semibold pr-6">Total Harga</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {row.items.map((item, idx) => (
                                                <tr key={idx} className="border-t border-gray-100">
                                                    <td className="pl-14 py-2.5">{item.kode}</td>
                                                    <td className="py-2.5 text-center">
                                                        {item.type !== "-" ? (
                                                            <span className="uppercase text-[10px] font-semibold bg-gray-200 px-2 py-0.5 rounded-md">
                                                                {item.type}
                                                            </span>
                                                        ) : "-"}
                                                    </td>
                                                    <td className="py-2.5 font-semibold text-black">{item.namaBarang}</td>
                                                    <td className="py-2.5 text-center">{item.quantity} {item.unit}</td>
                                                    <td className="py-2.5 text-center">
                                                        {item.hargaSatuan ? (
                                                            <span className="text-[11px] font-semibold bg-gray-200 px-2 py-0.5 rounded-md">
                                                                Rp. {item.hargaSatuan.toLocaleString("id-ID")}
                                                            </span>
                                                        ) : "-"}
                                                    </td>
                                                    <td className="py-2.5 text-center pr-6">
                                                        {item.totalHarga ? (
                                                            <span className="text-[11px] font-semibold bg-green-100 px-2 py-0.5 rounded-md">
                                                                Rp. {item.totalHarga.toLocaleString("id-ID")}
                                                            </span>
                                                        ) : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })
            )}

            {rows.length > 0 && (
                <tr className="font-inter font-semibold text-base border-b bg-gray-50/30">
                    <td className="px-3 py-6 text-left" colSpan={2}>Total Keseluruhan</td>
                    <td className="p-3 text-green-600 text-center">Rp {grandTotalHarga.toLocaleString("id-ID")}</td>
                    <td></td>
                    <td></td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default TableDetailOrderAdmin;