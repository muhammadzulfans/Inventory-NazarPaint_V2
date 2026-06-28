import React from "react";

const SelectField = ({ label, options, selectedValue, onChange }) => (
    <div className="font-inter">
        <label className="block text-sm font-inter font-medium text-black mb-3">{label}</label>
        <div className="grid grid-cols-2 gap-4">
            {options.map((opt) => (
                <button
                    key={opt.value}
                    type="button"
                    onClick={() => onChange(opt.value)}
                    className={`flex items-center gap-3 bg-white px-4 py-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.12)] transition-all duration-200 ${selectedValue === opt.value ? "ring-2 ring-auth border-auth" : ""}`}
                >
                    <div className="w-10 h-10 bg-iconBG rounded-full flex items-center justify-center shrink-0">
                        {opt.icon}
                    </div>
                    <div className="text-left">
                        <p className="text-sm font-inter font-semibold text-black">{opt.label}</p>
                        <p className="text-xs font-inter text-txtNav">{opt.sub}</p>
                    </div>
                </button>
            ))}
        </div>
    </div>
);

export default SelectField;