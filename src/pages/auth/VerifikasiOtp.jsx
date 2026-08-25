import { useNavigate, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import loginImg from "../../assets/images/login1.png";
import logo from "../../assets/images/logo.png";
import { authService } from "../../api/services/authService.js";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const VerifikasiOTP = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const inputsRef = useRef([]);

    const email = location.state?.email;

    const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(RESEND_SECONDS);

    // Kalau halaman ini diakses langsung tanpa lewat RisetPassword, tendang balik
    useEffect(() => {
        if (!email) {
            navigate("/RisetPassword", { replace: true });
        }
    }, [email, navigate]);

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (index, value) => {
        const digit = value.replace(/[^0-9]/g, "").slice(-1);

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        if (digit && index < OTP_LENGTH - 1) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
        if (!pasted) return;

        const newOtp = Array(OTP_LENGTH).fill("");
        pasted.split("").forEach((char, i) => {
            newOtp[i] = char;
        });
        setOtp(newOtp);
        inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const code = otp.join("");
        if (code.length < OTP_LENGTH) {
            setError("Masukkan seluruh kode OTP");
            setIsLoading(false);
            return;
        }

        try {
            const res = await authService.verifyOtp({ email, otpCode: code });
            if (res?.success) {
                // otpCode ikut diteruskan karena backend butuh otpCode lagi saat reset-password
                navigate("/SetNewPassword", { state: { email, otpCode: code } });
            } else {
                setError(res?.message || "Kode OTP salah atau sudah kedaluwarsa.");
            }
        } catch (err) {
            setError(err?.response?.data?.message || "Kode OTP salah atau sudah kedaluwarsa.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || isResending) return;
        setError("");
        setIsResending(true);
        try {
            await authService.resendOtp(email);
            setCountdown(RESEND_SECONDS);
            setOtp(Array(OTP_LENGTH).fill(""));
            inputsRef.current[0]?.focus();
        } catch (err) {
            setError(err?.response?.data?.message || "Gagal mengirim ulang kode. Coba lagi.");
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-auth">
            <div className="w-1/2 flex flex-col items-center justify-center">
                <img src={loginImg} className="w-[580px] h-[644px] mb-7" alt="Verifikasi OTP Illustration"/>
                <h1 className="text-5xl font-prociono mb-4 text-center">
                    Verifikasi Kode OTP
                </h1>
                <p className="text-lg font-poppins">Tenang, kami bantu kamu masuk lagi !!!</p>
            </div>

            <div className="flex flex-col justify-center items-center w-1/2 px-10 bg-form pt-44">
                <h1 className="text-6xl font-normal font-prociono mb-10">
                    Masukkan Kode OTP
                </h1>
                <p className="text-3xl font-prociono mb-5 text-center text-black">
                    Silahkan Cek Email Anda
                </p>
                <p className="text-lg font-normal font-prociono mb-4 text-center">
                    Kami telah mengirimkan kode OTP ke {email || "email Anda"}. Silakan masukkan kode tersebut di bawah ini.
                </p>
                <p className="text-lg font-normal font-prociono mb-4 text-center">
                    Silakan masukkan kode tersebut di bawah ini.
                </p>

                <form className="w-3/4 pb-32" onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 font-medium mb-4 text-center bg-red-50 p-2 rounded-lg border border-red-200">{error}</p>}

                    <div className="flex justify-center gap-4 mb-10" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => (inputsRef.current[index] = el)}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className={`w-16 h-16 text-center text-2xl font-prociono rounded-xl outline-none transition-all ${
                                    digit
                                        ? "bg-transparent border-2 border-black"
                                        : index === otp.findIndex((d) => !d)
                                            ? "bg-transparent border-2 border-red-500"
                                            : "bg-gray-100 border-2 border-transparent"
                                }`}
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full h-14 rounded-xl text-xl font-bold font-prompt text-black bg-auth border border-black hover:bg-slate-200 transition-all ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                        {isLoading ? "Memverifikasi..." : "Verifikasi"}
                    </button>

                    <div className="w-full text-center mt-6">
                        <div className="w-full text-center mt-6 flex items-center justify-center gap-1">
                            <p className="text-lg font-prociono text-black">
                                Tidak menerima kode?
                            </p>
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={countdown > 0 || isResending}
                                className={`text-lg font-prociono font-semibold transition ${
                                    countdown > 0 || isResending
                                        ? "text-gray-400 cursor-not-allowed"
                                        : "text-black hover:underline"
                                }`}
                            >
                                {isResending
                                    ? "Mengirim..."
                                    : countdown > 0
                                        ? `Kirim ulang (${countdown}s)`
                                        : "Kirim ulang"}
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

export default VerifikasiOTP;