import React from "react";
import { useNavigate } from "react-router-dom";
import { useStockOpnameCreate } from "../../../hooks/admin/useStockOpnameCreate.js";

import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import { IoChevronBack } from "react-icons/io5";
import { FiFilter } from "react-icons/fi";
import TableKelolaStockOpname from "../../../components/tables/AdminLayouts/TableKelolaStockOpname.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";

const KelolaStockOpnameAdmin = () => {
    const navigate = useNavigate();
    const {
        storeOptions, selectedStore, setSelectedStore,
        products, paginatedProducts,
        isLoadingProducts,
        rowData, handleFieldChange, getSelisih,
        filledCount,
        pagination, handlePageChange, handleRowsPerPageChange,
        isSubmitting, handleSubmit,
        isSuccessOpen, setIsSuccessOpen, successMessage,
    } = useStockOpnameCreate();

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-14 flex gap-10">
                <div className="flex gap-4">
                    <button onClick={() => navigate("/admin/stock-opname")}>
                        <IoChevronBack size={35} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-inter font-medium text-black">
                            Kelola Stock Opname
                        </h1>
                        <p className="text-sm font-inter text-black">Isi hasil hitung fisik langsung di tabel</p>
                    </div>
                </div>
            </div>

            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-inter font-medium">Input Hasil Stock Opname</h2>
                    <FilterDropdown
                        icon={FiFilter}
                        label="Pilih Cabang Toko"
                        value={selectedStore}
                        onChange={(val) => setSelectedStore(val)}
                        options={storeOptions}
                        className="w-72"
                    />
                </div>

                <div className="overflow-x-auto bg-white">
                    <TableKelolaStockOpname
                        products={paginatedProducts}
                        isLoading={isLoadingProducts}
                        rowData={rowData}
                        onFieldChange={handleFieldChange}
                        getSelisih={getSelisih}
                    />
                    {products.length > 0 && (
                        <TablePagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            rowsPerPage={pagination.limit}
                            onPageChange={handlePageChange}
                            onRowsPerPageChange={handleRowsPerPageChange}
                        />
                    )}
                </div>

                {products.length > 0 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/20">
                        <p className="text-sm font-inter text-gray-600">
                            <span className="font-semibold text-black">{filledCount}</span> dari {products.length} produk sudah diisi
                        </p>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || filledCount === 0}
                            className="bg-button hover:bg-button2 disabled:opacity-40 disabled:cursor-not-allowed text-black font-inter font-semibold px-8 py-3 rounded-xl shadow-[0_4px_4px_rgba(0,0,0,0.2)] transition"
                        >
                            {isSubmitting ? "Menyimpan..." : "Simpan Hasil Opname"}
                        </button>
                    </div>
                )}
            </div>

            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message={successMessage}
            />
        </div>
    );
};

export default KelolaStockOpnameAdmin;