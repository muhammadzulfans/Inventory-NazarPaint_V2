import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FilterDropdown = ({ icon: Icon, options, value, onChange, label , className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Cari label dari value yang dipilih
    const selectedLabel = options.find(opt => opt.value === value)?.label;

    return (
        <div className={`relative ${className}`}>
            {/* BOX UTAMA - Desain disesuaikan dengan SearchFilter kamu */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between bg-gray-200 px-8 py-4 rounded-2xl cursor-pointer min-w-[200px]"
            >
                <div className="flex items-center gap-4 text-lg font-inter font-normal text-black">
                    {Icon && <Icon className="text-gray-400 size-5" />}
                    <span className={!value ? "text-gray-500" : "text-black"}>
                        {selectedLabel || label}
                    </span>
                </div>

                <FiChevronDown
                    size={20}
                    className={`text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {/* LIST DROPDOWN */}
            {isOpen && (
                <>
                    <ul className="absolute z-50 w-full mt-2 bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200">
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => {
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                className="px-5 py-3 text-sm text-black hover:bg-auth hover:font-bold cursor-pointer transition-colors"
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                </>
            )}
        </div>
    );
};

export default FilterDropdown;