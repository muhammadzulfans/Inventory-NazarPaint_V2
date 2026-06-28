import register from "../../assets/images/register1.png";
import logo from "../../assets/images/logo.png";

const Register = () => {
    return (
        <div className="min-h-screen flex bg-auth">
            <div className="w-1/2 flex flex-col items-center justify-center ">
                <img src={logo} className="w-60 h-24 mb-12"/>
                <img src={register} className="w-[420px] h-[520px] mb-12"/>
                <h1 className="text-5xl font-prociono mb-4">
                    Hallo, Selamat Bergabung!
                </h1>
                <p className="text-lg font-poppins">di Management Toko Cat Nazar Paint Tegal</p>
            </div>

            <div className="flex flex-col justify-center items-center w-1/2 px-10 bg-form">
                <h1 className="text-6xl font-prociono mb-8">
                    Daftar
                </h1>
                <form className="w-full max-w-3xl">
                    <div className="mb-4 grid grid-cols-2 gap-24 mb-8">
                        <div>
                            <label className="block text-lg font-prociono">Nama Pengguna</label>
                            <input
                                type="text"
                                id="username"
                                autoComplete="on"
                                placeholder="Masukan nama pengguna Anda"
                                className="w-full h-12 p-4 rounded-xl text-lg font-prociono border border-black bg-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-lg font-prociono">Nama Lengkap</label>
                            <input
                                type="text"
                                id="fullname"
                                autoComplete="on"
                                placeholder="Masukan nama lengkap Anda"
                                className="w-full h-12 p-4 rounded-xl text-lg font-prociono border border-black bg-transparent"
                            />
                        </div>
                    </div>
                    <label className="block text-lg font-prociono">Alamat</label>
                    <input
                        type="text"
                        id="alamat"
                        autoComplete="on"
                        placeholder="Masukan alamat Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-8 border border-black bg-transparent"
                    />
                    <label className="block text-lg font-prociono">Nomor Telepon</label>
                    <input
                        type="text"
                        id="nomortelepon"
                        autoComplete="on"
                        placeholder="Masukan nomor telepon Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-8 border border-black bg-transparent"
                    />
                    <label className="block text-lg font-prociono">Email</label>
                    <input
                        type="email"
                        id="email"
                        autoComplete="on"
                        placeholder="Masukan alamat email Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-8 border border-black bg-transparent"
                    />
                    <label className="block text-lg font-prociono">Kata Sandi</label>
                    <input
                        type="password"
                        id="password"
                        required={true}
                        placeholder="Masukan kata sandi Anda"
                        className="w-full h-12 p-4 rounded-xl text-lg font-prociono mb-10 border border-black bg-transparent"
                    />
                    <button
                        type="button"
                        className="w-full h-14 rounded-xl text-xl font-bold font-prompt text-black bg-auth border border-black"
                    > Daftar
                    </button>
                    <p className="text-lg font-inter mt-3 text-center">Sudah memiliki akun?
                        <button
                            type="button" className="text-button font-semibold ml-1 text-txt"
                        > Masuk
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register