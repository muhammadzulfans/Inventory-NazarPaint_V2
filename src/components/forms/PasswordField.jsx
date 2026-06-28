import React, { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";

const PasswordField = ({ label, ...props }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="font-inter">
            <label className="block text-sm font-inter font-medium text-black mb-1.5">{label}</label>
            <div className="flex items-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.12)] rounded-lg px-4 py-3 gap-3 border border-transparent focus-within:border-auth transition-all">
                <FiLock className="text-txtNav size-5 shrink-0" />
                <input
                    type={show ? "text" : "password"}
                    className="flex-1 text-sm font-inter text-black outline-none bg-transparent placeholder:text-line"
                    {...props}
                />
                <button type="button" onClick={() => setShow(!show)} className="text-txtNav hover:text-black">
                    {show ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                </button>
            </div>
        </div>
    );
};

export default PasswordField;