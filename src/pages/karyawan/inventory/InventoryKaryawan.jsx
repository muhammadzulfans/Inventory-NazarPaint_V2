import { FaArrowTrendDown } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineStoreMallDirectory } from "react-icons/md";
import { MdOutlineStore } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";
import Card from "../../../components/ui/Card.jsx";
import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import {inventoryTableData} from "../../../dummy/dataKaryawan/InventoryTableData.js";
import TableKaryawan from "../../../components/tables/KaryawanLayouts/TableKaryawan.jsx";


const InventoryKaryawan = () => {
    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            {/* HEADER */}
            <div className="mb-14">
                <h1 className="text-3xl font-inter font-medium text-black">
                    Persediaan
                </h1>
                <p className="text-sm font-inter text-black">
                    Kelola produk anda
                </p>
            </div>


            {/* CARD */}
            <div className="grid grid-cols-3 gap-16 mb-14">
                <Card
                    title="Stok Hampir Habis"
                    value="19 Kg"
                    icon={<FaArrowTrendDown className="size-7 m-3.5" />}
                />
                <Card
                    title="Total Mutasi Keluar"
                    value="49 Kg"
                    icon={<AiOutlineProduct className="size-8 m-3" />}
                />
                <Card
                    title="Total Mutasi Masuk"
                    value="32 Kg"
                    icon={<AiOutlineProduct className="size-7 m-3.5" />}
                />
            </div>


            {/* DATA STOK PRODUK ) */}
            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-inter font-medium">
                        Data Stok Produk
                    </h2>
                    <button className="bg-button text-sm px-6 py-3 rounded-2xl font-medium flex items-center gap-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
                        <FaPlus /> Tambah Produk
                    </button>
                </div>

                {/* FILTER */}
                <div className="flex justify-between gap-8 items-center mb-8">
                    <SearchFilter
                        leftIcon={<FiSearch className="text-gray-400 size-5" />}
                        label="Cari..."
                        isInput
                        className="w-3/4"
                    />

                    <SearchFilter
                        leftIcon={<FiFilter className="text-gray-400 size-5" />}
                        label="Type Cat"
                        rightIcon={<FiChevronDown className="text-gray-500 size-6" />}
                        className="w-1/4"
                    />

                </div>

                <div className="overflow-x-auto bg-white">
                    <TableKaryawan data={inventoryTableData} />
                    <TablePagination />
                </div>
            </div>
        </div>
    );
};

export default InventoryKaryawan;
