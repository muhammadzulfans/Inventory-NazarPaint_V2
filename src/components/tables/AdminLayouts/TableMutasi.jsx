import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";

const STATUS_LABEL = {
    PENDING: "PENDING",
    ON_GOING: "ON GOING",
    RECEIVED: "RECEIVED",
};

const STATUS_BADGE_CLASS = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ON_GOING: "bg-blue-100 text-blue-700",
    RECEIVED: "bg-green-100 text-green-700",
};

const STATUS_ACTION_TITLE = {
    PENDING: "Klik untuk kirim barang",
    ON_GOING: "Klik untuk konfirmasi barang diterima",
};

// data yang masuk ke sini SUDAH flattened per-item & sudah di-paginate oleh hook
// totalKg/totalPcs dihitung dari SELURUH data (bukan per halaman), diteruskan dari hook
const TableMutasi = ({ data = [], onEdit, onDelete, onStatusChange, showActions = true, canChangeStatus, totalKg = 0, totalPcs = 0 }) => {
    const rows = data;

    const colCount = 7 + 1 + (showActions ? 1 : 0);

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
                <th className="p-3 border-l border-cardBG">Status</th>
                {showActions && <th className="p-3 border-x border-cardBG">Aksi</th>}
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={colCount} className="text-center py-10 text-gray-400">
                        Belum ada data mutasi
                    </td>
                </tr>
            ) : (
                rows.map((item, index) => {
                    const allowedToChange = item.isFirst && item.status !== "RECEIVED" && canChangeStatus && canChangeStatus(item.mutasiRaw);

                    return (
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
                            <td className="p-3 text-center">
                                {item.isFirst ? (
                                    allowedToChange ? (
                                        <button
                                            onClick={() => onStatusChange && onStatusChange(item.mutasiRaw)}
                                            className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md hover:opacity-80 transition-all cursor-pointer ${STATUS_BADGE_CLASS[item.status]}`}
                                            title={STATUS_ACTION_TITLE[item.status]}
                                        >
                                            {STATUS_LABEL[item.status]}
                                        </button>
                                    ) : (
                                        <span className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md ${STATUS_BADGE_CLASS[item.status]}`}>
                                            {STATUS_LABEL[item.status]}
                                        </span>
                                    )
                                ) : (
                                    <span className="text-gray-300 text-xs">-</span>
                                )}
                            </td>
                            {showActions && (
                                <td className="p-3">
                                    {item.isFirst ? (
                                        <div className="flex justify-between items-center gap-1">
                                            <button
                                                className={`text-pen ${item.status !== "PENDING" ? "opacity-30 cursor-not-allowed" : "hover:bg-yellow-50"}`}
                                                onClick={() => item.status === "PENDING" && onEdit(item.mutasiRaw)}
                                                disabled={item.status !== "PENDING"}
                                                title={item.status !== "PENDING" ? "Hanya bisa diedit saat PENDING" : undefined}
                                            >
                                                <HiOutlinePencilSquare className="size-7 p-1 border border-current rounded-md transition" />
                                            </button>
                                            <button
                                                className={`text-trash ${item.status !== "PENDING" ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50"}`}
                                                onClick={() => item.status === "PENDING" && onDelete({
                                                    id: item.mutasiId,
                                                    label: `${item.cabangPengirim} ? ${item.cabangPenerima}`
                                                })}
                                                disabled={item.status !== "PENDING"}
                                                title={item.status !== "PENDING" ? "Hanya bisa dihapus saat PENDING" : undefined}
                                            >
                                                <PiTrashBold className="size-7 p-1 border border-current rounded-md transition" />
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="text-gray-300 text-xs">-</span>
                                    )}
                                </td>
                            )}
                        </tr>
                    );
                })
            )}
            <tr className="font-inter font-bold text-lg border-b bg-gray-50/30">
                <td className="px-3 py-6">Jumlah</td>
                <td></td><td></td>
                <td className="p-3 font-inter text-sm">
                    {totalKg === 0 && totalPcs === 0 && "0"}
                    {totalKg > 0 && `${totalKg} Kg`}
                    {totalKg > 0 && totalPcs > 0 && " / "}
                    {totalPcs > 0 && `${totalPcs} Pcs`}
                </td>
                <td></td><td></td><td></td><td></td>
                {showActions && <td></td>}
            </tr>
            </tbody>
        </table>
    );
};

export default TableMutasi;