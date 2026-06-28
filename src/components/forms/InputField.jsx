import React from "react";

const InputField = ({ label, icon: Icon, ...props }) => (
    <div className="font-inter">
        <label className="block text-sm font-inter font-medium text-black mb-1.5">{label}</label>
        <div className="flex items-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-lg px-4 py-3 gap-3 border border-transparent focus-within:border-auth transition-all">
            {Icon && <Icon className="text-txtNav size-5 shrink-0" />}
            <input
                className="flex-1 text-sm font-inter text-black outline-none bg-transparent placeholder:text-line"
                {...props}
            />
        </div>
    </div>
);

export default InputField;