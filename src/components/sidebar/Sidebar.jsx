import { useNavigate, useLocation } from "react-router-dom";

import profile from "../../assets/images/defaultProfile.jpg";
import SidebarButton from "./SidebarButton.jsx";
import useAuthStore from "../../store/authStore.js"; // Import store

import { RxHamburgerMenu } from "react-icons/rx";
import { FiChevronsLeft } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { GrHomeRounded } from "react-icons/gr";
import { PiShoppingCartSimpleBold } from "react-icons/pi";
import { LuNotebookPen } from "react-icons/lu";
import { MdOutlineStorefront } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { TiUserAddOutline } from "react-icons/ti";

const Sidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // Ambil data user dan fungsi logout dari Zustand
    const { user, logout } = useAuthStore();

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
                    icon={<GrHomeRounded />}
                    label="Persediaan"
                    isOpen={isOpen}
                    isActive={location.pathname === `${prefix}/inventory`}
                    onClick={() => navigate(`${prefix}/inventory`)}
                />
                <SidebarButton
                    icon={<PiShoppingCartSimpleBold />}
                    label="Penjualan"
                    isOpen={isOpen}
                    isActive={location.pathname === `${prefix}/sales`}
                    onClick={() => navigate(`${prefix}/sales`)}
                />
                {user?.role === "OWNER" && (
                    <SidebarButton
                        icon={<LuNotebookPen />}
                        label="Pembelian"
                        isOpen={isOpen}
                        isActive={location.pathname === `${prefix}/order`}
                        onClick={() => navigate(`${prefix}/order`)}
                    />
                )}


                {user?.role === "OWNER" && (
                    <SidebarButton
                        icon={<HiOutlineSwitchHorizontal/>}
                        label="Mutasi"
                        isOpen={isOpen}
                        isActive={location.pathname === `${prefix}/mutasi`}
                        onClick={() => navigate(`${prefix}/mutasi`)}
                    />
                )}


                {/* LOGIKA ROLE: Hanya tampil jika Admin */}
                {user?.role === "OWNER" && (
                    <SidebarButton
                        icon={<TiUserAddOutline />} // Ganti icon jika ada icon user/manajemen
                        label="Tambah Akun"
                        isOpen={isOpen}
                        isActive={location.pathname === `${prefix}/createAkun`}
                        onClick={() => navigate(`${prefix}/createAkun`)}
                    />
                )}

                {/*{user?.role === "OWNER" && (*/}
                {/*    <SidebarButton*/}
                {/*        icon={<SlGraph />}*/}
                {/*        label="Prediksi"*/}
                {/*        isOpen={isOpen}*/}
                {/*        isActive={location.pathname === `${prefix}/prediksi`}*/}
                {/*        onClick={() => navigate(`${prefix}/prediksi`)}*/}
                {/*    />*/}
                {/*)}*/}


                {user?.role === "OWNER" && (
                        <SidebarButton
                        icon={<MdOutlineStorefront />}
                        label="Pilih Toko"
                        isOpen={isOpen}
                        isActive={location.pathname === `${prefix}/switchToko`}
                        onClick={() => navigate(`${prefix}/switchToko`)}
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