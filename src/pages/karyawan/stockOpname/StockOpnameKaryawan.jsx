import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStockOpnameManagementKaryawan } from "../../../hooks/karyawan/useStockOpnameManagementKaryawan.js";

import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import DateRangeField from "../../../components/forms/DateRangeField.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import TableStockOpnameAdmin from "../../../components/tables/AdminLayouts/TableStockOpnameAdmin.jsx";
import StockOpnameDetailModal from "../../../components/modals/StockOpnameDetailModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import { FaPlus } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

const StockOpnameKaryawan = () => {
    const navigate = useNavigate();
    const {
        opnameData, isLoading, error,
        search, setSearch,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        isOwner,
        isSuccessOpen, setIsSuccessOpen, successMessage,
    } = useStockOpnameManagementKaryawan();

    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [selectedOpname, setSelectedOpname] = useState(null);

    const handlePreview = (opname) => {
        setSelectedOpname(opname);
        setIsPreviewOpen(true);
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-14 flex justify-between">
                <div>
                    <h1 className="text-3xl font-inter font-medium text-black">Stock Opname</h1>
                    <p className="text-sm font-inter text-black">Riwayat hasil stock opname cabang Anda</p>
                </div>
                <button
                    onClick={() => navigate('/karyawan/kelolaStockOpname')}
                    className="bg-button text-lg px-6 py-3 rounded-2xl font-medium flex items-center gap-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:bg-button2 transition"
                >
                    <FaPlus size={20} /> Kelola Stock Opname
                </button>
            </div>

            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <h2 className="text-2xl font-inter font-medium mb-6">Data Hasil Stock Opname</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
                    <SearchFilter
                        leftIcon={<FiSearch className="text-gray-400 size-5 cursor-pointer" />}
                        label="Cari..."
                        isInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DateRangeField value={dateRange} onChange={setDateRange} />
                </div>

                <div className="overflow-x-auto bg-white">
                    {error ? (
                        <p className="text-center py-10 text-red-400">{error}</p>
                    ) : (
                        <TableStockOpnameAdmin
                            data={opnameData}
                            onPreview={handlePreview}
                            onEdit={() => {}} // tidak pernah terpanggil, tombol otomatis disabled (isOwner=false)
                            onFinalize={() => {}} // tidak pernah terpanggil, badge otomatis non-klik (isOwner=false)
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

            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message={successMessage}
            />
        </div>
    );
};

export default StockOpnameKaryawan;