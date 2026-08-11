import { useState } from "react";
import {FiSearch, FiPlus, FiMapPin, FiHash, FiX, FiUserPlus, FiShoppingBag} from "react-icons/fi";
import { useStoreManagement } from "../../../hooks/admin/useStoreManagement.js";
import InputField from "../../../components/forms/InputField.jsx";
import Modal from "../../../components/modals/Modal.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import TableStores from "../../../components/tables/AdminLayouts/TableStores.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import DropDownField from "../../../components/forms/DropDownField.jsx";

const KelolaStores = () => {
    const {
        stores, users, selectedStore,
        isLoading, error,
        search, setSearch, page, setPage, limit, setLimit, pagination,
        isDeleteOpen, setIsDeleteOpen,
        isDetailOpen, setIsDetailOpen,
        isAssignOpen, setIsAssignOpen,
        modalConfig, setModalConfig,
        formData, setFormData,
        isSuccessOpen, setIsSuccessOpen,
        successMessage,
        assignUserId, setAssignUserId,
        openModal, handleSave,
        triggerDelete, handleConfirmDelete,
        fetchStoreDetail, handleAssignUser, handleUnassignUser,
    } = useStoreManagement();

    const [localSearch, setLocalSearch] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        setSearch(localSearch);
        setPage(1);
    };

    const handleRowsPerPageChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    const availableUsers = selectedStore
        ? users.filter(u =>
            !selectedStore.users?.some(us => us.user.id === u.id)
        )
        : users;

    return (
        <div className="px-8 pt-6 pb-10 bg-white min-h-screen">
            <h1 className="text-3xl font-inter font-medium text-black">Kelola Cabang Toko</h1>

            <div className="bg-card py-7 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)] mt-10 font-inter">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-medium">List Cabang Toko</h2>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={() => openModal('ADD')}
                            className="bg-button px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap"
                        >
                            <FiPlus className="size-4" />
                            Tambah Cabang
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <DeleteModal
                    itemType="Cabang Toko"
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemName={selectedStore?.name}
                    isLoading={isLoading}
                />

                <SuccessModal
                    isOpen={isSuccessOpen}
                    onClose={() => setIsSuccessOpen(false)}
                    message={successMessage}
                />

                <Modal
                    isOpen={isDetailOpen}
                    onClose={() => { setIsDetailOpen(false); setSelectedStore(null); }}
                    title={`Detail Cabang: ${selectedStore?.name}`}
                >
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-xs mb-1">Kode Cabang</p>
                                <p className="font-mono font-semibold text-black">{selectedStore?.code || "-"}</p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-gray-500 text-xs mb-1">Alamat</p>
                                <p className="font-semibold text-black">{selectedStore?.address || "-"}</p>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-sm">Karyawan Terdaftar ({selectedStore?.users?.length || 0})</h3>
                                <button
                                    onClick={() => setIsAssignOpen(true)}
                                    className="text-xs bg-button px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1"
                                >
                                    <FiUserPlus className="size-3" />
                                    Assign Karyawan
                                </button>
                            </div>

                            {selectedStore?.users?.length > 0 ? (
                                <div className="border border-line rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-cardBG">
                                        <tr>
                                            <th className="text-left px-4 py-2 font-semibold">Nama</th>
                                            <th className="text-left px-4 py-2 font-semibold">Email</th>
                                            <th className="text-left px-4 py-2 font-semibold">Role</th>
                                            <th className="text-center px-4 py-2 font-semibold w-16">Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {selectedStore.users.map((us) => (
                                            <tr key={us.id} className="border-t border-line">
                                                <td className="px-4 py-2.5">{us.user.name}</td>
                                                <td className="px-4 py-2.5 text-gray-600">{us.user.email}</td>
                                                <td className="px-4 py-2.5">
                                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                                            us.user.role === 'OWNER'
                                                                ? 'bg-purple-100 text-purple-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            {us.user.role}
                                                        </span>
                                                </td>
                                                <td className="px-4 py-2.5 text-center">
                                                    <button
                                                        onClick={() => handleUnassignUser(us.user.id)}
                                                        disabled={isLoading}
                                                        className="text-red-500 hover:text-red-700 transition"
                                                        title="Lepas karyawan"
                                                    >
                                                        <FiX className="size-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-6 bg-gray-50 rounded-lg text-gray-500 text-sm">
                                    Belum ada karyawan yang terdaftar di cabang ini.
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>

                <Modal
                    isOpen={isAssignOpen}
                    onClose={() => { setIsAssignOpen(false); setAssignUserId(""); }}
                    title="Assign Karyawan ke Cabang"
                >
                    <form onSubmit={handleAssignUser} className="space-y-5">
                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        <DropDownField
                            label="Pilih Karyawan"
                            value={assignUserId}
                            onChange={(val) => setAssignUserId(val)}
                            options={availableUsers.map(u => ({ value: u.id, label: `${u.name} (${u.email})` }))}
                            placeholder="Pilih karyawan..."
                            maxVisibleItems={4}
                        />

                        <div className="flex gap-4 mt-8 font-inter font-semibold">
                            <button
                                type="button"
                                onClick={() => { setIsAssignOpen(false); setAssignUserId(""); }}
                                className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || !assignUserId}
                                className="flex-1 py-3 bg-button rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? "Memproses..." : "Assign Karyawan"}
                            </button>
                        </div>
                    </form>
                </Modal>

                <Modal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    title={modalConfig.type === 'ADD' ? "Tambah Cabang Baru" : "Edit Cabang Toko"}
                >
                    <form onSubmit={handleSave} className="space-y-5">
                        {error && <div className="text-red-500 text-sm">{error}</div>}

                        {modalConfig.type === 'EDIT' && modalConfig.data?.code && (
                            <div className="relative">
                                <label className="block text-sm font-medium text-black mb-1.5">Kode Cabang</label>
                                <div className="flex items-center gap-3 bg-gray-100 px-4 py-3 rounded-lg border border-line">
                                    <FiHash className="text-gray-400 size-4" />
                                    <span className="font-mono text-sm text-gray-600">{modalConfig.data.code}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Kode cabang tidak dapat diubah.</p>
                            </div>
                        )}

                        <InputField
                            label="Nama Cabang"
                            icon={FiShoppingBag}
                            placeholder="Contoh: Cabang Pusat Jakarta"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />

                        <InputField
                            label="Alamat"
                            icon={FiMapPin}
                            placeholder="Jl. Mawar No. 123, Jakarta"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />

                        <div className="flex gap-4 mt-8 font-inter font-semibold">
                            <button
                                type="button"
                                onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
                                className="flex-1 py-3 border rounded-lg hover:bg-gray-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 py-3 bg-button rounded-lg disabled:opacity-50"
                            >
                                {isLoading ? "Menyimpan..." : "Simpan"}
                            </button>
                        </div>
                    </form>
                </Modal>

                {/* === TABEL + PAGINATION — PERSIS SEPERTI OrderAdmin === */}
                <div className="overflow-x-auto bg-white pb-5 rounded-xl">
                    {error ? (
                        <p className="text-center py-10 text-red-400">{error}</p>
                    ) : (
                        <TableStores
                            stores={stores}
                            onEdit={(s) => openModal('EDIT', s)}
                            onDelete={triggerDelete}
                            onDetail={fetchStoreDetail}
                            isLoading={isLoading}
                            currentPage={page}
                            itemsPerPage={limit}
                        />
                    )}
                    <TablePagination
                        currentPage={page}
                        totalPages={pagination.totalPages}
                        rowsPerPage={limit}
                        onPageChange={setPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default KelolaStores;