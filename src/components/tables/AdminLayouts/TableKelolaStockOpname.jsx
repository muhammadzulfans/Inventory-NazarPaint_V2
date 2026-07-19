import React from "react";

const getUnit = (type) => (type || "").toUpperCase() === "ACCESSORIES" ? "Pcs" : "Kg";

const TableKelolaStockOpname = ({ products, isLoading, rowData, onFieldChange, getSelisih }) => {
    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black text-center">
            <tr className="bg-card">
                <th className="p-3 border-l border-cardBG text-left">Kode</th>
                <th className="p-3 border-l border-cardBG text-left">Nama Barang</th>
                <th className="p-3 border-l border-cardBG">Tipe</th>
                <th className="p-3 border-l border-cardBG">Stok Sistem</th>
                <th className="p-3 border-l border-cardBG">Stok Fisik</th>
                <th className="p-3 border-l border-cardBG">Selisih</th>
                <th className="p-3 border-x border-cardBG text-left">Catatan</th>
            </tr>
            </thead>
            <tbody className="text-black">
            {isLoading ? (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-txtNav">
                        <div className="flex items-center justify-center gap-3">
                            <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <span>Memuat produk...</span>
                        </div>
                    </td>
                </tr>
            ) : products.length === 0 ? (
                <tr>
                    <td colSpan={7} className="text-center py-10 text-gray-400">
                        Pilih cabang toko untuk menampilkan daftar produk.
                    </td>
                </tr>
            ) : (
                products.map((p) => {
                    const selisih = getSelisih(p.id, p.stokSistem);
                    const isFilled = selisih !== null;

                    return (
                        <tr key={p.id} className="border-b border-cardBG hover:bg-gray-50/50 transition-colors">
                            <td className="p-3">{p.kode}</td>
                            <td className="p-3 font-medium">{p.namaBarang}</td>
                            <td className="p-3 text-center">
                                <span className="uppercase text-xs font-semibold bg-gray-200 px-2.5 py-1 rounded-md">
                                    {p.type}
                                </span>
                            </td>
                            <td className="p-3 text-center font-semibold">{p.stokSistem} {getUnit(p.type)}</td>
                            <td className="p-3 text-center">
                                <input
                                    type="number"
                                    min={0}
                                    value={rowData[p.id]?.stokFisik ?? ""}
                                    onChange={(e) => onFieldChange(p.id, "stokFisik", e.target.value)}
                                    placeholder="-"
                                    className="w-20 border rounded-lg px-2 py-1.5 text-center outline-none focus:ring-1 focus:ring-buttonBlue"
                                />
                            </td>
                            <td className="p-3 text-center">
                                {isFilled ? (
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                                        selisih === 0 ? "bg-gray-100 text-gray-600" :
                                            selisih > 0 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                                    }`}>
                                        {selisih > 0 ? "+" : ""}{selisih}
                                    </span>
                                ) : (
                                    <span className="text-gray-300">-</span>
                                )}
                            </td>
                            <td className="p-3">
                                <input
                                    type="text"
                                    value={rowData[p.id]?.catatan ?? ""}
                                    onChange={(e) => onFieldChange(p.id, "catatan", e.target.value)}
                                    placeholder={isFilled && selisih !== 0 ? "Wajib diisi (ada selisih)" : "Opsional"}
                                    className={`w-full border rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-1 focus:ring-buttonBlue ${
                                        isFilled && selisih !== 0 && !rowData[p.id]?.catatan ? "border-red-300" : ""
                                    }`}
                                />
                            </td>
                        </tr>
                    );
                })
            )}
            </tbody>
        </table>
    );
};

export default TableKelolaStockOpname;