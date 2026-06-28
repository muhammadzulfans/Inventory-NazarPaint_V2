import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";

const TableMutasi = ({ data = [], onEdit, onDelete }) => {
    const rows = data.flatMap((mutasi) =>
        (mutasi.items || []).map((item, itemIndex) => ({
            mutasiId: mutasi.id,
            mutasiRaw: mutasi, // data lengkap untuk pre-fill form edit
            cabangPengirim: mutasi.fromStore?.name || "-",
            cabangPenerima: mutasi.toStore?.name || "-",
            fromStoreId: mutasi.fromStoreId,
            toStoreId: mutasi.toStoreId,
            note: mutasi.note || "",
            tanggal: mutasi.date,
            tanggalDisplay: mutasi.date
                ? new Date(mutasi.date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                })
                : "-",
            kode: item.product?.code || "-",
            namaBarang: item.product?.name || "-",
            type: item.product?.type || "-",
            quantity: item.quantity ?? 0,
            unit: item.product?.unit || "Kg",
            isFirst: itemIndex === 0,
        }))
    );

    const totalQty = rows.reduce((t, r) => t + r.quantity, 0);

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">Kode Barang</th>
                <th className="p-3 border-l border-cardBG">Nama Barang</th>
                <th className="p-3 border-l border-cardBG">Tipe Barang</th>
                <th className="p-3 border-l border-cardBG">Total Produk</th>
                <th className="p-3 border-l border-cardBG">Cabang Pengirim</th>
                <th className="p-3 border-l border-cardBG">Cabang Penerima</th>
                <th className="p-3 border-l border-cardBG">Tanggal</th>
                <th className="p-3 border-x border-cardBG">Aksi</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                        Belum ada data mutasi
                    </td>
                </tr>
            ) : (
                rows.map((item, index) => (
                    <tr
                        key={`${item.mutasiId}-${index}`}
                        className={`border-b border-cardBG hover:bg-gray-50/50 transition-colors ${item.isFirst && index !== 0 ? "border-t-2 border-t-gray-200" : ""}`}
                    >
                        <td className="p-3">{item.kode}</td>
                        <td className="p-3 font-medium">{item.namaBarang}</td>
                        <td className="p-3">
                            {item.type !== "-" && (
                                <span className="uppercase text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                                        {item.type}
                                    </span>
                            )}
                        </td>
                        <td className="p-3">{item.quantity} {item.unit}</td>
                        <td className="p-3">{item.cabangPengirim}</td>
                        <td className="p-3">{item.cabangPenerima}</td>
                        <td className="p-3">{item.tanggalDisplay}</td>
                        <td className="p-3">
                            {/* Edit & Delete hanya di baris pertama tiap mutasi */}
                            {item.isFirst ? (
                                <div className="flex justify-between items-center gap-1">
                                    <button
                                        className="text-pen"
                                        onClick={() => onEdit(item.mutasiRaw)}
                                    >
                                        <HiOutlinePencilSquare className="size-7 p-1 border border-pen rounded-md hover:bg-yellow-50 transition" />
                                    </button>
                                    <button
                                        className="text-trash"
                                        onClick={() => onDelete({
                                            id: item.mutasiId,
                                            label: `${item.cabangPengirim} → ${item.cabangPenerima}`
                                        })}
                                    >
                                        <PiTrashBold className="size-7 p-1 border border-trash rounded-md hover:bg-red-50 transition" />
                                    </button>
                                </div>
                            ) : (
                                <span className="text-gray-300 text-xs">—</span>
                            )}
                        </td>
                    </tr>
                ))
            )}
            <tr className="font-inter font-bold text-lg border-b bg-gray-50/30">
                <td className="px-3 py-6">Jumlah</td>
                <td></td><td></td>
                <td className="p-3 font-inter text-sm">{totalQty} Kg</td>
                <td></td><td></td><td></td><td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableMutasi;