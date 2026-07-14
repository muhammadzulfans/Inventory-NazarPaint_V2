import React, { useState } from "react";
import { HiChevronDown, HiChevronRight, HiOutlinePencilSquare } from "react-icons/hi2";
import { FiEye } from "react-icons/fi";

const formatDate = (isoString) => {
    if (!isoString) return "-";
    try {
        return new Date(isoString).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch { return "-"; }
};

const TableStockOpnameAdmin = ({ data = [], onPreview, onEdit }) => {
    const [expandedIds, setExpandedIds] = useState(new Set());

    const toggleExpand = (id) => {
        setExpandedIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const rows = data.map((opname) => {
        const items = opname.items || [];
        const totalSelisih = items.reduce((sum, it) => sum + (it.stokFisik - it.stokSistem), 0);
        return { ...opname, itemCount: items.length, totalSelisih };
    });

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG text-left">ID Opname</th>
                <th className="p-3 border-l border-cardBG">Cabang</th>
                <th className="p-3 border-l border-cardBG">Jumlah Item</th>
                <th className="p-3 border-l border-cardBG">Total Selisih</th>
                <th className="p-3 border-l border-cardBG">Tanggal</th>
                <th className="p-3 border-x border-cardBG">Status</th>
                <th className="p-3 border-x border-cardBG">Preview</th>
                <th className="p-3 border-x border-cardBG">Aksi</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                        Belum ada data stock opname
                    </td>
                </tr>
            ) : (
                rows.map((row) => {
                    const isExpandable = row.items.length;
                    const isExpanded = expandedIds.has(row.id);
                    const isFinished = row.status === "SELESAI";

                    return (
                        <React.Fragment key={row.id}>
                            <tr className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                                <td className="p-3 font-medium">
                                    <div className="flex items-center gap-2">
                                        {isExpandable ? (
                                            <button onClick={() => toggleExpand(row.id)} className="text-gray-500 hover:text-black transition-colors shrink-0">
                                                {isExpanded ? <HiChevronDown size={18} /> : <HiChevronRight size={18} />}
                                            </button>
                                        ) : (
                                            <span className="w-[18px] shrink-0" />
                                        )}
                                        <span>{row.id}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-center">{row.storeName}</td>
                                <td className="p-3 text-center">{row.itemCount} Item</td>
                                <td className="p-3 text-center">
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                        row.totalSelisih === 0 ? "bg-gray-100 text-gray-600" :
                                            row.totalSelisih > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                    }`}>
                                        {row.totalSelisih > 0 ? "+" : ""}{row.totalSelisih} Kg
                                    </span>
                                </td>
                                <td className="p-3 text-center">{formatDate(row.tanggal)}</td>
                                <td className="p-3 text-center">
                                    <span className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md ${
                                        isFinished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                                    }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="p-3 text-center">
                                    <button className="text-blue-500" onClick={() => onPreview && onPreview(row)}>
                                        <FiEye className="size-7 p-1 border border-blue-500 rounded-md hover:bg-blue-50 transition" />
                                    </button>
                                </td>
                                <td className="p-3 text-center">
                                    <button
                                        className={`text-pen ${isFinished ? "opacity-30 cursor-not-allowed" : "hover:bg-yellow-50"}`}
                                        onClick={() => !isFinished && onEdit && onEdit(row)}
                                        disabled={isFinished}
                                    >
                                        <HiOutlinePencilSquare className="size-7 p-1 border border-current rounded-md transition" />
                                    </button>
                                </td>
                            </tr>

                            {isExpanded && (
                                <tr>
                                    <td colSpan={8} className="p-0 bg-gray-50/60">
                                        <table className="w-full text-xs font-inter">
                                            <thead className="text-gray-400 uppercase tracking-wider">
                                            <tr>
                                                <th className="pl-14 py-2 text-left font-semibold">Produk</th>
                                                <th className="py-2 text-center font-semibold">Stok Sistem</th>
                                                <th className="py-2 text-center font-semibold">Stok Fisik</th>
                                                <th className="py-2 text-center font-semibold">Selisih</th>
                                                <th className="py-2 text-left font-semibold pr-6">Catatan</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {row.items.map((item, idx) => {
                                                const selisih = item.stokFisik - item.stokSistem;
                                                return (
                                                    <tr key={idx} className="border-t border-gray-100">
                                                        <td className="pl-14 py-2.5">
                                                            <p className="font-semibold text-black">{item.namaBarang}</p>
                                                            <p className="text-gray-400">{item.kode} · {item.type}</p>
                                                        </td>
                                                        <td className="py-2.5 text-center">{item.stokSistem} {item.unit}</td>
                                                        <td className="py-2.5 text-center">{item.stokFisik} {item.unit}</td>
                                                        <td className="py-2.5 text-center">
                                                            <span className={`font-semibold px-2 py-0.5 rounded-md ${
                                                                selisih === 0 ? "bg-gray-100 text-gray-600" :
                                                                    selisih > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                                            }`}>
                                                                {selisih > 0 ? "+" : ""}{selisih}
                                                            </span>
                                                        </td>
                                                        <td className="py-2.5 pr-6 text-gray-500">{item.catatan || "-"}</td>
                                                    </tr>
                                                );
                                            })}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    );
                })
            )}
            </tbody>
        </table>
    );
};

export default TableStockOpnameAdmin;