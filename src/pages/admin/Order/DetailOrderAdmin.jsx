import { useOrderManagement } from "../../../hooks/admin/useOrderManagement.js";

import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import TableDetailOrderAdmin from "../../../components/tables/AdminLayouts/TableDetailOrderAdmin.jsx";
import FormCreateOrder from "./FormCreateOrder.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import WarningModal from "../../../components/modals/WarningModal.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";

import { catTypes } from "../../../Data/DropdownOptions.jsx";
import { FiSearch, FiChevronDown, FiFilter } from "react-icons/fi";
import React from "react";

const DetailOrderAdmin = () => {
    const {
        orderData, error,
        totalSummary,
        search, setSearch,
        type, setType,
        storeId, setStoreId, storeOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        deleteOrder, setDeleteOrder,
        isDeleteOpen, setIsDeleteOpen,
        isDeleting,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        isStatusOpen, setIsStatusOpen, isUpdatingStatus,
        handleEdit, triggerDelete, confirmDelete,
        triggerStatusChange, confirmStatusChange
    } = useOrderManagement({ fixedStatus: "RECEIVED" });

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Detail Transaksi Pembelian</h1>
                <p className="text-sm font-inter text-black">Manajemen data transaksi pembelian Anda.</p>
            </div>
            <div className="flex gap-10 items-start">
                {/* TABEL */}
                <div className="flex-1 w-3/4 bg-card pt-7 pb-9 px-7 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                    <h2 className="text-2xl font-inter font-medium mb-6">Data Transaksi Pembelian Produk</h2>
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
                            label="Type Cat"
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
                    <div className="overflow-x-auto bg-white pb-5 rounded-xl">
                        {error ? (
                            <p className="text-center py-10 text-red-400">{error}</p>
                        ) : (
                            <TableDetailOrderAdmin
                                data={orderData}
                                onEdit={handleEdit}
                                onDelete={triggerDelete}
                                onStatusChange={triggerStatusChange}
                                totalItem={totalSummary.totalItem}
                                totalHarga={totalSummary.totalHarga}
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

                {/* FORM */}
                {/*<div className="w-1/4 flex-shrink-0">*/}
                {/*    <FormCreateOrder*/}
                {/*        onSimpan={handleTambah}*/}
                {/*        onUpdate={handleUpdate}*/}
                {/*        editOrder={editOrder}*/}
                {/*        onBatalEdit={() => setEditOrder(null)}*/}
                {/*    />*/}
                {/*</div>*/}
            </div>

            {/* MODALS */}
            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setDeleteOrder(null); }}
                onConfirm={confirmDelete}
                itemName={deleteOrder?.namaBarang || "transaksi ini"}
                itemType="Transaksi Pembelian"
                isLoading={isDeleting}
            />

            <WarningModal
                isOpen={isStatusOpen}
                onClose={() => setIsStatusOpen(false)}
                onConfirm={confirmStatusChange}
                title="Terima Pesanan?"
                message={
                    <>
                        Apakah Anda yakin mengubah status menjadi <b className="text-black">RECEIVED</b>? <br/><br/>
                        <span className="text-red-500 font-medium">(Aksi ini akan menambah stok persediaan)</span>
                    </>
                }
                confirmText="Ya, Terima"
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

export default DetailOrderAdmin;