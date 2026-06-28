import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import Modal from "./Modal"; // Pastikan Modal.jsx sudah ada di folder yang sama

const SuccessModal = ({ isOpen, onClose, message }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Notifikasi Berhasil">
            <div className="flex flex-col items-center text-center py-4">
                {/* ICON ANIMATED */}
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-5 animate-bounce">
                    <FiCheckCircle size={48} />
                </div>

                <h3 className="text-2xl font-inter font-bold text-black mb-2">
                    Berhasil!
                </h3>

                <p className="text-sm font-inter text-txtNav px-6 leading-relaxed">
                    {message || "Tindakan Anda telah berhasil diproses oleh sistem."}
                </p>

                <button
                    onClick={onClose}
                    className="w-full mt-10 py-3.5 bg-button hover:bg-button2 text-black rounded-xl font-inter font-bold shadow-[0_4px_4px_rgba(0,0,0,0.2)] transition-all active:scale-95"
                >
                    Oke, Mengerti
                </button>
            </div>
        </Modal>
    );
};

export default SuccessModal;