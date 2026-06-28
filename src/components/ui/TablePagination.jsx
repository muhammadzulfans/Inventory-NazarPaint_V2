import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const TablePagination = ({
                             currentPage,
                             totalPages,
                             onPageChange,
                             rowsPerPage,
                             onRowsPerPageChange
                         }) => {
    return (
        <div className="flex justify-end items-center gap-3 mt-6 text-sm font-inter pr-5">
            {/* Tombol Icon Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="border rounded-lg p-2 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
                <FiChevronLeft />
            </button>

            {/* Tombol Teks Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="border rounded-lg px-3 py-1 disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
                Prev
            </button>

            {/* Tombol Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="bg-buttonBlue text-white px-4 py-1 rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
                Next
            </button>

            {/* Input Page Direct */}
            <div className="flex items-center gap-2">
                <span>Page:</span>
                <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : 1;
                        const finalVal = Math.max(1, Math.min(totalPages, val));
                        onPageChange(finalVal);
                    }}
                    className="w-14 border rounded-lg px-2 py-1 text-center outline-none focus:ring-1 focus:ring-buttonBlue"
                />
                <span>of {totalPages || 1}</span>
            </div>

            {/* Select Rows per Page */}
            <select
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                className="bg-white border rounded-lg px-1 py-1 outline-none cursor-pointer hover:border-buttonBlue transition-colors"
            >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
            </select>
        </div>
    );
};

export default TablePagination;