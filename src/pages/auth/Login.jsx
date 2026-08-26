import { useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../../store/authStore.js";

import loginImg from "../../assets/images/login1.png";
import logo from "../../assets/images/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Memanggil fungsi login dari Zustand store
        const result = await login(email, password);

        if (result.success) {
            // INTEGRASI MULTI-ROLE:
            // Cek role yang didapat dari backend dan arahkan ke path yang benar
            if (result.role === "OWNER") {
                navigate("/admin");
            } else if (result.role === "EMPLOYEE" || result.role === "KARYAWAN") {
                navigate("/karyawan");
            } else {
                setError("Role pengguna tidak dikenal.");
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

                <form className="w-3/4" onSubmit={handleLogin}>
                    {error && <p className="text-red-500 font-medium mb-4 text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</p>}

                    <label className="block text-lg font-prociono">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukan alamat email Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-8 bg-transparent border border-black outline-none focus:ring-2 focus:ring-auth transition-all"
                        required
                    />

                    <label className="block text-lg font-prociono">Kata Sandi</label>
                    <div className="relative mb-5">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukan kata sandi Anda"
                            className="w-full h-12 p-4 pr-12 rounded-xl text-lg font-prociono bg-transparent border border-black outline-none focus:ring-2 focus:ring-auth transition-all"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-txtNav hover:text-black transition"
                        >
                            {showPassword ? <FiEye className="size-5" /> : <FiEyeOff className="size-5" />}
                        </button>
                    </div>
                    <div className="w-full text-right mb-10">
                        <button
                            type="button"
                            onClick={() => navigate("/RisetPassword")}
                            className="text-lg font-semibold font-prociono text-black hover:text-black hover:underline transition"
                        >
                            Lupa Kata Sandi?
                        </button>
                    </div>


                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-14 rounded-xl text-xl font-bold font-prompt text-black bg-auth border border-black hover:bg-slate-200 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>
                </form>

                <div className="pt-32">
                    <img src={logo} className="w-60 h-24 mb-16" alt="Logo"/>
                </div>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img src={loginImg} className="w-[580px] h-[644px] mb-7" alt="Login Illustration"/>
                <h1 className="text-5xl font-prociono mb-4 text-center">
                    Hallo, Selamat Datang!
                </h1>
                <p className="text-lg font-poppins">Di Sistem NazarPaint Management</p>
            </div>
        </div>
    );
};

export default Login;