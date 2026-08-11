import { FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";

const TableStores = ({
                         stores,
                         onEdit,
                         onDelete,
                         onDetail,
                         isLoading,
                         currentPage,
                         itemsPerPage,
                     }) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="bg-cardBG">
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3 rounded-l-lg w-12">No</th>
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Kode</th>
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Nama Cabang</th>
                    <th className="text-left text-sm font-inter font-semibold text-black px-5 py-3">Alamat</th>
                    <th className="text-center text-sm font-inter font-semibold text-black px-5 py-3">Karyawan</th>
                    <th className="text-center text-sm font-inter font-semibold text-black px-5 py-3">Stok</th>
                    <th className="text-center text-sm font-inter font-semibold text-black px-5 py-3 rounded-r-lg w-32">Aksi</th>
                </tr>
                </thead>
                <tbody>
                {stores.length > 0 ? (
                    stores.map((store, index) => (
                        <tr key={store.id} className="border-b border-line last:border-none hover:bg-white/50 transition">
                            <td className="text-sm font-inter text-black px-5 py-4">
                                {(currentPage - 1) * itemsPerPage + (index + 1)}
                            </td>
                            <td className="text-sm font-inter text-black px-5 py-4 font-mono text-gray-600">
                                {store.code || "-"}
                            </td>
                            <td className="text-sm font-inter text-black px-5 py-4 font-medium">
                                {store.name}
                            </td>
                            <td className="text-sm font-inter text-black px-5 py-4 max-w-[200px] truncate">
                                {store.address || "-"}
                            </td>
                            <td className="text-sm font-inter text-black px-5 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">
                                        <FiUsers className="size-3" />
                                        {store._count?.users || 0}
                                    </span>
                            </td>
                            <td className="text-sm font-inter text-black px-5 py-4 text-center">
                                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                                        {store._count?.stocks || 0}
                                    </span>
                            </td>
                            <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onEdit(store)}
                                        className="w-8 h-8 flex items-center justify-center bg-buttonBlue rounded-lg hover:opacity-80 transition"
                                    >
                                        <FiEdit2 className="size-4 text-white" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(store)}
                                        className="w-8 h-8 flex items-center justify-center bg-trash rounded-lg hover:opacity-80 transition"
                                    >
                                        <FiTrash2 className="size-4 text-white" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7" className="text-center py-10 text-gray-500 font-inter">
                            {isLoading ? "Sedang memuat data..." : "Tidak ada data cabang toko."}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default TableStores;