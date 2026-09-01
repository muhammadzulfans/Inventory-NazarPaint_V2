import React from "react";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.error("Uncaught error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-white px-4">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-black mb-2">Terjadi Kesalahan</h1>
                        <p className="text-gray-500 mb-6">Halaman mengalami masalah. Silakan kembali ke halaman login.</p>
                        <button
                            onClick={() => { window.location.href = "/login"; }}
                            className="bg-auth border border-black px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition"
                        >
                            Kembali ke Login
                        </button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;