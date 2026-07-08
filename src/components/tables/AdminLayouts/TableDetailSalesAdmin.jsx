import React from "react";

const TableDetailSalesAdmin = ({ data = [] }) => {
    const rows = data.map((item) => {
        // Logika penentuan unit satuan (Kg / Pcs) berdasarkan tipe barang
        const unitType = (item.type === "ACCESSORIES" || item.type === "AKSESORIS") ? "Pcs" : "Kg";

        // Rumus hitungan matematika sesuai instruksi ketentuan
        const totalHargaJual = item.hargaJual * item.quantity;
        const totalHargaBeli = item.hargaBeli * item.quantity;
        const totalKeuntungan = totalHargaJual - totalHargaBeli;

        return {
            idPenjualan: item.idPenjualan,
            kode: item.kode,
            type: item.type,
            namaBarang: item.namaBarang,
            quantity: item.quantity,
            unit: unitType,
            hargaJual: item.hargaJual,
            hargaBeli: item.hargaBeli,
            totalHarga: totalHargaJual,
            totalHargaBeli: totalHargaBeli,
            totalKeuntungan: totalKeuntungan,
            tanggal: item.tanggal
        };
    });

    // Hitung Grand Total Footer Kumulatif
    const grandTotalHargaJual = rows.reduce((sum, r) => sum + r.totalHarga, 0);
    const grandTotalHargaBeli = rows.reduce((sum, r) => sum + r.totalHargaBeli, 0);
    const grandTotalProfit = rows.reduce((sum, r) => sum + r.totalKeuntungan, 0);

    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG">ID Penjualan</th>
                <th className="p-3 border-l border-cardBG">Kode Barang</th>
                <th className="p-3 border-l border-cardBG">Tipe Barang</th>
                <th className="p-3 border-l border-cardBG">Nama Barang</th>
                <th className="p-3 border-l border-cardBG">Jumlah</th>
                <th className="p-3 border-l border-cardBG">Harga Jual</th>
                <th className="p-3 border-l border-cardBG">Harga Pokok</th>
                <th className="p-3 border-l border-cardBG">Total Harga Jual</th>
                <th className="p-3 border-l border-cardBG">Total Harga Pokok</th>
                <th className="p-3 border-l border-cardBG">Total Keuntungan</th>
                <th className="p-3 border-x border-cardBG">Tanggal Transaksi</th>
            </tr>
            </thead>
            <tbody className="text-black text-left">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={10} className="text-center py-10 text-gray-400">
                        Belum ada data detail transaksi
                    </td>
                </tr>
            ) : (
                rows.map((row, index) => (
                    <tr key={index} className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                        <td className="p-3 font-medium">{row.idPenjualan}</td>
                        <td className="p-3">{row.kode}</td>
                        <td className="p-3 text-left">
                            {row.type ? (
                                <span
                                    className="uppercase text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                    {row.type}
                                </span>
                            ) : "-"}
                        </td>
                        <td className="p-3 text-left">{row.namaBarang}</td>
                        <td className="p-3">{row.quantity} {row.unit}</td>
                        <td className="p-3 text-left">
                            {row.hargaJual.toLocaleString("id-ID") ? (
                                <span
                                    className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                           Rp. {row.hargaJual.toLocaleString("id-ID")}
                                </span>
                            ) : "-"}
                        </td>
                        {/*<td className="p-3">Rp {row.hargaJual.toLocaleString("id-ID")}</td>*/}
                        <td className="p-3 text-left">
                            {row.hargaBeli.toLocaleString("id-ID") ? (
                                <span
                                    className="text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                           Rp. {row.hargaBeli.toLocaleString("id-ID")}
                                </span>
                            ) : "-"}
                        </td>
                        {/*<td className="p-3">Rp {row.hargaBeli.toLocaleString("id-ID")}</td>*/}
                        <td className="p-3 text-left">
                            {row.totalHarga.toLocaleString("id-ID") ? (
                                <span
                                    className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                           Rp. {row.totalHarga.toLocaleString("id-ID")}
                                </span>
                            ) : "-"}
                        </td>
                        <td className="p-3 text-left">
                            {row.totalHargaBeli.toLocaleString("id-ID") ? (
                                <span
                                    className="text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                           Rp. {row.totalHargaBeli.toLocaleString("id-ID")}
                                </span>
                            ) : "-"}
                        </td>
                        <td className="p-3 text-left">
                            {row.totalKeuntungan.toLocaleString("id-ID") ? (
                                <span
                                    className="text-xs font-semibold bg-blue-200 px-2.5 py-1 rounded-md">
                                           Rp. {row.totalKeuntungan.toLocaleString("id-ID")}
                                </span>
                            ) : "-"}
                        </td>
                        {/*<td className="p-3 font-medium text-green-600">Rp {row.totalHarga.toLocaleString("id-ID")}</td>*/}
                        {/*<td className="p-3 text-gray-400">Rp {row.totalHargaBeli.toLocaleString("id-ID")}</td>*/}
                        {/*<td className="p-3 font-semibold text-blue-600">Rp {row.totalKeuntungan.toLocaleString("id-ID")}</td>*/}
                        <td className="p-3">{row.tanggal}</td>
                    </tr>
                ))
            )}
            {/* BARIS FOOTER TOTAL KESELURUHAN */}
            {rows.length > 0 && (
                <tr className="font-inter font-semibold text-base border-b bg-gray-50/30">
                    <td className="px-3 py-6 text-left" colSpan={3}>Total Keseluruhan</td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="p-3 text-green-600">Rp {grandTotalHargaJual.toLocaleString("id-ID")}</td>
                    <td className="p-3 text-black">Rp {grandTotalHargaBeli.toLocaleString("id-ID")}</td>
                    <td className="p-3 text-blue-600">Rp {grandTotalProfit.toLocaleString("id-ID")}</td>
                    <td></td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default TableDetailSalesAdmin;