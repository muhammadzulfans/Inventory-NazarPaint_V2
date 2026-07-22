import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProductInventory } from "../../../hooks/admin/useProductInventory.js";

import Card from "../../../components/ui/Card.jsx";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TableAdmin from "../../../components/tables/AdminLayouts/TableAdmin.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";

import { catTypes } from "../../../Data/DropdownOptions.jsx";
import { FaArrowTrendDown, FaPlus } from "react-icons/fa6";
import { MdOutlineStore } from "react-icons/md";
import { FiSearch, FiFilter, FiChevronDown } from "react-icons/fi";
import DateRangeField from "../../../components/forms/DateRangeField.jsx";
import ModalPrediksiStok from "../../../components/modals/ModalPrediksiStok.jsx";
import { useStockOverviewAdmin } from "../../../hooks/admin/useStockOverviewAdmin.js";
import WarningModal from "../../../components/modals/WarningModal.jsx";

const InventoryAdmin = () => {
    const navigate = useNavigate();

    // Panggil fungsi dan state dari custom hook
    const {
        products, isLoading,
        search, setSearch,
        type, setType,
        storeId, setStoreId, storeOptions,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        totalSummary
    } = useProductInventory();

    const {
        overview, isLoading: isLoadingOverview,
    } = useStockOverviewAdmin();

    const [previewProduct, setPreviewProduct] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // Tambahkan state warning modal di atas
    const [isWarningOpen, setIsWarningOpen] = useState(false);


    const handlePreview = (item) => {
        // Validasi: Jika cabang belum dipilih, cegah buka modal prediksi
        if (!storeId) {
            setIsWarningOpen(true);
            return;
        }
        setPreviewProduct(item);
        setIsPreviewOpen(true);
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            {/* HEADER */}
            <div className="mb-14 flex justify-between">
                <div>
                    <h1 className="text-3xl font-inter font-medium text-black">Persediaan</h1>
                    <p className="text-sm font-inter text-black">Kelola produk anda</p>
                </div>

                <button
                    onClick={() => navigate('/admin/kelolaInventory')}
                    className="bg-button text-lg px-6 py-3 rounded-2xl font-medium flex items-center gap-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:bg-button2 transition"
                >
                    <FaPlus size={20} />
                    Kelola Produk
                </button>
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-2 gap-16 mb-14">
                <Card
                    title="Stok Hampir Habis"
                    value={isLoadingOverview ? "..." : `${overview?.lowStockCount ?? 0} Item`}
                    icon={<FaArrowTrendDown className="size-7 m-3.5" />}
                />
                <Card
                    title="Jumlah Cabang"
                    value={isLoadingOverview ? "..." : `${overview?.storeCount ?? 0} Toko Cabang`}
                    icon={<MdOutlineStore className="size-8 m-3" />}
                />
            </div>

            {/* DATA STOK PRODUK */}
            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-inter font-medium">Data Stok Produk</h2>
                </div>

                {/* FILTER */}
                <div className="grid grid-cols-4 gap-10 items-center mb-8">
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
                    <FilterDropdown
                        icon={FiFilter}
                        label="Ganti Cabang Toko"
                        value={storeId}
                        onChange={(val) => setStoreId(val)}
                        options={storeOptions}
                    />
                </div>

                {/* TABEL */}
                <div className="overflow-x-auto bg-white">
                    <TableAdmin
                        data={products}
                        isLoading={isLoading}
                        isEditable={false}
                        storeId={storeId}
                        onPreview={handlePreview}
                        totalStokKg={totalSummary.totalStokKg}
                        totalStokPcs={totalSummary.totalStokPcs}
                        hasKg={totalSummary.hasKg}
                        hasPcs={totalSummary.hasPcs}
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
            <ModalPrediksiStok
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                product={previewProduct}
                storeId={storeId} // <-- Tambahkan prop ini agar modal tahu cabang mana yang aktif
            />
            {/* Tambahkan WarningModal di bawah agar fitur peringatan aktif */}
            <WarningModal
                isOpen={isWarningOpen}
                onClose={() => setIsWarningOpen(false)}
                title="Cabang Belum Dipilih"
                message="Silakan pilih cabang toko terlebih dahulu pada filter dropdown di atas sebelum melihat prediksi stok!"
                singleButton={true}
            />
        </div>
    );
};

export default InventoryAdmin;