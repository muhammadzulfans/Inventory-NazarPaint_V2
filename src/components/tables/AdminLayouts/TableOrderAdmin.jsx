import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";

const TableOrderAdmin = ({ data = [], onEdit, onDelete, onStatusChange }) => {
    // Flatten data langsung di table, plek ketiplek kayak TableHistorySalesAdmin
    const rows = data.flatMap((order) =>
        (order.items || []).map((item) => ({
            purchaseId: order.id,
            storeId: order.storeId,
            storeName: order.store?.name || "-",
            date: order.date,
            productId: item.productId,
            kode: item.product?.code || "-",
            namaBarang: item.product?.name || "-",
            type: item.product?.type || "-",
            quantity: item.quantity ?? 0,
            basePrice: item.basePrice ?? 0,
            hargaTotal: item.totalPrice ?? 0,
            status: order.status,
            tanggal: order.date
                ? new Date(order.date).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                })
                : "-",
        }))
    );

    const totalQty = rows.reduce((t, r) => t + r.quantity, 0);
    const totalHarga = rows.reduce((t, r) => t + r.hargaTotal, 0);

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">Kode Barang</th>
                <th className="p-3 border-l border-cardBG">Nama Barang</th>
                <th className="p-3 border-l border-cardBG">Tipe Barang</th>
                <th className="p-3 border-l border-cardBG">Total Produk</th>
                <th className="p-3 border-l border-cardBG">Harga Satuan</th>
                <th className="p-3 border-l border-cardBG">Harga Total</th>
                <th className="p-3 border-l border-cardBG">Tanggal</th>
                <th className="p-3 border-x border-cardBG">Status</th>
                <th className="p-3 border-x border-cardBG">Aksi</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={9} className="text-center py-10 text-gray-400">
                        Belum ada transaksi pembelian
                    </td>
                </tr>
            ) : (
                rows.map((item, index) => (
                    <tr key={index} className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                        <td className="p-3">{item.kode}</td>
                        <td className="p-3 font-medium">{item.namaBarang}</td>
                        <td className="p-3">
                            {item.type !== "-" && (
                                <span className="uppercase text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                                    {item.type}
                                </span>
                            )}
                        </td>
                        <td className="p-3">{item.quantity} Kg</td>
                        <td className="p-3">Rp. {item.basePrice.toLocaleString("id-ID")}</td>
                        <td className="p-3 font-medium text-green-600">
                            Rp. {item.hargaTotal.toLocaleString("id-ID")}
                        </td>
                        <td className="p-3">{item.tanggal}</td>
                        <td className="p-3 text-center">
                            {item.status === "PENDING" ? (
                                <button
                                    onClick={() => onStatusChange(item)}
                                    className="uppercase text-xs font-semibold bg-yellow-100 text-yellow-700 px-3 py-1.5 rounded-md hover:bg-yellow-200 transition-all cursor-pointer"
                                    title="Klik untuk terima pesanan"
                                >
                                    {item.status}
                                </button>
                            ) : (
                                <span className="uppercase text-xs font-semibold bg-green-100 text-green-700 px-3 py-1.5 rounded-md">
                                    {item.status}
                                </span>
                            )}
                        </td>
                        <td className="p-3">
                            <div className="flex justify-between items-center gap-1">
                                <button
                                    className={`text-pen ${item.status === "RECEIVED" ? "opacity-30 cursor-not-allowed" : "hover:bg-yellow-50"}`}
                                    onClick={() => item.status === "PENDING" && onEdit(item)}
                                    disabled={item.status === "RECEIVED"}
                                >
                                    <HiOutlinePencilSquare className="size-7 p-1 border border-current rounded-md transition" />
                                </button>
                                <button
                                    className={`text-trash ${item.status === "RECEIVED" ? "opacity-30 cursor-not-allowed" : "hover:bg-red-50"}`}
                                    onClick={() => item.status === "PENDING" && onDelete(item)}
                                    disabled={item.status === "RECEIVED"}
                                >
                                    <PiTrashBold className="size-7 p-1 border border-current rounded-md transition" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
            )}
            <tr className="font-inter font-bold text-lg border-b bg-gray-50/30">
                <td className="px-3 py-6">Jumlah</td>
                <td></td><td></td>
                <td className="p-3 font-inter text-sm">{totalQty} Kg</td>
                <td></td>
                <td className="p-3 font-inter text-sm text-green-600">
                    Rp. {totalHarga.toLocaleString("id-ID")}
                </td>
                <td></td><td></td><td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableOrderAdmin;