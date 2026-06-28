import { useState, useEffect } from "react";
import { userService } from "../../../api/services/userService.js";
import { FiUser, FiMail } from "react-icons/fi";
import { MdOutlineAdminPanelSettings } from "react-icons/md";
import { PiHardHat } from "react-icons/pi";

// Import Reusable
import InputField from "../../../components/forms/InputField.jsx";
import PasswordField from "../../../components/forms/PasswordField.jsx";
import SelectField from "../../../components/forms/SelectField.jsx";
import Modal from "../../../components/modals/Modal.jsx";
import TableListUsers from "../../../components/tables/AdminLayouts/TableListUsers.jsx";
import SuccessModal from "../../../components/modals/SuccessModal.jsx";
import DeleteModal from "../../../components/modals/DeleteModal.jsx";

const CreateAkun = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // State khusus Delete Modal
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // State untuk Modal & Form
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'ADD', data: null });
    const [formData, setFormData] = useState({ name: "", email: "", password: "", jabatan: "" });

    // State khusus Success Modal
    const [isSuccessOpen, setIsSuccessOpen] = useState(false); // <-- 2. State untuk buka/tutup success modal
    const [successMessage, setSuccessMessage] = useState(""); // <-- 3. State untuk pesan sukses dinamis

    const fetchUsers = async () => {
        const res = await userService.getAllUsers();
        if (res?.success) setUsers(res.data);
    };

    useEffect(() => { fetchUsers(); }, []);

    const openModal = (type, data = null) => {
        setModalConfig({ isOpen: true, type, data });
        if (type === 'EDIT' && data) {
            setFormData({ name: data.name, email: data.email, password: "", jabatan: data.jabatan });
        } else {
            setFormData({ name: "", email: "", password: "", jabatan: "" });
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            if (modalConfig.type === 'ADD') {
                await userService.createUser(formData);
                setSuccessMessage("Data berhasil ditambahkan."); // <-- Set pesan untuk create
            } else {
                await userService.updateUser(modalConfig.data.id, formData);
                setSuccessMessage("Data berhasil diperbarui."); // <-- Set pesan untuk edit
            }

            setModalConfig({ ...modalConfig, isOpen: false });
            setIsSuccessOpen(true); // <-- 4. Triger modal sukses agar muncul
            fetchUsers();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data");
        } finally {
            setIsLoading(false);
        }
    };

    // Fungsi Trigger saat tombol sampah di klik
    const triggerDelete = (user) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    // Fungsi Eksekusi Hapus ke Backend
    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            await userService.deleteUser(selectedUser.id);
            setIsDeleteOpen(false);
            setSuccessMessage("Data berhasil dihapus."); // <-- Opsional: jika ingin popup sukses saat hapus juga
            setIsSuccessOpen(true); // <-- Opsional: triger modal sukses setelah hapus
            fetchUsers(); // Refresh tabel
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data");
        } finally {
            setIsLoading(false);
        }
    };

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

                {/* DELETE MODAL REUSABLE */}
                <DeleteModal
                    itemType="Akun"
                    isOpen={isDeleteOpen}
                    onClose={() => setIsDeleteOpen(false)}
                    onConfirm={handleConfirmDelete}
                    itemName={selectedUser?.name}
                    isLoading={isLoading}
                />

                {/* SUCCESS MODAL REUSABLE */}
                <SuccessModal
                    isOpen={isSuccessOpen}
                    onClose={() => setIsSuccessOpen(false)}
                    message={successMessage}
                />

                <TableListUsers
                    users={users}
                    onEdit={(u) => openModal('EDIT', u)}
                    onDelete={triggerDelete} // Lempar fungsi trigger ke table
                    isLoading={isLoading}
                    paginationProps={{ currentPage: 1, itemsPerPage: 10 }}
                />
            </div>

            {/* MODAL REUSABLE */}
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

                    <SelectField
                        label="Jabatan"
                        selectedValue={formData.jabatan}
                        onChange={(val) => setFormData({...formData, jabatan: val})}
                        options={[
                            { value: 'EMPLOYEE', label: 'Karyawan', sub: 'Akses Operasional', icon: <PiHardHat size={20}/> },
                            { value: 'MANAGEMENT', label: 'Management', sub: 'Akses Penuh', icon: <MdOutlineAdminPanelSettings size={20}/> }
                        ]}
                    />

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