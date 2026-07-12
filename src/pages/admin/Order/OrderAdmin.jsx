import { useState } from "react";
import { useOrderCreate } from "../../../hooks/admin/useOrderCreate.js";
import { useOrderManagement } from "../../../hooks/admin/useOrderManagement.js";

import OrderItemsTable from "../../../components/tables/AdminLayouts/TableOrderItems.jsx";
import OrderSummaryPanel from "../../../components/ui/OrderSummaryPanel.jsx";
import TableOrderAdmin from "../../../components/tables/AdminLayouts/TableOrderAdmin.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";
import WarningModal from "../../../components/modals/WarningModal.jsx";
import { FiSearch, FiFilter } from "react-icons/fi";
import FormCreateOrder from "./FormCreateOrder.jsx";
import TransactionDetailModal from "../../../components/modals/TransactionDetailModal.jsx";

const OrderAdmin = () => {
    const orderCreate = useOrderCreate();
    const orderMgmt = useOrderManagement({ fixedStatus: "PENDING" });
    
    // 1. TAMBAHKAN STATE UNTUK MODAL PREVIEW INI
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewTransaction, setPreviewTransaction] = useState(null);

    // Submit: cabang antara create baru vs update nota yang lagi diedit
    const handleSubmitOrder = async () => {
        if (orderCreate.orderItems.length === 0) return;
        orderCreate.setIsSubmitting(true);
        try {
            const payload = orderCreate.buildPayload();
            if (orderCreate.editingPurchaseId) {
                await orderMgmt.handleUpdate(orderCreate.editingPurchaseId, payload);
            } else {
                await orderMgmt.handleTambah(payload);
            }
            orderCreate.setSuccessMessage(
                orderCreate.editingPurchaseId ? "Pesanan berhasil diperbarui!" : "Pesanan Pembelian Berhasil Dibuat!"
            );
            orderCreate.setIsSuccessOpen(true);
            orderCreate.resetAfterSubmit();
        } catch (err) {
            alert("Gagal memproses pesanan: " + (err.response?.data?.message || err.message));
        } finally {
            orderCreate.setIsSubmitting(false);
        }
    };

    // Klik Edit di tabel riwayat -> cari nota lengkap, muat ke cart
    const handleEditFromHistory = (orderData) => {
        // const fullOrder = orderMgmt.orderData.find((o) => o.id === flatItem.purchaseId);
        if (!orderData) return;
        orderCreate.loadOrderForEdit(orderData);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-[#f4f5f7] min-h-screen text-black font-inter">
            <div className="flex flex-col lg:flex-row gap-6 items-start">

                {/* SISI KIRI */}
                <div className="flex-1 w-full lg:w-3/4 flex flex-col gap-6">
                    <OrderItemsTable
                        orderItems={orderCreate.orderItems}
                        removeOrderItem={orderCreate.removeOrderItem}
                        onEditItem={orderCreate.handleEditCartItem}
                        editingItemIndex={orderCreate.editingItemIndex}
                        totalUnitItems={orderCreate.totalUnitItems}
                        totalJenisProduk={orderCreate.totalJenisProduk}
                        totalOrderAmount={orderCreate.totalOrderAmount}
                    />

                    {/* RIWAYAT PEMESANAN */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-sm font-bold text-gray-800 mb-4">Riwayat Pemesanan</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <SearchFilter
                                leftIcon={<FiSearch className="text-gray-400 size-5 cursor-pointer" />}
                                label="Cari..."
                                isInput
                                value={orderMgmt.search}
                                onChange={(e) => orderMgmt.setSearch(e.target.value)}
                            />
                            <FilterDropdown
                                icon={FiFilter}
                                label="Ganti Cabang Toko"
                                value={orderMgmt.storeId}
                                onChange={(val) => orderMgmt.setStoreId(val)}
                                options={orderMgmt.storeOptions}
                            />
                        </div>

                        <div className="overflow-x-auto bg-white pb-5 rounded-xl">
                            {orderMgmt.error ? (
                                <p className="text-center py-10 text-red-400">{orderMgmt.error}</p>
                            ) : (
                                <TableOrderAdmin
                                    data={orderMgmt.orderData}
                                    onEdit={handleEditFromHistory}
                                    onDelete={orderMgmt.triggerDelete}
                                    onStatusChange={orderMgmt.triggerStatusChange}
                                    onPreview={(orderData) => {
                                        setPreviewTransaction(orderData);
                                        setIsPreviewOpen(true);
                                    }}
                                />
                            )}
                            <TablePagination
                                currentPage={orderMgmt.pagination.page}
                                totalPages={orderMgmt.pagination.totalPages}
                                rowsPerPage={orderMgmt.pagination.limit}
                                onPageChange={orderMgmt.handlePageChange}
                                onRowsPerPageChange={orderMgmt.handleRowsPerPageChange}
                            />
                        </div>
                    </div>
                </div>

                {/* SISI KANAN */}
                <div className="w-full lg:w-1/4 flex flex-col gap-6">
                    <FormCreateOrder
                        storeOptions={orderCreate.storeOptions}
                        selectedStore={orderCreate.selectedStore}
                        setSelectedStore={orderCreate.setSelectedStore}
                        orderItems={orderCreate.orderItems}
                        productOptions={orderCreate.productOptions}
                        itemForm={orderCreate.itemForm}
                        setItemForm={orderCreate.setItemForm}
                        handleProductChange={orderCreate.handleProductChange}
                        handleAddItemToList={orderCreate.handleAddItemToList}
                        hasItems={orderCreate.orderItems.length > 0}
                        isEditingItem={orderCreate.editingItemIndex !== null}
                        onCancelEditItem={orderCreate.cancelEditCartItem}
                    />

                    <OrderSummaryPanel
                        storeOptions={orderCreate.storeOptions}
                        selectedStore={orderCreate.selectedStore}
                        orderItems={orderCreate.orderItems}
                        totalUnitItems={orderCreate.totalUnitItems}
                        totalJenisProduk={orderCreate.totalJenisProduk}
                        totalOrderAmount={orderCreate.totalOrderAmount}
                        isSubmitting={orderCreate.isSubmitting}
                        onSubmit={handleSubmitOrder}
                        onCancel={orderCreate.handleCancelAll}
                        isEditingOrder={!!orderCreate.editingPurchaseId}
                    />
                </div>
            </div>

            {/* 5. Ditambahkan komponen Modal Preview di paling bawah sini bro */}
            <TransactionDetailModal
                isOpen={isPreviewOpen}
                onClose={() => {
                    setIsPreviewOpen(false);
                    setPreviewTransaction(null);
                }}
                transaction={previewTransaction}
            />

            <DeleteModal
                isOpen={orderMgmt.isDeleteOpen}
                onClose={() => { orderMgmt.setIsDeleteOpen(false); orderMgmt.setDeleteOrder(null); }}
                onConfirm={orderMgmt.confirmDelete}
                itemName={orderMgmt.deleteOrder?.namaBarang || "transaksi ini"}
                itemType="Transaksi Pembelian"
                isLoading={orderMgmt.isDeleting}
            />

            <WarningModal
                isOpen={orderMgmt.isStatusOpen}
                onClose={() => orderMgmt.setIsStatusOpen(false)}
                onConfirm={orderMgmt.confirmStatusChange}
                title="Terima Pesanan?"
                message={
                    <>
                        Apakah Anda yakin mengubah status menjadi <b className="text-black">RECEIVED</b>? <br/><br/>
                        <span className="text-red-500 font-medium">(Aksi ini akan menambah stok persediaan)</span>
                    </>
                }
                confirmText="Ya, Terima"
                isLoading={orderMgmt.isUpdatingStatus}
            />

            <SuccessModal
                isOpen={orderCreate.isSuccessOpen}
                onClose={() => orderCreate.setIsSuccessOpen(false)}
                message={orderCreate.successMessage}
            />
        </div>
    );
};

export default OrderAdmin;