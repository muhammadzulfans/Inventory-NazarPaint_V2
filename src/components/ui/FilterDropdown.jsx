import React, { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FilterDropdown = ({
                            icon: Icon,
                            options,
                            value,
                            onChange,
                            label,
                            className = "",
                            triggerClassName = "",
                            menuClassName = "",
                            optionClassName = "",
                            maxHeight = 240, // dalam pixel, default sama kayak max-h-60 sebelumnya
                        }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label;

    return (
        <div className={`relative ${className}`}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center justify-between bg-white px-5 rounded-full cursor-pointer shadow-[0_4px_4px_rgba(0,0,0,0.1)] gap-3 ${triggerClassName}`}
            >
                <div className="flex items-center gap-3 h-11 text-sm font-inter font-normal text-black min-w-0 flex-1">
                    {Icon && <Icon className="text-gray-500 size-5 shrink-0" />}
                    <span
                        className={`truncate ${!value ? "text-gray-500" : "text-black"}`}
                        title={selectedLabel || label}
                    >
                        {selectedLabel || label}
                    </span>
                </div>
                <FiChevronDown
                    size={18}
                    className={`text-gray-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                />
            </div>

            {isOpen && (
                <>
                    <ul
                        style={{ maxHeight: `${maxHeight}px` }}
                        className={`absolute z-50 w-full mt-2 bg-white shadow-xl rounded-2xl overflow-y-auto border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-200 ${menuClassName}`}
                    >
                        {options.map((opt) => (
                            <li
                                key={opt.value}
                                onClick={() => {
                                    if (opt.disabled) return;
                                    onChange(opt.value);
                                    setIsOpen(false);
                                }}
                                title={opt.label}
                                className={`px-5 py-3 text-sm truncate transition-colors ${
                                    opt.disabled
                                        ? "text-gray-300 cursor-not-allowed bg-gray-50"
                                        : "text-black hover:bg-auth hover:font-bold cursor-pointer"
                                } ${optionClassName}`}
                            >
                                {opt.label}
                            </li>
                        ))}
                    </ul>
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
                </>
            )}
        </div>
    );
};

export default FilterDropdown;