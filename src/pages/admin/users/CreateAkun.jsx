import { useState, useEffect } from "react";
import { userService } from "../../../api/services/userService.js";
import { storeService } from "../../../api/services/storeService.js";
import { FiUser, FiMail } from "react-icons/fi";

import InputField from "../../../components/forms/InputField.jsx";
import PasswordField from "../../../components/forms/PasswordField.jsx";
import Modal from "../../../components/modals/Modal.jsx";
import TableListUsers from "../../../components/tables/AdminLayouts/TableListUsers.jsx";
import TablePagination from "../../../components/ui/TablePagination.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import DropDownField from "../../../components/forms/DropDownField.jsx";

const initialForm = { name: "", email: "", password: "", jabatan: "EMPLOYEE", storeId: "" };

const CreateAkun = () => {
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'ADD', data: null });
    const [formData, setFormData] = useState(initialForm);

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    // === STATE PAGINATION ===
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);

    const fetchUsers = async () => {
        const res = await userService.getAllUsers();
        if (res?.success) setUsers(res.data);
    };

    const fetchStores = async () => {
        const res = await storeService.getAll();
        if (res?.success) setStores(res.data);
    };

    useEffect(() => { fetchUsers(); fetchStores(); }, []);

    const openModal = (type, data = null) => {
        setError("");
        setModalConfig({ isOpen: true, type, data });
        if (type === 'EDIT' && data) {
            setFormData({
                name: data.name,
                email: data.email,
                password: "",
                jabatan: data.jabatan,
                storeId: data.stores?.[0]?.store?.id || "",
            });
        } else {
            setFormData({ ...initialForm, jabatan: "EMPLOYEE" });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        const role = formData.jabatan === "MANAGEMENT" ? "OWNER" : "KARYAWAN";

        if (role === "KARYAWAN" && !formData.storeId) {
            setError("Karyawan wajib memiliki cabang toko");
            return;
        }

        setIsLoading(true);
        try {
            const payload = { ...formData, role };
            if (!payload.password) delete payload.password;

            if (modalConfig.type === 'ADD') {
                await userService.createUser(payload);
                setSuccessMessage("Data berhasil ditambahkan.");
            } else {
                await userService.updateUser(modalConfig.data.id, payload);
                setSuccessMessage("Data berhasil diperbarui.");
            }

            setModalConfig({ ...modalConfig, isOpen: false });
            setIsSuccessOpen(true);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusChange = async (user, newStatus) => {
        setIsLoading(true);
        try {
            await userService.updateStatus(user.id, newStatus);

            const statusMessages = {
                ACTIVE: `Akun ${user.name} berhasil diaktifkan.`,
                INACTIVE: `Akun ${user.name} berhasil dinonaktifkan.`,
                RESIGN: `Akun ${user.name} berhasil diubah menjadi resign.`,
            };

            setSuccessMessage(statusMessages[newStatus] || `Status akun berhasil diubah.`);
            setIsSuccessOpen(true);
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal mengubah status akun");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRowsPerPageChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1);
    };

    // === PAGINASI CLIENT-SIDE ===
    const totalPages = Math.ceil(users.length / limit) || 1;
    const paginatedUsers = users.slice((page - 1) * limit, page * limit);

    return (
        <div className="px-8 pt-6 pb-10 bg-white min-h-screen">
            <h1 className="text-3xl font-inter font-medium text-black">Management Akun</h1>

            <div className="bg-card py-7 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)] mt-10 font-inter">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-medium">List Users</h2>
                    <button onClick={() => openModal('ADD')} className="bg-button px-5 py-2.5 rounded-lg font-semibold">
                        + Tambah Akun
                    </button>
                </div>

                <SuccessModal
                    isOpen={isSuccessOpen}
                    onClose={() => setIsSuccessOpen(false)}
                    message={successMessage}
                />

                {/* === TABEL + PAGINATION — PERSIS SEPERTI OrderAdmin === */}
                <div className="overflow-x-auto bg-white pb-5 rounded-xl">
                    {error ? (
                        <p className="text-center py-10 text-red-400">{error}</p>
                    ) : (
                        <TableListUsers
                            users={paginatedUsers}
                            onEdit={(u) => openModal('EDIT', u)}
                            onStatusChange={handleStatusChange}
                            isLoading={isLoading}
                            currentPage={page}
                            itemsPerPage={limit}
                        />
                    )}
                    <TablePagination
                        currentPage={page}
                        totalPages={totalPages}
                        rowsPerPage={limit}
                        onPageChange={setPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </div>
            </div>

            <Modal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                title={modalConfig.type === 'ADD' ? "Tambah Akun Baru" : "Edit Akun Pengguna"}
            >
                <form onSubmit={handleSave} className="space-y-5">
                    {error && <div className="text-red-500 text-sm">{error}</div>}

                    <InputField
                        label="Nama Lengkap" icon={FiUser} placeholder="Budi Santoso"
                        value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />

                    <InputField
                        label="Email" icon={FiMail} type="email" placeholder="busan@email.com"
                        value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />

                    <PasswordField
                        label={modalConfig.type === 'EDIT' ? "Password (Kosongkan jika tidak diubah)" : "Password"}
                        placeholder="********"
                        value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />

                    {formData.jabatan !== "MANAGEMENT" && (
                        <DropDownField
                            label="Cabang Toko"
                            value={formData.storeId}
                            onChange={(val) => setFormData({...formData, storeId: val})}
                            options={stores.map(s => ({ value: s.id, label: s.name }))}
                            placeholder="Pilih Cabang Toko"
                            maxVisibleItems={2}
                        />
                    )}

                    <div className="flex gap-4 mt-8 font-inter font-semibold">
                        <button type="button" onClick={() => setModalConfig({ ...modalConfig, isOpen: false })} className="flex-1 py-3 border rounded-lg">Batal</button>
                        <button type="submit" className="flex-1 py-3 bg-button rounded-lg">Simpan</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default CreateAkun;