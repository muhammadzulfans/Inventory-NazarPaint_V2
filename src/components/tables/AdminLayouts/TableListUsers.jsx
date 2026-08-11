import { useState, useRef, useEffect } from "react";
import { FiEdit2, FiCheck, FiX, FiUserX } from "react-icons/fi";

const STATUS_BADGE_CLASS = {
    PENDING: "bg-yellow-100 text-yellow-700",
    ACTIVE: "bg-green-100 text-green-700",
    INACTIVE: "bg-gray-100 text-gray-600",
    RESIGN: "bg-red-100 text-red-600",
};

const STATUS_LABEL = {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
    RESIGN: "RESIGN",
};

const STATUS_OPTIONS = {
    PENDING: [
        { value: "ACTIVE", label: "ACTIVE", icon: FiCheck, color: "text-green-700", hover: "hover:bg-green-50" },
    ],
    ACTIVE: [
        { value: "INACTIVE", label: "INACTIVE", icon: FiUserX, color: "text-gray-600", hover: "hover:bg-gray-50" },
        { value: "RESIGN", label: "RESIGN", icon: FiX, color: "text-red-600", hover: "hover:bg-red-50" },
    ],
    INACTIVE: [
        { value: "ACTIVE", label: "ACTIVE", icon: FiCheck, color: "text-green-700", hover: "hover:bg-green-50" },
    ],
    RESIGN: [],
};

const TableListUsers = ({ users, onStatusChange, onEdit, isLoading, currentPage, itemsPerPage }) => {
    const [openPopupKey, setOpenPopupKey] = useState(null);
    const popupRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target)) {
                setOpenPopupKey(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="bg-cardBG">
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3 rounded-l-lg">No</th>
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Nama</th>
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Email</th>
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Cabang</th>
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Status</th>
                    <th className="text-center text-sm font-inter font-semibold text-black px-5 py-3 rounded-r-lg">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {users.length > 0 ? (
                    users.map((user, index) => {
                        const options = STATUS_OPTIONS[user.status] || [];
                        const isPopupOpen = openPopupKey === user.id;

                        return (
                            <tr key={user.id} className="border-b border-line last:border-none hover:bg-white/50 transition">
                                <td className="text-sm font-inter text-black px-5 py-4">
                                    {(currentPage - 1) * itemsPerPage + (index + 1)}
                                </td>
                                <td className="text-sm font-inter text-black px-5 py-4">{user.name}</td>
                                <td className="text-sm font-inter text-black px-5 py-4">{user.email}</td>
                                <td className="text-sm font-inter text-black px-5 py-4">
                                    {user.stores?.[0]?.store?.name || "-"}
                                </td>
                                <td className="p-3 text-center relative">
                                    {options.length > 0 ? (
                                        <>
                                            <button
                                                onClick={() => setOpenPopupKey(isPopupOpen ? null : user.id)}
                                                className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md hover:opacity-80 transition-all cursor-pointer ${STATUS_BADGE_CLASS[user.status]}`}
                                                title="Klik untuk ubah status"
                                            >
                                                {STATUS_LABEL[user.status]}
                                            </button>

                                            {isPopupOpen && (
                                                <div
                                                    ref={popupRef}
                                                    className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-40"
                                                >
                                                    {options.map((opt, idx) => {
                                                        const Icon = opt.icon;
                                                        return (
                                                            <button
                                                                key={opt.value}
                                                                onClick={() => {
                                                                    setOpenPopupKey(null);
                                                                    onStatusChange && onStatusChange(user, opt.value);
                                                                }}
                                                                className={`w-full text-left px-3 py-2.5 text-xs font-semibold ${opt.color} ${opt.hover} flex items-center gap-2 transition ${idx > 0 ? "border-t border-gray-100" : ""}`}
                                                            >
                                                                <Icon size={14} /> {opt.label}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <span className={`uppercase text-xs font-semibold px-3 py-1.5 rounded-md ${STATUS_BADGE_CLASS[user.status]}`}>
                                                {STATUS_LABEL[user.status]}
                                            </span>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button
                                            onClick={() => onEdit(user)}
                                            className="w-8 h-8 flex items-center justify-center bg-buttonBlue rounded-lg hover:opacity-80 transition"
                                        >
                                            <FiEdit2 className="size-4 text-white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center py-10 text-gray-500 font-inter">
                            {isLoading ? "Sedang memuat data..." : "Tidak ada data pengguna."}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TableListUsers;