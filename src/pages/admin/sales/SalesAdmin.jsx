import { useSalesManagement } from "../../../hooks/admin/useSalesManagement.js";

import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import TableSalesAdmin from "../../../components/tables/AdminLayouts/TableSalesAdmin.jsx";
import FormCreatePenjualan from "../../admin/sales/FormCreatePenjualan.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import { catTypes } from "../../../dummy/dataAdmin/DropdownOptions.jsx";

import { FiSearch, FiChevronDown, FiFilter } from "react-icons/fi";

const SalesAdmin = () => {
    const {
        salesData, isLoading, error,
        search, setSearch,
        type, setType,
        storeId, setStoreId, storeOptions,
        pagination, handlePageChange, handleRowsPerPageChange,
        editSale, setEditSale,
        deleteSale, setDeleteSale,
        isDeleteOpen, setIsDeleteOpen,
        isDeleting,
        isSuccessOpen, setIsSuccessOpen, successMessage,
        handleTambah, handleEdit, handleUpdate, triggerDelete, confirmDelete
    } = useSalesManagement();

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Kelola Transaksi Penjualan</h1>
            </div>
            <div className="flex gap-10 items-start">
                {/* TABEL */}
                <div className="flex-1 w-3/4 bg-card pt-7 pb-9 px-7 rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                    <h2 className="text-2xl font-inter font-medium mb-6">Data Transaksi Penjualan</h2>
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
                    <div className="overflow-x-auto bg-white pb-5 rounded-xl">
                        {error ? (
                            <p className="text-center py-10 text-red-400">{error}</p>
                        ) : (
                            <TableSalesAdmin
                                data={salesData}
                                isLoading={isLoading}
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

                {/* FORM — satu form untuk create & edit */}
                <div className="w-1/4 flex-shrink-0">
                    <FormCreatePenjualan
                        onSimpan={handleTambah}
                        onUpdate={handleUpdate}
                        editSale={editSale}
                        onBatalEdit={() => setEditSale(null)}
                    />
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteOpen}
                onClose={() => { setIsDeleteOpen(false); setDeleteSale(null); }}
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

export default SalesAdmin;