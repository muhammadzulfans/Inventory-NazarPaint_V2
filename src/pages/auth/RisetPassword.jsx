import { useNavigate } from "react-router-dom";
import { useState } from "react";

import loginImg from "../../assets/images/login1.png";
import logo from "../../assets/images/logo.png";
import { authService } from "../../api/services/authService.js";

const RisetPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!email) {
            setError("Email wajib diisi");
            setIsLoading(false);
            return;
        }

        try {
            const res = await authService.forgotPassword(email);
            if (res?.success) {
                navigate("/VerifikasiOTP", { state: { email } });
            } else {
                setError(res?.message || "Gagal mengirim kode OTP. Coba lagi.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Gagal mengirim kode OTP. Coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-auth">
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img src={loginImg} className="w-[580px] h-[644px] mb-7" alt="Reset Password Illustration"/>
                <h1 className="text-5xl font-prociono mb-4 text-center">
                    Lupa Kata Sandi?
                </h1>
                <p className="text-lg font-poppins">Tenang, kami bantu kamu masuk lagi !!!</p>
            </div>

            <div className="flex flex-col justify-center items-center w-1/2 px-10 bg-form pt-44">
                <h1 className="text-6xl font-normal font-prociono mb-10">
                    Reset Kata Sandi
                </h1>
                <p className="text-xl font-normal font-prociono mb-14">
                    Masukkan email yang terdaftar, kami akan mengirimkan kode OTP ke email Anda.
                </p>

                <form className="w-3/4 pb-32" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 font-medium mb-4 text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</p>}

                    <label className="block text-lg font-prociono">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Masukan alamat email Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-10 bg-transparent border border-black outline-none focus:ring-2 focus:ring-auth transition-all"
                        required
                    />

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-14 rounded-xl text-xl font-bold font-prompt text-black bg-auth border border-black hover:bg-slate-200 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Mengirim..." : "Kirim Kode OTP"}
                    </button>

                    <div className="w-full text-center mt-6">
                        <div className="w-full text-center mt-6 flex items-center justify-center gap-1">
                            <p className="text-lg font-prociono text-black">
                                Sudah ingat kata sandi?
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-lg font-prociono text-black font-semibold hover:underline transition"
                            >
                                Masuk di sini
                            </button>
                        </div>
                    </div>
                </form>

                <div className="pt-16">
                    <img src={logo} className="w-60 h-24 mb-16" alt="Logo"/>
                </div>
            </div>
        </div>
    );
};

export default RisetPassword;