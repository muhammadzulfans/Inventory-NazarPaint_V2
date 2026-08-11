import { useState, useEffect, useCallback } from "react";
import { storeService } from "../../api/services/storeService.js";
import { userService } from "../../api/services/userService.js";

const initialForm = { name: "", address: "" };

export const useStoreManagement = () => {
    const [stores, setStores] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedStore, setSelectedStore] = useState(null);

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [pagination, setPagination] = useState({ total: 0, totalPages: 0 });

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);

    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'ADD', data: null });
    const [formData, setFormData] = useState(initialForm);

    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const [assignUserId, setAssignUserId] = useState("");

    const fetchStores = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await storeService.getAll({ search, page, limit });
            if (res?.success) {
                setStores(res.data);
                setPagination(res.pagination);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat data cabang");
        } finally {
            setIsLoading(false);
        }
    }, [search, page, limit]);

    const fetchUsers = useCallback(async () => {
        try {
            const res = await userService.getAllUsers();
            if (res?.success) setUsers(res.data);
        } catch (err) {
            console.error("Gagal memuat users", err);
        }
    }, []);

    const fetchStoreDetail = async (id) => {
        setIsLoading(true);
        try {
            const res = await storeService.getById(id);
            if (res?.success) {
                setSelectedStore(res.data);
                setIsDetailOpen(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Gagal memuat detail cabang");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchStores(); }, [fetchStores]);
    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const openModal = (type, data = null) => {
        setError("");
        setModalConfig({ isOpen: true, type, data });
        if (type === 'EDIT' && data) {
            setFormData({ name: data.name, address: data.address || "" });
        } else {
            setFormData(initialForm);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name || formData.name.trim().length < 2) {
            setError("Nama cabang minimal 2 karakter");
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                address: formData.address?.trim() || null
            };

            if (modalConfig.type === 'ADD') {
                await storeService.create(payload);
                setSuccessMessage("Cabang toko berhasil dibuat.");
            } else {
                await storeService.update(modalConfig.data.id, payload);
                setSuccessMessage("Cabang toko berhasil diperbarui.");
            }

            setModalConfig({ ...modalConfig, isOpen: false });
            setIsSuccessOpen(true);
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menyimpan data cabang");
        } finally {
            setIsLoading(false);
        }
    };

    const triggerDelete = (store) => {
        setSelectedStore(store);
        setIsDeleteOpen(true);
    };

    const handleConfirmDelete = async () => {
        setIsLoading(true);
        try {
            await storeService.delete(selectedStore.id);
            setIsDeleteOpen(false);
            setSuccessMessage("Cabang toko berhasil dihapus.");
            setIsSuccessOpen(true);
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menghapus cabang toko");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAssignUser = async (e) => {
        e.preventDefault();
        if (!assignUserId) {
            setError("Pilih karyawan yang akan di-assign");
            return;
        }
        setIsLoading(true);
        try {
            await storeService.assignUser(selectedStore.id, assignUserId);
            setIsAssignOpen(false);
            setAssignUserId("");
            setSuccessMessage("Karyawan berhasil ditambahkan ke cabang.");
            setIsSuccessOpen(true);
            fetchStoreDetail(selectedStore.id);
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal menambahkan karyawan");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnassignUser = async (userId) => {
        setIsLoading(true);
        try {
            await storeService.unassignUser(selectedStore.id, userId);
            setSuccessMessage("Karyawan berhasil dilepas dari cabang.");
            setIsSuccessOpen(true);
            fetchStoreDetail(selectedStore.id);
            fetchStores();
        } catch (err) {
            setError(err.response?.data?.message || "Gagal melepas karyawan");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        stores, users, selectedStore,
        isLoading, error,
        search, setSearch, page, setPage, limit, pagination,
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
    };
};