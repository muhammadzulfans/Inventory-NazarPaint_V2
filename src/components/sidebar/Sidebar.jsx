import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import profile from "../../assets/images/defaultProfile.jpg";
import SidebarButton from "./SidebarButton.jsx";
import useAuthStore from "../../store/authStore.js"; // Import store

import { RxHamburgerMenu } from "react-icons/rx";
import { FiChevronsLeft, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { LuClipboardCheck, LuLayoutDashboard } from "react-icons/lu";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuNotebookPen } from "react-icons/lu";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import {TiUserAddOutline} from "react-icons/ti";
import {MdOutlineStorefront} from "react-icons/md";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil data user dan fungsi logout dari Zustand
    const { user, logout } = useAuthStore();

    // State untuk toggle submenu penjualan
    const [salesMenuOpen, setSalesMenuOpen] = useState(
        location.pathname.includes("/sales") || location.pathname.includes("/history-sales") || location.pathname.includes("/detail-sales")
    );

    const [orderMenuOpen, setOrderMenuOpen] = useState(
        location.pathname.includes("/order") || location.pathname.includes("/detail-order")
    );

    const isKaryawanPage = location.pathname.startsWith("/karyawan");
    const prefix = isKaryawanPage ? "/karyawan" : "/admin";

    const handleLogout = (e) => {
        e.stopPropagation(); // Mencegah trigger navigasi profil saat tombol logout diklik
        logout(); // Hapus session di Zustand & LocalStorage
        navigate("/login"); // Balik ke halaman login tunggal
    };

    return (
        <div className={`overflow-y-auto bg-auth flex flex-col transition-all duration-300 ${isOpen ? "w-72 px-6" : "w-20 px-3"}`}>
            {/* HEADER */}
            <div className="flex items-start justify-between my-3">
                {isOpen && (
                    <div>
                        <h1 className="text-3xl font-inter font-medium text-black">NazarPaint</h1>
                        <p className="text-sm font-inter text-black">Tegal</p>
                    </div>
                )}
                <button onClick={() => setIsOpen(!isOpen)}
                        className="w-10 h-10 flex items-center justify-center text-black my-2 mx-2">
                    {isOpen ? (
                        <span className="text-3xl font-medium">
                            <FiChevronsLeft size={35}/>
                        </span>
                        ) : (
                            <span className="text-xl font-medium">
                                <RxHamburgerMenu size={30}/>
                            </span>
                        )}
                </button>
            </div>

            <hr className={`border-t-2 border-black mb-6 transition-all duration-300 ${isOpen ? "-mx-6" : "-mx-3"}`}/>

            {/* MENU */}
            <nav className="flex flex-col gap-2">
                <SidebarButton
                    icon={<LuLayoutDashboard />}
                    label="Dashboard"
                    isOpen={isOpen}
                    isActive={location.pathname === prefix}
                    onClick={() => navigate(prefix)}
                />
                <SidebarButton
                    icon={<BsBoxSeam strokeWidth={0.2}/>}
                    label="Persediaan"
                    isOpen={isOpen}
                    isActive={location.pathname === `${prefix}/inventory`}
                    onClick={() => navigate(`${prefix}/inventory`)}
                />


                {/* CONTAINER ITEM PENJUALAN DROPDOWN */}
                <div className="flex flex-col px-1">
                    <div
                        onClick={() => {
                            if (!isOpen) setIsOpen(true);
                            setSalesMenuOpen(!salesMenuOpen);
                        }}
                        className={`flex items-center justify-between w-full p-3 rounded-xl cursor-pointer font-inter font-medium text-sm transition-colors ${
                            location.pathname.includes("/sales") || location.pathname.includes("/history-sales") || location.pathname.includes("/detail-sales")
                                ? "bg-black/10 text-black"
                                : "text-black "
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <span><PiShoppingCartSimpleBold size={24} /></span>
                            {isOpen && <span className="text-lg font-inter">Penjualan</span>}
                        </div>
                        {isOpen && (
                            <span>{salesMenuOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}</span>
                        )}
                    </div>

                    {/* SUBMENU LIST */}
                    {isOpen && salesMenuOpen && (
                        <div className="flex flex-col pl-5 mt-2 gap-2 border-l border-black/20 ml-5 animate-in fade-in duration-150">
                            <button
                                onClick={() => navigate(`${prefix}/sales`)}
                                className={`text-left text-lg font-inter font-medium py-2 px-3 rounded-lg ${
                                    location.pathname === `${prefix}/sales`
                                        ? "bg-button font-bold"
                                        : "text-black/80 "
                                }`}
                            >
                                • Penjualan POS
                            </button>
                            <button
                                onClick={() => navigate(`${prefix}/history-sales`)}
                                className={`text-left text-lg font-inter font-medium py-2 px-3 rounded-lg ${
                                    location.pathname === `${prefix}/history-sales`
                                        ? "bg-button font-bold"
                                        : "text-black/80 "
                                }`}
                            >
                                • Riwayat Transaksi
                            </button>
                            <button
                                onClick={() => navigate(`${prefix}/detail-sales`)}
                                className={`text-left text-lg font-inter font-medium py-2 px-3 rounded-lg ${
                                    location.pathname === `${prefix}/detail-sales`
                                        ? "bg-button font-bold"
                                        : "text-black/80 "
                                }`}
                            >
                                • Detail Penjualan
                            </button>
                        </div>
                    )}
                </div>


                {/* CONTAINER ITEM PEMBELIAN DROPDOWN */}
                {user?.role === "OWNER" && (
                    <div className="flex flex-col px-1">
                        <div
                            onClick={() => {
                                if (!isOpen) setIsOpen(true);
                                setOrderMenuOpen(!orderMenuOpen);
                            }}
                            className={`flex items-center justify-between w-full p-3 rounded-xl cursor-pointer font-inter font-medium text-sm transition-colors ${
                                location.pathname.includes("/order") || location.pathname.includes("/detail-order")
                                    ? "bg-black/10 text-black"
                                    : "text-black "
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <span><LuNotebookPen size={24} /></span>
                                {isOpen && <span className="text-lg font-inter">Pembelian</span>}
                            </div>
                            {isOpen && (
                                <span>{orderMenuOpen ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}</span>
                            )}
                        </div>

                        {/* SUBMENU LIST */}
                        {isOpen && orderMenuOpen && (
                            <div className="flex flex-col pl-5 mt-2 gap-2 border-l border-black/20 ml-5 animate-in fade-in duration-150">
                                <button
                                    onClick={() => navigate(`${prefix}/order`)}
                                    className={`text-left text-lg font-inter font-medium py-2 px-3 rounded-lg ${
                                        location.pathname === `${prefix}/order`
                                            ? "bg-button font-bold"
                                            : "text-black/80 "
                                    }`}
                                >
                                    • Pembelian
                                </button>
                                <button
                                    onClick={() => navigate(`${prefix}/detail-order`)}
                                    className={`text-left text-lg font-inter font-medium py-2 px-3 rounded-lg ${
                                        location.pathname === `${prefix}/detail-order`
                                            ? "bg-button font-bold"
                                            : "text-black/80 "
                                    }`}
                                >
                                    • Detail Pembelian
                                </button>
                            </div>
                        )}
                    </div>
                )}


                <SidebarButton
                    icon={<HiOutlineSwitchHorizontal/>}
                    label="Mutasi"
                    isOpen={isOpen}
                    isActive={location.pathname === `${prefix}/mutasi`}
                    onClick={() => navigate(`${prefix}/mutasi`)}
                />

                <SidebarButton
                    icon={<LuClipboardCheck />}
                    label="Stock Opname"
                    isOpen={isOpen}
                    isActive={location.pathname === `${prefix}/stock-opname`}
                    onClick={() => navigate(`${prefix}/stock-opname`)}
                />

                 {/*LOGIKA ROLE: Hanya tampil jika Admin */}
                {user?.role === "OWNER" && (
                    <SidebarButton
                        icon={<TiUserAddOutline />} // Ganti icon jika ada icon user/manajemen
                        label="Tambah Akun"
                        isOpen={isOpen}
                        isActive={location.pathname === `${prefix}/createAkun`}
                        onClick={() => navigate(`${prefix}/createAkun`)}
                    />
                )}

                {user?.role === "OWNER" && (
                        <SidebarButton
                        icon={<MdOutlineStorefront />}
                        label="Kelola Cabang"
                        isOpen={isOpen}
                        isActive={location.pathname === `${prefix}/kelolaCabang`}
                        onClick={() => navigate(`${prefix}/kelolaCabang`)}
                    />
                )}
            </nav>

            {/* PROFILE & LOGOUT */}
            <div className="mt-auto mb-10">
                <div
                    onClick={() => navigate(`${prefix}/profile`)}
                    className={`bg-button rounded-2xl p-3 flex shadow-md transition-all duration-300 cursor-pointer 
                    ${location.pathname === `${prefix}/profile`} 
                    ${isOpen ? "flex-row items-center justify-between" : "flex-col items-center gap-4"
                }`}>
                    <div className={`flex items-center gap-3 ${!isOpen && "flex-col text-center"}`}>
                        <img
                            src={profile}
                            alt="Profile"
                            className="w-9 h-9 rounded-full object-cover shrink-0"
                        />
                        {isOpen && (
                            <div className="overflow-hidden">
                                <h3 className="text-sm font-semibold text-black truncate">
                                    {user?.name || "Muhammad Zulfan"}
                                </h3>
                                <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full block w-max mt-0.5">
                                    {user?.jabatan || "Admin"}
                                </span>
                            </div>
                        )}
                    </div>
                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="text-2xl hover:scale-110 transition-all text-black shrink-0"
                    >
                        <BiLogOut />
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Sidebar;