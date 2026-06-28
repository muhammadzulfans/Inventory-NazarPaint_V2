import React from "react";
import { FiCalendar } from "react-icons/fi";

const DateField = ({ label, value, onChange }) => (
    <div className="font-inter">
        <label className="block text-sm font-inter font-medium text-black mb-1.5">{label}</label>
        <div className="flex items-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-lg px-4 py-3 gap-3 border border-transparent focus-within:border-auth transition-all">
            <FiCalendar className="text-txtNav size-5 shrink-0" />
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 text-sm font-inter text-black outline-none bg-transparent placeholder:text-line"
            />
        </div>
    </div>
);

export default DateField;