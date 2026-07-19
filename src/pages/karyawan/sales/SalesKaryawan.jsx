import React from "react";

// Import Custom Hook Logic POS
import { PRODUCT_TYPES_BACKEND, useSalesPOSKaryawan } from "../../../hooks/karyawan/useSalesPOSKaryawan.js";

// Import React icons
import { FiSearch, FiFilter } from "react-icons/fi";

// Import Reusable Components UI & Pagination
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import WarningModal from "../../../components/modals/WarningModal.jsx"; // Pakai WarningModal milikmu bro
import KeranjangItem from "../../../components/ui/KeranjangItem.jsx";
import ProductCard from "../../../components/ui/ProductCard.jsx";
import CategoryPillsOptions from "../../../components/ui/CategoryPillsOptions.jsx";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";

const SalesKaryawan = () => {
    const {
        products, isLoading, selectedType, setSelectedType, searchQuery, setSearchQuery,
        cart, customerName, setCustomerName,
        isSuccessOpen, setIsSuccessOpen, addToCart, updateQuantity, removeFromCart, subtotal,
        totalItems, handleProcessPayment, currentPage, setCurrentPage, totalPages, rowsPerPage, setRowsPerPage,
        isWarningOpen, setIsWarningOpen, warningMessage, isProcessing,
    } = useSalesPOSKaryawan();

    return (
        <div className="px-8 pt-6 pb-10 bg-white min-h-full w-full">
            <div className="mb-8">
                <h1 className="text-3xl font-inter font-medium text-black">Transaksi Penjualan</h1>
                <p className="text-sm text-gray-500 mt-1 font-inter">Kelola manajemen data transaksi penjualan POS Anda.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Area Produk (3 Kolom Grid Layout) */}
                <div className="lg:col-span-3 p-6 bg-card rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.2)] flex flex-col justify-between">
                    <div>
                        {/* Filters and Search */}
                        <div className="flex flex-col xl:flex-row items-center justify-between pb-6 gap-4 border-b border-gray-100 mb-6">
                            <CategoryPillsOptions
                                options={PRODUCT_TYPES_BACKEND}
                                selectedValue={selectedType}
                                onSelect={setSelectedType}
                            />

                            <div className="flex flex-col sm:flex-row items-center gap-4 w-full xl:w-auto justify-end">
                                <SearchFilter
                                    leftIcon={<FiSearch className="text-gray-500 size-6" />}
                                    label="Cari produk..."
                                    value={searchQuery}
                                    isInput={true}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full sm:w-72 font-inter text-sm h-11 bg-white rounded-full shadow-[0_4px_4px_rgba(0,0,0,0.1)]"
                                />
                            </div>
                        </div>

                        {/* Product Grid Card */}
                        {isLoading ? (
                            <div className="text-center py-10 font-inter text-gray-500">Memuat data produk...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 content-start pb-6">
                                {products.length === 0 ? (
                                    <div className="col-span-full text-center py-10 text-gray-400 font-inter">
                                        Produk tidak ditemukan atau stok kosong.
                                    </div>
                                ) : (
                                    products.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                            onAddToCart={addToCart}
                                        />
                                    ))
                                )}
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {!isLoading && products.length > 0 && (
                        <div className="border-t border-gray-100 pt-4 mt-auto">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={setRowsPerPage}
                            />
                        </div>
                    )}
                </div>

                {/* Area Ringkasan Keranjang Belanja */}
                <div className="w-full">
                    <KeranjangItem
                        cart={cart}
                        customerName={customerName}
                        setCustomerName={setCustomerName}
                        totalItems={totalItems}
                        subtotal={subtotal}
                        onUpdateQuantity={updateQuantity}
                        onRemoveFromCart={removeFromCart}
                        onProcessPayment={handleProcessPayment}
                        isProcessing={isProcessing}
                    />
                </div>
            </div>

            {/* Modal Notifikasi Berhasil */}
            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setIsSuccessOpen(false)}
                message="Transaksi Berhasil Diproses!"
            />

            <WarningModal
                isOpen={isWarningOpen}
                title="Peringatan Validasi Kasir"
                message={warningMessage}
                onClose={() => setIsWarningOpen(false)}
                onConfirm={() => setIsWarningOpen(false)}
                confirmText="Oke, Mengerti"
            />
        </div>
    );
};

export default SalesKaryawan;