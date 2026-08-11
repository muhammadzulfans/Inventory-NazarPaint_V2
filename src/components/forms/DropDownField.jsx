import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const DropDownField = ({ label, icon: Icon, options, value, onChange, placeholder, maxVisibleItems }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label;

    // Kalau maxVisibleItems dikasih, batasi tinggi list & aktifkan scroll.
    // Kalau gak dikasih, behavior lama (tampil semua, gak scroll).
    const listStyle = maxVisibleItems
        ? { maxHeight: `${maxVisibleItems * 44}px`, overflowY: "auto" }
        : {};

    return (
        <div className="font-inter relative text-left">
            <label className="block text-sm font-medium text-black mb-1.5">{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center h-12 pl-12 pr-10 bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-lg text-sm cursor-pointer border-2 transition-all ${isOpen ? "border-auth" : "border-transparent"}`}
            >
                <div className="absolute left-4 text-txtNav">
                    {Icon && <Icon size={20} />}
                </div>
                <span className={!value ? "text-line" : "text-black"}>
                    {selectedLabel || placeholder || "Pilih..."}
                </span>
                <div className="absolute right-4 text-gray-500">
                    <FiChevronDown size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </div>
            </div>
            {isOpen && (
                <ul
                    style={listStyle}
                    className="absolute z-50 w-full mt-2 bg-white shadow-xl rounded-lg border border-line animate-in fade-in slide-in-from-top-2 duration-200"
                >
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
            )}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
};
export default DropDownField;