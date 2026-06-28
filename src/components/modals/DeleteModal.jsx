import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Modal from "./Modal";

const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "Data", isLoading }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Konfirmasi Hapus">
            <div className="flex flex-col items-center text-center py-2">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                    <FiAlertTriangle size={32} />
                </div>
                <h3 className="text-lg font-inter font-semibold text-black mb-2">
                    Apakah anda yakin?
                </h3>
                <p className="text-sm font-inter text-txtNav px-4">
                    {itemType} <span className="font-bold text-black">"{itemName}"</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex gap-4 w-full mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-3 border-2 border-line rounded-xl text-sm font-inter font-semibold text-txtNav hover:bg-gray-50 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="flex-1 py-3 bg-trash hover:opacity-90 text-white rounded-xl text-sm font-inter font-semibold shadow-md transition disabled:opacity-50"
                    >
                        {isLoading ? "Menghapus..." : `Ya, Hapus ${itemType}`}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default DeleteModal;