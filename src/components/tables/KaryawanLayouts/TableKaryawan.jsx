import { HiOutlinePencilSquare } from "react-icons/hi2";
import { PiTrashBold } from "react-icons/pi";

const TableKaryawan = ({ data }) => {
    const toNumber = (val) => {
        if (!val) return 0;
        return Number(String(val).replace(/[^\d]/g, ""));
    };

    const totalOrder  = data.reduce((a, b) => a + toNumber(b.stokOrder), 0);
    const totalKeluar = data.reduce((a, b) => a + toNumber(b.stokKeluar), 0);
    const mutasiMasuk  = data.reduce((a, b) => a + toNumber(b.mutasiMasuk), 0);
    const mutasiKeluar  = data.reduce((a, b) => a + toNumber(b.mutasiKeluar), 0);
    const totalStok   = data.reduce((a, b) => a + toNumber(b.totalStok), 0);


    return (
        <table className="w-full text-sm font-inter font-normal">
            <thead className="text-black">
            <tr className="bg-card">
                <th className="p-3 text-left border-l border-cardBG">Kode Barang</th>
                <th className="p-3 text-left border-l border-cardBG">Nama Barang</th>
                <th className="p-3 text-left border-l border-cardBG">Tipe Barang</th>
                <th className="p-3 text-left border-l border-cardBG">Stok Belanja</th>
                <th className="p-3 text-left border-l border-cardBG">Stok Keluar</th>
                <th className="p-3 text-left border-l border-cardBG">Mutasi Masuk</th>
                <th className="p-3 text-left border-l border-cardBG">Mutasi Keluar</th>
                <th className="p-3 text-left border-l border-cardBG">Total Stok</th>
                <th className="p-3 text-left border-l border-cardBG">Harga</th>
                <th className="p-3 text-left border-l border-cardBG">Tanggal Update</th>
                <th className="p-3 text-left border-x border-cardBG">Aksi</th>
            </tr>
            </thead>

            <tbody className="text-black">
            {data.map((item, index) => (
                <tr key={index}>
                    <td className="p-3">{item.kode}</td>
                    <td className="p-3">{item.namaBarang}</td>
                    <td className="p-3">{item.type}</td>
                    <td className="p-3">{item.stokOrder}</td>
                    <td className="p-3">{item.stokKeluar}</td>
                    <td className="p-3">{item.mutasiMasuk}</td>
                    <td className="p-3">{item.mutasiKeluar}</td>
                    <td className="p-3">{item.totalStok}</td>
                    <td className="p-3">{item.harga}</td>
                    <td className="p-3">{item.tanggal}</td>
                    <td className="grid grid-cols-2 justify-cente text-center p-3">
                        <button className="text-pen">
                            <HiOutlinePencilSquare className="size-7 p-1 border border-pen rounded-md"/>
                        </button>
                        <button className="text-trash">
                            <PiTrashBold className="size-7 p-1 border border-trash rounded-md"/>
                        </button>
                    </td>
                </tr>
            ))}

            {/* BARIS JUMLAH */}
            <tr className="font-inter font-bold text-lg border-b">
                <td className="px-3 py-6">Jumlah</td>
                <td></td>
                <td></td>
                <td className="p-3 font-inter text-sm ">{totalOrder} Kg</td>
                <td className="p-3 font-inter text-sm ">{totalKeluar} Kg</td>
                <td className="p-3 font-inter text-sm ">{mutasiMasuk} Kg</td>
                <td className="p-3 font-inter text-sm ">{mutasiKeluar} Kg</td>
                <td className="p-3 font-inter text-sm ">{totalStok} Kg</td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            </tbody>
        </table>
    );
};

export default TableKaryawan;
