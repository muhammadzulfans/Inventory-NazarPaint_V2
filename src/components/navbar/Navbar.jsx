import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // Import useLocation untuk deteksi URL

const Navbar = () => {
    const location = useLocation(); // Inisialisasi hook location
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    // Update waktu setiap menit
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // 60 detik

        return () => clearInterval(timer);
    }, []);

    // Format tanggal: "Senin, 19 Januari, 2026"
    const formattedDate = currentDateTime.toLocaleDateString('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const getNavbarTitle = () => {
        const path = location.pathname;

        // Cek kecocokan URL belakangnya
        if (path === "/admin" || path === "/admin/" || path === "/karyawan" || path === "/karyawan/") {
            return "Dashboard";
        }
        if (path.endsWith("/inventory")) {
            return "Persediaan";
        }
        if (path.endsWith("/kelolaInventory")) {
            return "Persediaan";
        }
        if (path.endsWith("/sales")) {
            return "Penjualan > Penjualan POS";
        }
        if (path.endsWith("/history-sales")) {
            return "Penjualan > Riwayat Transaksi";
        }
        if (path.endsWith("/detail-sales")) {
            return "Penjualan > Detail Penjualan";
        }
        if (path.endsWith("/order")) {
            return "Pembelian";
        }
        if (path.endsWith("/mutasi")) {
            return "Mutasi Barang";
        }
        if (path.endsWith("/createAkun")) {
            return "Tambah Akun Karyawan";
        }
        if (path.endsWith("/prediksi")) {
            return "Prediksi Stok";
        }
        if (path.endsWith("/switchToko")) {
            return "Pilih Toko Cabang";
        }
        if (path.endsWith("/KelolaInventory")) {
            return "Kelola Produk";
        }

        // Judul bawaan jika tidak ada path yang cocok
        return "NazarPaint";
    };

    return (
        <div className="w-full h-20 bg-white px-7 border shadow-[0_4px_4px_rgba(0,0,0,0.2)] z-10">
            <div className="flex items-start justify-between my-3">
                <div>
                    {/* Render fungsi getNavbarTitle() di sini */}
                    <h1 className="text-2xl font-inter font-semibold text-txtNav">
                        {getNavbarTitle()}
                    </h1>

                    {/* Menampilkan waktu dinamis */}
                    <p className="text-sm font-inter font-semibold text-txtNav">
                        {formattedDate}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Navbar;