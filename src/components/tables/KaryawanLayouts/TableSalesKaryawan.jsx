import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";


const TableSalesKaryawan = ({ data }) => {
    const totalProduk = data.reduce(
        (total, item) => total + item.totalProduk,
        0
    );

    const hargaTotal = data.reduce(
        (total, item) => total + (item.totalProduk * item.hargaSatuan),
        0
    );


    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black">
            <tr className="bg-card">
                <th className="p-3 text-left border-l border-cardBG">Kode Barang</th>
                <th className="p-3 text-left border-l border-cardBG">Nama Barang</th>
                <th className="p-3 text-left border-l border-cardBG">Tipe Barang</th>
                <th className="p-3 text-left border-l border-cardBG">Total Produk</th>
                <th className="p-3 text-left border-l border-cardBG">Harga Satuan</th>
                <th className="p-3 text-left border-l border-cardBG">Harga Total</th>
                <th className="p-3 text-left border-l border-cardBG">Tanggal</th>
                <th className="p-3 text-left border-x border-cardBG">Aksi</th>
            </tr>
            </thead>

            <tbody className="text-black">
                {data.map((item, index) => {
                    const hargaPerRow = item.totalProduk * item.hargaSatuan;
                    return (
                        <tr key={index}>
                            <td className="p-3">{item.kode}</td>
                            <td className="p-3">{item.namaBarang}</td>
                            <td className="p-3">{item.type}</td>
                            <td className="p-3">{item.totalProduk} Kg</td>
                            <td className="p-3">Rp. {item.hargaSatuan.toLocaleString("id-ID")}</td>
                            <td className="p-3">Rp. {hargaPerRow.toLocaleString("id-ID")}</td>
                            <td className="p-3">{item.tanggal}</td>
                            <td className="flex justify-between p-3">
                                <button className="text-pen">
                                    <HiOutlinePencilSquare className="size-7 p-1 border border-pen rounded-md"/>
                                </button>
                                <button className="text-trash">
                                    <PiTrashBold className="size-7 p-1 border border-trash rounded-md"/>
                                </button>
                            </td>
                        </tr>
                    );
                })}


                {/* BARIS JUMLAH */}
                <tr className="font-inter font-bold text-lg border-b">
                    <td className="px-3 py-6">Jumlah</td>
                    <td></td>
                    <td></td>
                    <td className="p-3 font-inter text-sm ">{totalProduk} Kg</td>
                    <td></td>
                    <td className="p-3 font-inter text-sm">Rp. {hargaTotal.toLocaleString("id-ID")}</td>
                    <td></td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    );
};

export default TableSalesKaryawan;
