import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import TablePagination from "../../ui/TablePagination.jsx";

const TableListUsers = ({ users, onDelete, onEdit, isLoading, paginationProps }) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="bg-cardBG">
                        <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3 rounded-l-lg">No</th>
                        <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Nama</th>
                        <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Email</th>
                        <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Jabatan</th>
                        <th className="text-center text-sm font-inter font-semibold text-black px-5 py-3 rounded-r-lg">Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.length > 0 ? (
                        users.map((user, index) => (
                            <tr key={user.id} className="border-b border-line last:border-none hover:bg-white/50 transition">
                                <td className="text-sm font-inter text-black px-5 py-4">
                                    {/* Logika nomor urut berdasarkan page */}
                                    {(paginationProps.currentPage - 1) * paginationProps.itemsPerPage + (index + 1)}
                                </td>
                                <td className="text-sm font-inter text-black px-5 py-4">{user.name}</td>
                                <td className="text-sm font-inter text-black px-5 py-4">{user.email}</td>
                                <td className="px-5 py-4">
                    <span className={`text-xs font-inter font-semibold py-1 rounded-full ${
                        user.jabatan === "MANAGEMENT" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {user.jabatan === "MANAGEMENT" ? "Management" : "Karyawan"}
                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-center gap-3">
                                        <button onClick={() => onEdit(user)} className="w-8 h-8 flex items-center justify-center bg-buttonBlue rounded-lg hover:opacity-80 transition">
                                            <FiEdit2 className="size-4 text-white" />
                                        </button>
                                        <button
                                            onClick={() => onDelete(user)}
                                            className="w-8 h-8 flex items-center justify-center bg-trash rounded-lg hover:opacity-80 transition"
                                        >
                                            <RiDeleteBin6Line className="size-4 text-white" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center py-10 text-gray-500 font-inter">
                                {isLoading ? "Sedang memuat data..." : "Tidak ada data pengguna."}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Panggil Pagination Disini */}
            {!isLoading && users.length > 0 && (
                <TablePagination {...paginationProps} />
            )}
        </div>
    );
};

export default TableListUsers;