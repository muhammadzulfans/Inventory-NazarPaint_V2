import { useMutasiAdmin } from "../../../hooks/admin/useMutasiAdmin.js";
import TableMutasi from "../../../components/tables/AdminLayouts/TableMutasi.jsx";
import FormCreateMutasi from "./FormCreateMutasi.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import { FiFilter, FiSearch } from "react-icons/fi";
import React from "react";

const MutasiAdmin = () => {
    const {
        data, loading, error,
        search, setSearch,
        filterStoreId, setFilterStoreId,
        storeOptions, productOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        handleCreate,
        handleUpdate,
        editMutasi, setEditMutasi, handleEdit,
        handleTriggerDelete, handleConfirmDelete,
        deleteMutasi, isDeleteOpen, isDeleting, setIsDeleteOpen, setDeleteMutasi,
        isSuccessOpen, successMessage, setIsSuccessOpen,
    } = useMutasiAdmin();

    const filterStoreOptions = [
        { value: "", label: "Semua Cabang" },
        ...storeOptions,
    ];

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Mutasi Produk</h1>
                <p className="text-sm text-gray-500 mt-1 font-inter">Kelola manajemen data mutasi Anda.</p>
            </div>

            <div className="flex gap-10 items-start">
                {/* TABEL */}
                <div className="flex-1 w-3/4 bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                    <h2 className="text-2xl font-inter font-medium mb-6">Data Mutasi Produk</h2>
                    <div className="grid grid-cols-3 gap-6 items-center mb-8">
                        <SearchFilter
                            leftIcon={<FiSearch className="text-gray-400 size-5 cursor-pointer" />}
                            label="Cari..."
                            isInput
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <FilterDropdown
                            icon={FiFilter}
                            label="Ganti Cabang Toko"
                            value={filterStoreId}
                            onChange={setFilterStoreId}
                            options={filterStoreOptions}
                        />
                        <FilterDropdown
                            icon={FiFilter}
                            label="Ganti Cabang Toko"
                            value={filterStoreId}
                            onChange={setFilterStoreId}
                            options={filterStoreOptions}
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
                                onEdit={handleEdit}
                                onDelete={handleTriggerDelete}
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

                {/* FORM — satu form untuk create & edit */}
                <div className="w-1/4 flex-shrink-0">
                    <FormCreateMutasi
                        onSimpan={editMutasi ? handleUpdate : handleCreate}
                        storeOptions={storeOptions}
                        productOptions={productOptions}
                        editMutasi={editMutasi}
                        onBatalEdit={() => setEditMutasi(null)}
                    />
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setDeleteMutasi(null); }}
                onConfirm={handleConfirmDelete}
                itemName={deleteMutasi?.label || "mutasi ini"}
                itemType="Mutasi"
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

export default MutasiAdmin;