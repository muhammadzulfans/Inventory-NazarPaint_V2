import React, { useState, useRef, useEffect, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { FiChevronDown } from "react-icons/fi";

// Nama export yang bukan komponen icon (utility internal lucide-react), jangan ikut dicari
const EXCLUDED_EXPORTS = new Set(["createLucideIcon", "icons", "default"]);

const ALL_ICON_NAMES = Object.keys(LucideIcons)
    .filter((name) => !EXCLUDED_EXPORTS.has(name) && /^[A-Z]/.test(name) && LucideIcons[name])
    .sort();

const IconPickerField = ({ label, value, onChange, placeholder = "Cari icon... (misal: paint, brush, roller)" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const wrapperRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredNames = useMemo(() => {
        if (!query) return ALL_ICON_NAMES.slice(0, 50); // batasi render awal biar gak berat
        const q = query.toLowerCase();
        return ALL_ICON_NAMES.filter((name) => name.toLowerCase().includes(q)).slice(0, 50);
    }, [query]);

    const SelectedIcon = value ? LucideIcons[value] : null;

    const handleSelect = (name) => {
        onChange(name);
        setIsOpen(false);
        setQuery("");
    };

    return (
        <div className="relative font-inter" ref={wrapperRef}>
            {label && <label className="block text-sm font-medium text-black mb-1.5">{label}</label>}

            <div
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-lg px-4 h-11 cursor-pointer gap-3"
            >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                    {SelectedIcon ? (
                        <>
                            <SelectedIcon size={20} className="text-black shrink-0" />
                            <span className="text-sm text-black truncate">{value}</span>
                        </>
                    ) : (
                        <span className="text-sm text-gray-400 truncate">Belum pilih icon</span>
                    )}
                </div>
                <FiChevronDown size={18} className={`text-gray-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-white shadow-xl rounded-2xl border border-gray-100 p-3">
                    <input
                        type="text"
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={placeholder}
                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-buttonBlue mb-2"
                    />
                    <div className="max-h-64 overflow-y-auto grid grid-cols-4 gap-2">
                        {filteredNames.length === 0 ? (
                            <p className="col-span-4 text-center text-xs text-gray-400 py-4">Icon tidak ditemukan</p>
                        ) : (
                            filteredNames.map((name) => {
                                const Icon = LucideIcons[name];
                                return (
                                    <button
                                        type="button"
                                        key={name}
                                        onClick={() => handleSelect(name)}
                                        title={name}
                                        className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-auth transition ${
                                            value === name ? "bg-auth" : ""
                                        }`}
                                    >
                                        <Icon size={20} />
                                        <span className="text-[10px] text-gray-500 truncate w-full text-center">{name}</span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default IconPickerField;