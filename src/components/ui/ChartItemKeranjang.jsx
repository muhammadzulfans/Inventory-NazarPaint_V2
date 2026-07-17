import React from "react";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";
import { formatRupiah } from "../../Data/DropdownOptions.jsx";

const ChartItemKeranjang = ({ item, onUpdateQuantity, onRemoveFromCart }) => {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex-shrink-0 bg-pink-400 ${item.hexColor}`}>color</div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-inter font-semibold text-black truncate">
                    {item.name}
                </p>
                <p className="text-xs font-inter text-gray-500">
                    {formatRupiah(item.price)}
                </p>
            </div>
            <div className="flex items-center gap-1.5 border border-gray-200 rounded-full p-0.5">
                <button
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                >
                    <FiMinus size={14} />
                </button>
                <span className="text-sm font-inter font-semibold text-black w-5 text-center">
                    {item.quantity}
                </span>
                <button
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600"
                >
                    <FiPlus size={14} />
                </button>
            </div>
            <button
                onClick={() => onRemoveFromCart(item.id)}
                className="text-gray-400 hover:text-red-500 ml-1 flex-shrink-0"
            >
                <FiTrash2 size={18} />
            </button>
        </div>
    );
};

export default ChartItemKeranjang;