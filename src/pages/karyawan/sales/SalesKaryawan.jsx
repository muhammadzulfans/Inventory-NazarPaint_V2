import { FaPlus } from "react-icons/fa6";
import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import TableSalesAdmin from "../../../components/tables/AdminLayouts/TableSalesAdmin.jsx";
import FormCreatePenjualan from "../../admin/sales/FormCreatePenjualan.jsx";
import { salesTableData } from "../../../dummy/dataAdmin/Data/salesTableData.js";
import { useState } from "react";

const SalesAdmin = () => {
    const [data, setData] = useState(salesTableData);

    const handleTambah = (newItem) => {
        setData((prev) => [...prev, newItem]);
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            {/* HEADER */}
            <div className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-inter font-medium text-black">Kelola Transaksi Penjualan</h1>
                    {/*<p className="text-sm font-inter text-black">Kelola penjualan anda</p>*/}
                </div>
                {/*<button className="bg-button text-sm px-6 py-3 rounded-2xl font-medium flex items-center gap-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">*/}
                {/*    <FaPlus /> Tambah Penjualan*/}
                {/*</button>*/}
            </div>

            {/* KONTEN UTAMA: TABEL + FORM */}
            <div className="flex gap-10 items-start">
                {/* TABEL — lebih besar */}
                <div className="flex-1 w-3/4 bg-card pt-7 pb-9 px-7 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                    <h2 className="text-2xl font-inter font-medium mb-6">Data Transaksi Penjualan</h2>
                    <div className="grid grid-cols-3 gap-6 items-center mb-8">
                        <SearchFilter leftIcon={<FiSearch className="text-gray-400 size-5" />} label="Cari..." isInput />
                        <SearchFilter leftIcon={<FiFilter className="text-gray-400 size-5" />} label="Type Cat" rightIcon={<FiChevronDown className="text-gray-500 size-6" />} />
                        <SearchFilter leftIcon={<FiFilter className="text-gray-400 size-5" />} label="Ganti Cabang Toko" rightIcon={<FiChevronDown className="text-gray-500 size-6" />} />
                    </div>
                    <div className="overflow-x-auto bg-white pb-5 rounded-xl">
                        <TableSalesAdmin data={data} />
                        <TablePagination />
                    </div>
                </div>

                {/* FORM — 1/4 lebar */}
                <div className="w-1/4 flex-shrink-0">
                    <FormCreatePenjualan onSimpan={handleTambah} />
                </div>
            </div>
        </div>
    );
};

export default SalesAdmin;