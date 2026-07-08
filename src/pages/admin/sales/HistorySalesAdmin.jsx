import React, { useState } from "react";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import TableHistorySalesAdmin from "../../../components/tables/AdminLayouts/TableHistorySalesAdmin.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import { catTypes } from "../../../dummy/dataAdmin/DropdownOptions.jsx";
import { useSalesManagement } from "../../../hooks/admin/useSalesManagement.js";
import { FiSearch, FiFilter } from "react-icons/fi";

// Import Komponen Detail Modal Baru
import TransactionDetailModal from "../../../components/modals/TransactionDetailModal.jsx";

const HistorySalesAdmin = () => {
    const {
        salesData, isLoading, error,
        search, setSearch,
        type, setType,
        storeId, setStoreId, storeOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        handleEdit,
        deleteSale,
        isDeleteOpen, setIsDeleteOpen,
        isDeleting,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        triggerDelete, confirmDelete
    } = useSalesManagement();

    // State Lokal Tambahan untuk Mengontrol Preview Struk Transaksi
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const handlePreview = (item) => {
        setSelectedTransaction(item);
        setIsPreviewOpen(true);
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white min-h-full">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Riwayat Transaksi Penjualan</h1>
                <p className="text-sm text-gray-500 mt-1 font-inter">Kelola manajemen data riwayat transaksi penjualan Anda.</p>
            </div>

            {/* TABEL UTAMA */}
            <div className="w-full bg-card pt-7 pb-9 px-7 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <h2 className="text-2xl font-inter font-medium mb-6">Daftar Riwayat Transaksi Penjualan</h2>

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
                        options={[{ value: "", label: "Pilih Tipe" }, ...catTypes]}
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
                        <TableHistorySalesAdmin
                            data={salesData}
                            isLoading={isLoading}
                            onPreview={handlePreview}
                            onEdit={handleEdit}
                            onDelete={triggerDelete}
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

            {/* MODALS SECTION */}
            <TransactionDetailModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                transaction={selectedTransaction}
            />

            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); }}
                onConfirm={confirmDelete}
                itemName={deleteSale?.namaBarang || "transaksi ini"}
                itemType="Transaksi"
                isLoading={isDeleting}
            />
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message={successMessage}
            />
        </div>
    );
};

export default HistorySalesAdmin;