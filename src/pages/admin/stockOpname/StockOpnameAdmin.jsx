import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStockOpnameManagement } from "../../../hooks/admin/useStockOpnameManagement.js";

import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import DateRangeField from "../../../components/forms/DateRangeField.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import TableStockOpnameAdmin from "../../../components/tables/AdminLayouts/TableStockOpnameAdmin.jsx";
import StockOpnameDetailModal from "../../../components/modals/StockOpnameDetailModal.jsx";
import WarningModal from "../../../components/modals/WarningModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import { FaPlus } from "react-icons/fa6";
import { FiSearch, FiFilter } from "react-icons/fi";
import EditStockOpnameModal from "../../../components/modals/EditStockOpnameModal.jsx";

const StockOpnameAdmin = () => {
    const navigate = useNavigate();
    const {
        opnameData, isLoading, error,
        search, setSearch,
        storeId, setStoreId, storeOptions,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        isOwner,
        isFinalizeOpen, setIsFinalizeOpen, isFinalizing, triggerFinalize, confirmFinalize,
        handleEditSubmit, // baru
        isSuccessOpen, setIsSuccessOpen, successMessage,
    } = useStockOpnameManagement();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedOpname, setSelectedOpname] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editTarget, setEditTarget] = useState(null);
    const [isSavingEdit, setIsSavingEdit] = useState(false);

    const handlePreview = (opname) => {
        setSelectedOpname(opname);
        setIsPreviewOpen(true);
    };

    const handleEdit = (opname) => {
        setEditTarget(opname);
        setIsEditOpen(true);
    };

    const handleSaveEdit = async (opname, items) => {
        setIsSavingEdit(true);
        try {
            await handleEditSubmit(opname, items);
            setIsEditOpen(false);
        } catch (err) {
            alert("Gagal memperbarui: " + (err.response?.data?.message || err.message));
        } finally {
            setIsSavingEdit(false);
        }
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-14 flex justify-between">
                <div>
                    <h1 className="text-3xl font-inter font-medium text-black">Stock Opname</h1>
                    <p className="text-sm font-inter text-black">Riwayat hasil stock opname seluruh cabang</p>
                </div>
                <button
                    onClick={() => navigate('/admin/kelolaStockOpname')}
                    className="bg-button text-lg px-6 py-3 rounded-2xl font-medium flex items-center gap-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:bg-button2 transition"
                >
                    <FaPlus size={20} /> Kelola Stock Opname
                </button>
            </div>

            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <h2 className="text-2xl font-inter font-medium mb-6">Data Hasil Stock Opname</h2>

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
                        onChange={setDateRange} />
                    <FilterDropdown
                        icon={FiFilter}
                        label="Ganti Cabang Toko"
                        value={storeId}
                        onChange={(val) => setStoreId(val)}
                        options={storeOptions}
                    />
                </div>

                <div className="overflow-x-auto bg-white">
                    {error ? (
                        <p className="text-center py-10 text-red-400">{error}</p>
                    ) : (
                        <TableStockOpnameAdmin
                            data={opnameData}
                            onPreview={handlePreview}
                            onEdit={handleEdit}
                            onFinalize={triggerFinalize}
                            isOwner={isOwner}
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

            <StockOpnameDetailModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                opname={selectedOpname}
            />

            <WarningModal
                isOpen={isFinalizeOpen}
                onClose={() => setIsFinalizeOpen(false)}
                onConfirm={confirmFinalize}
                title="Selesaikan Stock Opname?"
                message={
                    <>
                        Stok sistem akan disesuaikan mengikuti hasil hitung fisik. <br /><br />
                        <span className="text-red-500 font-medium">Aksi ini tidak bisa dibatalkan.</span>
                    </>
                }
                confirmText="Ya, Selesaikan"
                isLoading={isFinalizing}
            />

            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message={successMessage}
            />

            <EditStockOpnameModal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                opname={editTarget}
                onSave={handleSaveEdit}
                isSaving={isSavingEdit}
            />
        </div>
    );
};

export default StockOpnameAdmin;