import { useProductInventoryKaryawan } from "../../../hooks/karyawan/useProductInventoryKaryawan.js";
import { useStockOverviewKaryawan } from "../../../hooks/karyawan/useStockOverviewKaryawan.js";
import Card from "../../../components/ui/Card.jsx";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TableAdmin from "../../../components/tables/AdminLayouts/TableAdmin.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import { catTypes } from "../../../dummy/dataAdmin/DropdownOptions.jsx";
import { FaArrowTrendDown } from "react-icons/fa6";
import { AiOutlineProduct } from "react-icons/ai";
import { FiSearch, FiFilter } from "react-icons/fi";
import React from "react";

const InventoryKaryawan = () => {
    const {
        products, isLoading,
        search, setSearch,
        type, setType,
        storeId,
        pagination, handlePageChange, handleRowsPerPageChange
    } = useProductInventoryKaryawan();

    const { overview, isLoading: isLoadingOverview } = useStockOverviewKaryawan();

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            {/* HEADER */}
            <div className="mb-14 flex justify-between">
                <div>
                    <h1 className="text-3xl font-inter font-medium text-black">Persediaan</h1>
                    <p className="text-sm font-inter text-black">Data stok produk cabang Anda</p>
                </div>
            </div>

            {/* CARDS — data asli dari cabang Anda (bulan berjalan) */}
            <div className="grid grid-cols-3 gap-16 mb-14">
                <Card
                    title="Stok Hampir Habis"
                    value={isLoadingOverview ? "..." : `${overview?.lowStockCount ?? 0} Produk`}
                    icon={<FaArrowTrendDown className="size-7 m-3.5" />}
                />
                <Card
                    title="Total Mutasi Keluar (Bulan Ini)"
                    value={isLoadingOverview ? "..." : `${overview?.stokKeluar ?? 0} Unit`}
                    icon={<AiOutlineProduct className="size-8 m-3" />}
                />
                <Card
                    title="Total Mutasi Masuk (Bulan Ini)"
                    value={isLoadingOverview ? "..." : `${overview?.stokMasuk ?? 0} Unit`}
                    icon={<AiOutlineProduct className="size-7 m-3.5" />}
                />
            </div>

            {/* DATA STOK PRODUK */}
            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-inter font-medium">Data Stok Produk</h2>
                </div>

                <div className="grid grid-cols-2 gap-10 items-center mb-8">
                    <SearchFilter
                        leftIcon={<FiSearch className="text-gray-400 size-5 cursor-pointer" />}
                        label="Cari..."
                        isInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FilterDropdown
                        icon={FiFilter}
                        label="Type Cat"
                        value={type}
                        onChange={(val) => setType(val)}
                        options={[{ value: "", label: "Semua Tipe" }, ...catTypes]}
                    />
                </div>

                <div className="overflow-x-auto bg-white">
                    <TableAdmin
                        data={products}
                        isLoading={isLoading}
                        isEditable={false}
                        showBasePrice={false}
                        storeId={storeId}
                    />
                    <TablePagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        rowsPerPage={pagination.limit}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                    <div className="mt-4 text-sm font-inter text-gray-500 font-medium">
                        Total: <span className="text-black font-semibold">{products.length}</span> produk tersedia
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryKaryawan;