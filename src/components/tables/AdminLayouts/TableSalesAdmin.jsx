import { HiOutlinePencilSquare, HiOutlineEye } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";

const TableSalesAdmin = ({ data = [], onPreview, onEdit, onDelete }) => {
    const rows = data.flatMap((sale) =>
        (sale.items || []).map((item) => ({
            saleId: sale.id,
            storeId: sale.storeId,
            storeName: sale.store?.name || "-",
            date: sale.date,
            productId: item.productId,
            kode: item.product?.code || "-",
            namaBarang: item.product?.name || "-",
            type: item.product?.type || "-",
            quantity: item.quantity ?? 0,
            sellPrice: item.sellPrice ?? 0,
            hargaTotal: item.totalPrice ?? 0,
            tanggal: sale.date
                ? new Date(sale.date).toLocaleDateString("id-ID", {
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
                <th className="p-3 border-l border-cardBG">Preview</th>
                <th className="p-3 border-x border-cardBG">Aksi</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {rows.length === 0 ? (
                <tr>
                    {/* colSpan diatur menjadi 9 karena total kolom sekarang ada 9 */}
                    <td colSpan={9} className="text-center py-10 text-gray-400">
                        Belum ada transaksi
                    </td>
                </tr>
            ) : (
                rows.map((item, index) => (
                    <tr key={index} className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                        <td className="p-3">{item.kode}</td>
                        <td className="p-3 font-medium">{item.namaBarang}</td>
                        <td className="p-3 text-center">
                            {item.type !== "-" && (
                                <span className="uppercase text-xs font-semibold bg-gray-100 px-2.5 py-1 rounded-md">
                                    {item.type}
                                </span>
                            )}
                        </td>
                        <td className="p-3 text-center">{item.quantity} Kg</td>
                        <td className="p-3 text-center">Rp. {item.sellPrice.toLocaleString("id-ID")}</td>
                        <td className="p-3 text-center font-medium text-green-600">
                            Rp. {item.hargaTotal.toLocaleString("id-ID")}
                        </td>
                        <td className="p-3 text-center">{item.tanggal}</td>

                        {/* KOLOM PREVIEW BARU */}
                        <td className="p-3 text-center">
                            <button className="text-blue-500" onClick={() => onPreview && onPreview(item)}>
                                <HiOutlineEye className="size-7 p-1 border border-blue-500 rounded-md hover:bg-blue-50 transition" />
                            </button>
                        </td>

                        <td className="p-3">
                            <div className="flex justify-center items-center gap-2">
                                <button className="text-pen" onClick={() => onEdit(item)}>
                                    <HiOutlinePencilSquare className="size-7 p-1 border border-pen rounded-md hover:bg-yellow-50 transition" />
                                </button>
                                <button className="text-trash" onClick={() => onDelete(item)}>
                                    <PiTrashBold className="size-7 p-1 border border-trash rounded-md hover:bg-red-50 transition" />
                                </button>
                            </div>
                        </td>
                    </tr>
                ))
            )}
            <tr className="font-inter font-bold text-lg border-b bg-gray-50/30 text-center">
                <td className="px-3 py-6 text-left">Jumlah</td>
                <td></td><td></td>
                <td className="p-3 font-inter text-sm">{totalQty} Kg</td>
                <td></td>
                <td className="p-3 font-inter text-sm text-green-600">
                    Rp. {totalHarga.toLocaleString("id-ID")}
                </td>
                {/* Tambahan 1 kolom kosong di footer agar sejajar (Tanggal, Preview, Aksi) */}
                <td></td><td></td><td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableSalesAdmin;