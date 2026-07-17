import React from "react";
import { FiSearch, FiFilter } from "react-icons/fi";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import { catTypes } from "../../../Data/DropdownOptions.jsx";

// IMPORT CUSTOM HOOK LOGIC BARU KHUSUS DETAIL
import { useDetailSalesManagement } from "../../../hooks/admin/useDetailSalesManagement.js";

// IMPORT TABEL DETAIL BARU
import TableDetailSalesAdmin from "../../../components/tables/AdminLayouts/TableDetailSalesAdmin.jsx";

const DetailSalesAdmin = () => {
    const {
        detailSalesData,
        isLoading,
        error,
        search,
        setSearch,
        type,
        setType,
        storeId,
        setStoreId,
        storeOptions,
        pagination,
        handlePageChange,
        handleRowsPerPageChange
    } = useDetailSalesManagement();

    return (
        <div className="px-8 pt-6 pb-10 bg-white min-h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Detail Transaksi Penjualan</h1>
                <p className="text-sm text-gray-500 mt-1 font-inter">Manajemen data transaksi penjualan Anda.</p>
            </div>

            {/* TABEL UTAMA */}
            <div className="w-full bg-card pt-7 pb-9 px-7 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <h2 className="text-2xl font-inter font-medium mb-6">Daftar Data Transaksi Penjualan</h2>

                {/* FILTER CONTROLS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
                    <SearchFilter
                        leftIcon={<FiSearch className="text-gray-400 size-5 cursor-pointer" />}
                        label="Cari transaksi..."
                        isInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <FilterDropdown
                        icon={FiFilter}
                        label="Tipe Kategori"
                        value={type}
                        onChange={(val) => setType(val)}
                        options={[{ value: "", label: "Semua Tipe" }, ...catTypes]}
                    />
                    <FilterDropdown
                        icon={FiFilter}
                        label="Ganti Cabang Toko"
                        value={storeId}
                        onChange={(val) => setStoreId(val)}
                        options={storeOptions}
                    />
                </div>

                {/* AREA DATA */}
                <div className="overflow-x-auto bg-white pb-5 rounded-xl">
                    {error ? (
                        <p className="text-center py-10 text-red-400 font-inter">{error}</p>
                    ) : (
                        <TableDetailSalesAdmin
                            data={detailSalesData}
                            isLoading={isLoading}
                            showCostColumns={true}
                        />
                    )}
                    <TablePagination
                        currentPage={pagination.page}
                        totalPages={pagination.totalPages}
                        rowsPerPage={pagination.limit}
                        onPageChange={handlePageChange}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailSalesAdmin;