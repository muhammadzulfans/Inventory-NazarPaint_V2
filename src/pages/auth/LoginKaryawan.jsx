import { useNavigate } from "react-router-dom"; // Import navigate
import { useState } from "react";
import useAuthStore from "../../store/authStore.js"; // Pastikan path benar

import loginImg from "../../assets/images/login1.png";
import logo from "../../assets/images/logo.png";

const LoginKaryawan = () => {
    const navigate = useNavigate(); // Inisialisasi navigate
    const login = useAuthStore((state) => state.login); // Ambil fungsi login dari store

    // State lokal untuk input
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLoginKaryawan = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const result = await login(email, password);

        if (result.success) {
            // Karyawan bisa masuk ke dashboard karyawan
            if (result.role === "EMPLOYEE" || result.role === "KARYAWAN") {
                navigate("/karyawan");
            } else {
                setError("Gunakan akun karyawan untuk masuk di sini.");
            }
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-auth">
            <div className="flex flex-col justify-center items-center w-1/2 px-10 bg-form pt-44">
                <h1 className="text-6xl font-normal font-prociono mb-14">
                    Masuk
                </h1>

                <form className="w-3/4" onSubmit={handleLoginKaryawan}>
                    {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

                    <label className="block text-lg font-prociono">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukan alamat email Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-8 bg-transparent border border-black"
                        required
                    />

                    <label className="block text-lg font-prociono">Kata Sandi</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Masukan kata sandi Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-20 bg-transparent border border-black"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-14 rounded-xl text-xl font-bold font-prompt text-black bg-auth border border-black hover:bg-slate-200 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <div className="pt-20">
                    <img src={logo} className="w-60 h-24 mb-16" alt="Logo"/>
                </div>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img src={loginImg} className="w-[580px] h-[644px] mb-7" alt="LoginKaryawan Illustration"/>
                <h1 className="text-5xl font-prociono mb-4">
                    Hallo, Selamat Datang Kembali!
                </h1>
                <p className="text-lg font-poppins">Selamat Datang Kembali ke Halaman Masuk !!!</p>
            </div>
        </div>
    )
}

export default LoginKaryawan;