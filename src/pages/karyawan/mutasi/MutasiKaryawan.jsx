import { useMutasiKaryawan } from "../../../hooks/karyawan/useMutasiKaryawan.js";
import TableMutasi from "../../../components/tables/AdminLayouts/TableMutasi.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import DateRangeField from "../../../components/forms/DateRangeField.jsx";
import {FiFilter, FiSearch} from "react-icons/fi";
import React from "react";
import WarningModal from "../../../components/modals/WarningModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import {catTypes} from "../../../Data/DropdownOptions.jsx";

const MutasiKaryawan = () => {
    const {
        data, loading, error,
        totalSummary,
        search, setSearch,
        type, setType,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        triggerStatusChange, confirmStatusChange,
        isStatusOpen, setIsStatusOpen, isUpdatingStatus, statusTarget,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        canChangeStatus,
    } = useMutasiKaryawan();

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Mutasi Produk</h1>
                <p className="text-sm text-gray-500 mt-1 font-inter">Riwayat mutasi stok cabang Anda (masuk & keluar).</p>
            </div>

            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <h2 className="text-2xl font-inter font-medium mb-6">Data Mutasi Produk</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-8">
                    <SearchFilter
                        leftIcon={<FiSearch className="text-gray-400 size-5 cursor-pointer" />}
                        label="Cari..."
                        isInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DateRangeField
                        value={dateRange}
                        onChange={setDateRange}
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
                    {loading ? (
                        <p className="text-center py-10 text-gray-400 animate-pulse">Memuat data...</p>
                    ) : error ? (
                        <p className="text-center py-10 text-red-400">{error}</p>
                    ) : (
                        <TableMutasi
                            data={data}
                            showActions={false}
                            onStatusChange={triggerStatusChange}
                            canChangeStatus={canChangeStatus}
                            totalKg={totalSummary.totalKg}
                            totalPcs={totalSummary.totalPcs}
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

            <WarningModal
                isOpen={isStatusOpen}
                onClose={() => setIsStatusOpen(false)}
                onConfirm={confirmStatusChange}
                title={statusTarget?.status === "PENDING" ? "Kirim Mutasi?" : "Konfirmasi Barang Diterima?"}
                message={
                    statusTarget?.status === "PENDING"
                        ? "Stok akan dikurangi dari cabang Anda. Aksi ini tidak bisa dibatalkan."
                        : "Stok akan ditambahkan ke cabang Anda. Aksi ini tidak bisa dibatalkan."
                }
                confirmText={statusTarget?.status === "PENDING" ? "Ya, Kirim" : "Ya, Sudah Diterima"}
                isLoading={isUpdatingStatus}
            />
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message={successMessage}
            />
        </div>
    );
};

export default MutasiKaryawan;