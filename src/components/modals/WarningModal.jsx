import React from "react";
import { FiAlertCircle } from "react-icons/fi";
import Modal from "./Modal";

const WarningModal = ({ isOpen, onClose, onConfirm, title, message, isLoading, confirmText, cancelText, singleButton = false }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title || "Konfirmasi"}>
            <div className="flex flex-col items-center text-center py-2">
                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4">
                    <FiAlertCircle size={32} />
                </div>
                <h3 className="text-lg font-inter font-semibold text-black mb-2">
                    Apakah anda yakin?
                </h3>
                <div className="text-sm font-inter text-txtNav px-4">
                    {message}
                </div>
                <div className="flex gap-4 w-full mt-8">
                    {singleButton ? (
                        /* Mode 1 Tombol khusus untuk pengingat */
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 rounded-xl text-sm font-inter font-semibold text-black transition shadow-sm"
                        >
                            {confirmText || "Mengerti"}
                        </button>
                    ) : (
                        /* Mode Standar 2 Tombol untuk konfirmasi hapus/edit */
                        <>
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 border-2 border-line rounded-xl text-sm font-inter font-semibold text-txtNav hover:bg-gray-50 transition"
                            >
                                {cancelText || "Batal"}
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                disabled={isLoading}
                                className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-inter font-semibold shadow-md transition disabled:opacity-50"
                            >
                                {isLoading ? "Memproses..." : (confirmText || "Ya, Lanjutkan")}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default WarningModal;