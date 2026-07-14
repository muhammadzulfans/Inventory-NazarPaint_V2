import React from "react";
import { FiTrash2 } from "react-icons/fi";

const TableOrderItems = ({ orderItems, removeOrderItem, onEditItem, editingItemIndex, totalUnitItems, totalJenisProduk, totalOrderAmount }) => {
    return (
        <div className="bg-white text-black rounded-2xl shadow-[0_4px_4px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
            <div className="flex justify-between items-center px-6 py-5">
                <h2 className="font-inter font-medium text-lg">Daftar Item Pesanan</h2>
                <span className="text-xs text-gray-500 font-medium">{totalJenisProduk} item</span>
            </div>
            <hr className="border-cardBG" />

            {orderItems.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-16 px-6">
                    <p className="text-xs text-gray-500 font-medium">Belum ada item. Tambahkan produk di sebelah kanan.</p>
                </div>
            ) : (
                <div className="flex flex-col w-full">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left align-middle font-inter">
                            <thead className="bg-card text-black font-semibold tracking-wider text-center">
                            <tr>
                                <th className="p-4 w-12 text-center border-l border-cardBG">No.</th>
                                <th className="p-4 border-l border-cardBG">Produk</th>
                                <th className="p-4 border-l border-cardBG">Kuantitas</th>
                                <th className="p-4 border-l border-cardBG">Harga Satuan</th>
                                <th className="p-4 border-l border-cardBG">Subtotal Harga</th>
                                <th className="p-4 text-center border-x border-cardBG">Aksi</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-cardBG text-black">
                            {orderItems.map((item, idx) => (
                                <tr
                                    key={idx}
                                    onClick={() => onEditItem(idx)}
                                    className={`cursor-pointer transition-colors ${editingItemIndex === idx ? "bg-gray-100" : "hover:bg-gray-50/50"}`}
                                >
                                    <td className="p-4 text-center text-gray-500 font-medium">{idx + 1}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-7 h-7 bg-slate-300 rounded-full flex-shrink-0"></div>
                                            <div>
                                                <p className="font-bold text-black text-sm">{item.namaBarang}</p>
                                                <p className="text-xxs text-gray-500 font-medium capitalize">{item.type}</p>
                                                <p className="text-xxs text-gray-500 font-medium capitalize">{item.kode}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-black">{item.quantity} Kg</td>
                                    <td className="p-4 font-bold text-black">Rp {item.basePrice.toLocaleString("id-ID")}</td>
                                    <td className="p-4 font-bold text-black">
                                        <span className="text-xs font-semibold text-black bg-green-100 px-2.5 py-1 rounded-md">
                                            Rp. {item.totalPrice.toLocaleString("id-ID")}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => removeOrderItem(idx)}
                                            className="text-trash hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <FiTrash2 className="size-7 p-1 border border-current rounded-md transition" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="px-6 py-4 border-t border-cardBG flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs font-bold font-inter text-black">
                        <div className="flex gap-4">
                            <p>Total Kuantitas: <span className="font-extrabold bg-gray-100 rounded-lg px-2 py-1">{totalUnitItems} Kg</span></p>
                            <p>Total Item: <span className="font-extrabold bg-gray-100 rounded-lg px-2 py-1">{totalJenisProduk} Item</span></p>
                        </div>
                        <div className="text-sm">
                            Total: <span className="font-extrabold text-black bg-green-100 px-2.5 py-1 rounded-md">Rp {totalOrderAmount.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableOrderItems;