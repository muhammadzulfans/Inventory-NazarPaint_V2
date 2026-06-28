import React from "react";
import { useState } from "react";
import profil from "../../assets/images/defaultProfile.jpg";
import useAuthStore from "../../store/authStore.js"; // Import global store lu

const Profile = () => {
    // Ambil data user yang sedang login saat ini dari Zustand
    const { user } = useAuthStore();

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Mengambil nama toko/cabang secara dinamis berdasarkan struktur response backend lu
    const getStoreLocation = () => {
        if (user?.role === "OWNER") {
            return "Semua Cabang (Pusat)";
        }
        // Jika karyawan dan punya relasi store, ambil nama tokonya
        if (user?.stores && user.stores.length > 0) {
            return user.stores[0].store?.name || "Toko Cabang Tidak Diketahui";
        }
        return "Belum Ditugaskan di Cabang Toko";
    };

    // fallback jika username tidak dikirim eksplisit oleh backend, kita generate dari email
    const usernameDisplay = user?.username || user?.email?.split("@")[0] || "user";

    return (
        <div className="flex w-full mt-20 items-center justify-center p-6 bg-gray-50 font-inter">
            {/* CARD CONTAINER UTAMA */}
            <div className="w-full max-w-4xl bg-[#F4F4F6] rounded-2xl border border-gray-200/60 p-10 shadow-[0_4px_10px_rgba(0,0,0,0.08)] flex flex-col items-center">

                {/* FOTO PROFIL */}
                <div
                    onClick={() => setIsModalOpen(true)}
                    className="w-32 h-32 rounded-full overflow-hidden shadow-inner mb-4 cursor-pointer">
                    <img
                        src={profil}
                        alt="Profile Avatar"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* USERNAME & JABATAN */}
                <div className="text-center mb-10">
                    <h2 className="text-2xl font-bold text-black tracking-tight">
                        {usernameDisplay}
                    </h2>
                    <p className="text-sm font-normal text-gray-500 mt-1 uppercase">
                        {user?.jabatan || "Staff"} - {user?.role || "User"}
                    </p>
                </div>

                {/* LIST FIELD INFORMASI DINAMIS ACCORDING TO BACKEND */}
                <div className="w-full flex flex-col gap-4">

                    {/* Field Nama Lengkap */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-semibold text-gray-400 px-1">Nama Lengkap</label>
                        <div className="w-full h-14 bg-white px-6 flex items-center rounded-xl border border-gray-100 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
                            <span className="text-sm font-medium text-black">
                                {user?.name || "-"}
                            </span>
                        </div>
                    </div>

                    {/* Field Jabatan (Ganti dari ID Pengguna) */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-semibold text-gray-400 px-1">Jabatan Resmi</label>
                        <div className="w-full h-14 bg-white px-6 flex items-center rounded-xl border border-gray-100 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
                            <span className="text-sm font-semibold text-black uppercase tracking-wider">
                                {user?.jabatan || "-"}
                            </span>
                        </div>
                    </div>

                    {/* Field Email */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-semibold text-gray-400 px-1">Email Aktif</label>
                        <div className="w-full h-14 bg-white px-6 flex items-center rounded-xl border border-gray-100 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
                            <span className="text-sm font-medium text-black">
                                {user?.email || "-"}
                            </span>
                        </div>
                    </div>

                    {/* Field Penugasan Cabang / Lokasi Toko */}
                    <div className="flex flex-col gap-1 w-full">
                        <label className="text-xs font-semibold text-gray-400 px-1">Lokasi Penugasan Toko</label>
                        <div className="w-full h-14 bg-white px-6 flex items-center rounded-xl border border-gray-100 shadow-[0_4px_6px_rgba(0,0,0,0.04)]">
                            <span className="text-sm font-medium text-black">
                                {getStoreLocation()}
                            </span>
                        </div>
                    </div>

                    {/*<div className="flex grid-cols-2 gap-10">*/}
                    {/*    <button*/}

                    {/*        className="w-full mt-10 py-3.5 bg-button hover:bg-button2 text-black rounded-xl font-inter font-bold shadow-[0_4px_4px_rgba(0,0,0,0.2)] transition-all active:scale-95"*/}
                    {/*    >*/}
                    {/*        Oke, Mengerti*/}
                    {/*    </button>*/}
                    {/*    <button*/}

                    {/*        className="w-full mt-10 py-3.5 bg-button hover:bg-button2 text-black rounded-xl font-inter font-bold shadow-[0_4px_4px_rgba(0,0,0,0.2)] transition-all active:scale-95"*/}
                    {/*    >*/}
                    {/*        Oke, Mengerti*/}
                    {/*    </button>*/}

                    {/*</div>*/}

                </div>

            </div>

            {isModalOpen && (
                <div
                    onClick={() => setIsModalOpen(false)} // Klik area hitam luar foto untuk nutup modal
                    className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fadeIn"
                >
                    {/* Tombol Close X Pojok Kanan Atas */}
                    <button
                        onClick={() => setIsModalOpen(false)}
                        className="fixed top-6 right-8 text-white/70 hover:text-white text-3xl font-bold transition-colors"
                    >
                        &times;
                    </button>

                    {/* Container Foto Besar */}
                    <div
                        onClick={(e) => e.stopPropagation()} // Supaya kalau gambarnya diklik modalnya ga ikutan tertutup
                        className="relative max-w-[90vw] max-h-[85vh] md:max-w-[500px] md:max-h-[500px] bg-black rounded-lg overflow-hidden shadow-2xl animate-scaleUp"
                    >
                        <img
                            src={profil}
                            alt="Profile Big View"
                            className="w-full h-full object-contain max-h-[80vh] md:max-h-[500px]"
                        />
                        {/* Nama User di bawah foto ala WhatsApp */}
                        <div className="absolute bottom-0 left-0 w-full bg-black/40 text-white px-4 py-2.5 text-sm font-medium backdrop-blur-sm">
                            {user?.name || "Profile Picture"}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;