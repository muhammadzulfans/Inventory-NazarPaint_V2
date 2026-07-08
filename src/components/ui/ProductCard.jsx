// src/components/ui/ProductCard.jsx
import React from "react";
import { FiPlus } from "react-icons/fi";
import { formatRupiah } from "../../dummy/dataAdmin/Data/salesTableData.js";

const ProductCard = ({ product, onAddToCart }) => {
    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-4">
            <div className="flex items-start gap-4">
                {/* MODIFIKASI DISINI: Menggunakan style inline backgroundColor dari Hexa hasil mapping */}
                <div
                    className="w-14 h-14 rounded-xl flex-shrink-0 border border-gray-200"
                    style={{ backgroundColor: product.hexColor }}
                ></div>

                <div className="flex-1 space-y-0.5">
                    <h3 className="font-inter font-semibold text-base text-black truncate">
                        {product.name}
                    </h3>
                    <p className="text-xs font-inter text-gray-500 uppercase">
                        {product.type} ({product.code})
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2">
                <div className="space-y-0.5">
                    <p className="text-lg font-inter font-bold text-black">
                        {formatRupiah(product.price)}
                    </p>
                    <p className="text-xs font-inter text-gray-500">
                        per {product.unit}
                    </p>
                </div>
                <div
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        product.stock > 10
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    Stok {product.stock}
                </div>
            </div>

            <button
                onClick={() => onAddToCart(product)}
                className="w-full flex items-center justify-center gap-2 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-inter font-medium text-black transition"
            >
                <FiPlus />
                Tambah
            </button>
        </div>
    );
};

export default ProductCard;