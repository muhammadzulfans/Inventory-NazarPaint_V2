import React from "react";
import { FiCalendar } from "react-icons/fi";

const DateField = ({ label, value, onChange, className = "" }) => (
    <div className={`font-inter ${className}`}>
        {label && (
            <label className="block text-xs font-inter font-medium text-gray-500 mb-1.5">
                {label}
            </label>
        )}
        <div className="flex items-center bg-white shadow-[0_4px_4px_rgba(0,0,0,0.1)] rounded-full px-5 h-11 gap-3">
            <FiCalendar className="text-gray-500 size-5 shrink-0" />
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 text-sm font-inter text-black outline-none bg-transparent w-full min-w-0"
            />
        </div>
    </div>
);

export default DateField;