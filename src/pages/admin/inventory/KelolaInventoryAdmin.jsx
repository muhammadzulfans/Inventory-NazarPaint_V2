import { useNavigate } from "react-router-dom";
import { useProductInventory } from "../../../hooks/admin/useProductInventory.js";

import SearchFilter from "../../../components/ui/SearchFilter.jsx";
import TableAdmin from "../../../components/tables/AdminLayouts/TableAdmin.jsx";
import Modal from "../../../components/modals/Modal.jsx";
import InputField from "../../../components/forms/InputField.jsx";
import DropDownField from "../../../components/forms/DropDownField.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";
import FilterDropdown from "../../../components/ui/FilterDropdown.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import { catTypes } from "../../../Data/DropdownOptions.jsx";

import { FaPlus } from "react-icons/fa6";
import {FiChevronDown, FiFilter, FiSearch, FiHash, FiBox, FiTag, FiDroplet} from "react-icons/fi";
import { IoChevronBack } from "react-icons/io5";
import DateRangeField from "../../../components/forms/DateRangeField.jsx";
import React from "react";
import IconPickerField from "../../../components/forms/IconPickerField.jsx";
import WarningModal from "../../../components/modals/WarningModal.jsx";

const KelolaInventoryAdmin = () => {
    const navigate = useNavigate();

    // 1. Tarik semua logic dari Hook yang sudah kita Upgrade
    const {
        products, isLoading,
        search, setSearch,
        type, setType,
        storeId, setStoreId, storeOptions,
        dateRange, setDateRange,
        pagination, handlePageChange, handleRowsPerPageChange,
        totalSummary,
        // CRUD properties
        isSuccessOpen, setIsSuccessOpen, successMessage,
        selectedProduct, setSelectedProduct, modalConfig, setModalConfig,
        isDeleteOpen, setIsDeleteOpen, productToDelete,
        openModal, handleSaveProduct, triggerDelete, handleConfirmDelete,

        statusTarget, isStatusOpen, setIsStatusOpen, isUpdatingStatus,
        triggerStatusChange, confirmStatusChange,
    } = useProductInventory();

    // 2. Fungsi perantara untuk mengolah event form (e.preventDefault)
    const handleSave = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const isAccessories = selectedProduct?.tipeBarang === "ACCESSORIES";

        const payload = {
            id: selectedProduct?.id,
            code: formData.get("kodeBarang"),
            name: formData.get("namaBarang"),
            type: selectedProduct?.tipeBarang || "",
            basePrice: Number(formData.get("hargaPokok") || 0),
            sellPrice: Number(formData.get("hargaJual") || 0),
            hexColor: isAccessories ? "#808080" : (selectedProduct?.hexColor || ""),
            icon: isAccessories ? (selectedProduct?.icon || null) : null, // BARU
        };

        if (!payload.code) { alert("Kode barang wajib diisi."); return; }
        if (!payload.name) { alert("Nama barang wajib diisi."); return; }
        if (!payload.type) { alert("Tipe barang wajib dipilih."); return; }
        if (isAccessories && !payload.icon) { alert("Pilih icon untuk produk aksesoris."); return; } // BARU

        await handleSaveProduct(payload, modalConfig.type);
    };

    return (
        <div className="px-8 pt-6 pb-10 bg-white">
            <div className="mb-14 flex gap-10">
                <div className="flex gap-4">
                    <button onClick={() => navigate("/admin/inventory")}>
                        <IoChevronBack size={35}/>
                    </button>
                    <h1 className="text-3xl font-inter font-medium text-black">Kelola produk anda</h1>
                </div>
            </div>

            <div className="bg-card pt-7 pb-9 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-inter font-medium">Data Stok Produk</h2>
                    <button
                        onClick={() => openModal('ADD')}
                        className="bg-button text-lg px-6 py-3 rounded-2xl font-medium flex items-center gap-3 shadow-[0_4px_4px_rgba(0,0,0,0.25)] hover:bg-button2 transition"
                    >
                        <FaPlus size={17} /> Tambah Produk
                    </button>
                </div>

                <div className="grid grid-cols-4 gap-10 items-center mb-8">
                    <SearchFilter
                        leftIcon={<FiSearch className="text-gray-400 size-5 cursor-pointer" />}
                        label="Cari..."
                        isInput
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <DateRangeField
                        // label="Durasi"
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

                <div className="overflow-x-auto bg-white">
                    <TableAdmin
                        data={products}
                        isLoading={isLoading}
                        isEditable={true}
                        onEdit={(item) => openModal('EDIT', item)}
                        onDelete={triggerDelete}
                        onStatusChange={triggerStatusChange}
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

                {/* key pada form supaya re-render saat ganti produk */}
                <Modal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ isOpen: false, type: modalConfig.type })}
                    title={modalConfig.type === 'ADD' ? "Tambah Produk Baru" : "Edit Data Produk"}
                    subtitle="Isi data produk cat yang ingin ditambahkan"
                >
                    <form key={selectedProduct?.id || 'new'} onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputField
                                label="Kode Barang" name="kodeBarang" icon={FiHash}
                                placeholder="603"
                                defaultValue={selectedProduct?.kodeBarang || ""}
                            />
                            <InputField
                                label="Nama Barang" name="namaBarang" icon={FiBox}
                                placeholder="Roll Besar"
                                defaultValue={selectedProduct?.namaBarang || ""}
                            />
                        </div>
                        <DropDownField
                            label="Tipe Barang" icon={FiTag} placeholder="Pilih Tipe"
                            value={selectedProduct?.tipeBarang || ""}
                            options={catTypes}
                            onChange={(val) => setSelectedProduct({ ...selectedProduct, tipeBarang: val })}
                        />

                        {/* Hex color hanya muncul untuk tipe selain ACCESSORIES */}
                        {selectedProduct?.tipeBarang && selectedProduct.tipeBarang !== "ACCESSORIES" && (
                            <div className="grid grid-cols-[1fr_auto] gap-3 items-end">
                                <InputField
                                    label="Kode Warna (Hex)"
                                    icon={FiDroplet}
                                    placeholder="#22c55e"
                                    value={selectedProduct?.hexColor || ""}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, hexColor: e.target.value })}
                                />
                                <input
                                    type="color"
                                    value={/^#[0-9A-Fa-f]{6}$/.test(selectedProduct?.hexColor || "") ? selectedProduct.hexColor : "#000000"}
                                    onChange={(e) => setSelectedProduct({ ...selectedProduct, hexColor: e.target.value })}
                                    className="w-12 h-12 rounded-lg border-2 border-line cursor-pointer shrink-0"
                                    title="Pilih warna dari color picker"
                                />
                            </div>
                        )}

                        {/* Icon Picker hanya muncul untuk tipe ACCESSORIES */}
                        {selectedProduct?.tipeBarang === "ACCESSORIES" && (
                            <IconPickerField
                                label="Pilih Icon Produk"
                                value={selectedProduct?.icon || ""}
                                onChange={(name) => setSelectedProduct({ ...selectedProduct, icon: name })}
                            />
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-2">
                            <InputField
                                label="Harga Pokok" name="hargaPokok" type="number"
                                placeholder="15000"
                                defaultValue={selectedProduct?.hargaPokok || ""}
                            />
                            <InputField
                                label="Harga Jual" name="hargaJual" type="number"
                                placeholder="20000"
                                defaultValue={selectedProduct?.hargaJual || ""}
                            />
                        </div>
                        <div className="flex gap-4 mt-8">
                            <button
                                type="button"
                                onClick={() => setModalConfig({ isOpen: false, type: modalConfig.type })}
                                className="flex-1 py-3 border-2 border-line rounded-lg text-sm font-semibold text-txtNav hover:bg-cardBG transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                className="flex-1 py-3 bg-button hover:bg-button2 rounded-lg text-sm font-semibold text-black transition"
                            >
                                Simpan Produk
                            </button>
                        </div>
                    </form>
                </Modal>

                <WarningModal
                    isOpen={isStatusOpen}
                    onClose={() => setIsStatusOpen(false)}
                    onConfirm={() => confirmStatusChange()}
                    title={statusTarget?.isActive ? "Stop Jual Produk?" : "Jual Kembali Produk?"}
                    message={
                        statusTarget?.isActive
                            ? "Anda yakin ingin menonaktifkan produk ini? Produk yang nonaktif tidak akan muncul lagi di transaksi Penjualan, Pembelian, Mutasi, dan Stock Opname."
                            : "Anda yakin ingin mengaktifkan kembali produk ini? Produk akan muncul lagi di semua transaksi."
                    }
                    confirmText={statusTarget?.isActive ? "Ya, Hentikan" : "Ya, Jual Kembali"}
                    isLoading={isUpdatingStatus}
                />

                <DeleteModal
                    itemType="Product"
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemName={productToDelete?.name}
                    isLoading={isLoading}
                />
                <SuccessModal
                    isOpen={isSuccessOpen}
                    onClose={() => setIsSuccessOpen(false)}
                    message={successMessage}
                />
            </div>
        </div>
    );
};

export default KelolaInventoryAdmin;