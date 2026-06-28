import React from "react";
import { FiX } from "react-icons/fi";

const Modal = ({ isOpen, onClose, title, subtitle, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between px-6 py-5 bg-card border-b border-line">
                    <div>
                        <h2 className="text-xl font-inter font-semibold text-black">{title}</h2>
                        {subtitle && <p className="text-xs font-inter text-txtNav mt-0.5">{subtitle}</p>}
                    </div>
                    <button onClick={onClose} className="text-txtNav hover:text-black transition">
                        <FiX size={24} />
                    </button>
                </div>
                <div className="p-7">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;