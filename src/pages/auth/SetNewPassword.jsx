import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import loginImg from "../../assets/images/login1.png";
import logo from "../../assets/images/logo.png";
import { FiEye, FiEyeOff } from "react-icons/fi";
// Ganti dengan action store/service yang sesuai (mis. useAuthStore atau authService)
// import { resetPassword } from "../../services/authService.js";

const SetNewPassword3 = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (password.length < 8) {
            setError("Kata sandi minimal 8 karakter");
            setIsLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi kata sandi tidak cocok");
            setIsLoading(false);
            return;
        }

        try {
            // await resetPassword({ email: location.state?.email, password });
            navigate("/login");
        } catch (err) {
            setError(err?.message || "Gagal mengubah kata sandi. Coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-auth">
            <div className="flex flex-col justify-center items-center w-1/2 px-10 bg-form pt-44">
                <h1 className="text-6xl font-normal font-prociono mb-14">
                    Sandi Baru
                </h1>

                <form className="w-3/4" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 font-medium mb-4 text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</p>}

                    <label className="block text-lg font-prociono">Kata Sandi Baru</label>
                    <div className="relative mb-8">
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Masukan kata sandi baru"
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

                    <label className="block text-lg font-prociono">Konfirmasi Kata Sandi</label>
                    <div className="relative mb-10">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Masukan ulang kata sandi baru"
                            className="w-full h-12 p-4 pr-12 rounded-xl text-lg font-prociono bg-transparent border border-black outline-none focus:ring-2 focus:ring-auth transition-all"
                            required
                        />

                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-txtNav hover:text-black transition"
                        >
                            {showConfirmPassword ? <FiEye className="size-5" /> : <FiEyeOff className="size-5" />}
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-14 rounded-xl text-xl font-bold font-prompt text-black bg-auth border border-black hover:bg-slate-200 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Memproses..." : "Simpan Kata Sandi"}
                    </button>
                </form>

                <div className="pt-32">
                    <img src={logo} className="w-60 h-24 mb-16" alt="Logo"/>
                </div>
            </div>
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img src={loginImg} className="w-[580px] h-[644px] mb-7" alt="Set Password Illustration"/>
                <h1 className="text-5xl font-prociono mb-4 text-center">
                    Hampir Selesai!
                </h1>
                <p className="text-lg font-poppins">Buat kata sandi baru untuk akun Anda</p>
            </div>
        </div>
    );
};

export default SetNewPassword3;