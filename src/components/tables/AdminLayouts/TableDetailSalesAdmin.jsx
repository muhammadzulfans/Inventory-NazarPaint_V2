import React from "react";

const TableDetailSalesAdmin = ({ data = [], showCostColumns = true }) => {
    const rows = data.map((item) => {
        const unitType = (item.type === "ACCESSORIES" || item.type === "AKSESORIS") ? "Pcs" : "Kg";
        const totalHargaJual = item.hargaJual * item.quantity;
        const totalHargaBeli = item.hargaBeli * item.quantity;
        const totalKeuntungan = totalHargaJual - totalHargaBeli;

        return {
            idPenjualan: item.idPenjualan, kode: item.kode, type: item.type,
            namaBarang: item.namaBarang, quantity: item.quantity, unit: unitType,
            hargaJual: item.hargaJual, hargaBeli: item.hargaBeli,
            totalHarga: totalHargaJual, totalHargaBeli, totalKeuntungan,
            tanggal: item.tanggal,
        };
    });

    const grandTotalHargaJual = rows.reduce((sum, r) => sum + r.totalHarga, 0);
    const grandTotalHargaBeli = rows.reduce((sum, r) => sum + r.totalHargaBeli, 0);
    const grandTotalProfit = rows.reduce((sum, r) => sum + r.totalKeuntungan, 0);

    const colCount = showCostColumns ? 10 : 7;

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
                {showCostColumns && <th className="p-3 border-l border-cardBG">Harga Pokok</th>}
                <th className="p-3 border-l border-cardBG">Total Harga Jual</th>
                {showCostColumns && <th className="p-3 border-l border-cardBG">Total Harga Pokok</th>}
                {showCostColumns && <th className="p-3 border-l border-cardBG">Total Keuntungan</th>}
                <th className="p-3 border-x border-cardBG">Tanggal</th>
            </tr>
            </thead>
            <tbody className="text-black text-left">
            {rows.length === 0 ? (
                <tr>
                    <td colSpan={colCount} className="text-center py-10 text-gray-400">
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
                                <span className="uppercase text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                    {row.type}
                                </span>
                            ) : "-"}
                        </td>
                        <td className="p-3 text-left">{row.namaBarang}</td>
                        <td className="p-3">{row.quantity} {row.unit}</td>
                        <td className="p-3 text-left">
                            <span className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                Rp. {row.hargaJual.toLocaleString("id-ID")}
                            </span>
                        </td>
                        {showCostColumns && (
                            <td className="p-3 text-left">
                                <span className="text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                    Rp. {row.hargaBeli.toLocaleString("id-ID")}
                                </span>
                            </td>
                        )}
                        <td className="p-3 text-left">
                            <span className="text-xs font-semibold bg-green-100 px-2.5 py-1 rounded-md">
                                Rp. {row.totalHarga.toLocaleString("id-ID")}
                            </span>
                        </td>
                        {showCostColumns && (
                            <td className="p-3 text-left">
                                <span className="text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                    Rp. {row.totalHargaBeli.toLocaleString("id-ID")}
                                </span>
                            </td>
                        )}
                        {showCostColumns && (
                            <td className="p-3 text-left">
                                <span className="text-xs font-semibold bg-blue-200 px-2.5 py-1 rounded-md">
                                    Rp. {row.totalKeuntungan.toLocaleString("id-ID")}
                                </span>
                            </td>
                        )}
                        <td className="p-3">{row.tanggal}</td>
                    </tr>
                ))
            )}
            {rows.length > 0 && (
                <tr className="font-inter font-semibold text-base border-b bg-gray-50/30">
                    <td className="px-3 py-6 text-left" colSpan={3}>Total Keseluruhan</td>
                    <td></td><td></td>
                    {showCostColumns && <td></td>}
                    <td className="p-3 text-green-600">Rp {grandTotalHargaJual.toLocaleString("id-ID")}</td>
                    {showCostColumns && <td className="p-3 text-black">Rp {grandTotalHargaBeli.toLocaleString("id-ID")}</td>}
                    {showCostColumns && <td className="p-3 text-blue-600">Rp {grandTotalProfit.toLocaleString("id-ID")}</td>}
                    <td></td>
                </tr>
            )}
            </tbody>
        </table>
    );
};

export default TableDetailSalesAdmin;