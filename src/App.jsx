import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore.js';

// Import Halaman auth
import Login from './pages/auth/Login.jsx';
import Register from './pages/auth/Register';

// Import Halaman Admin
import DashboardAdmin from './pages/admin/dashboard/DashboardAdmin.jsx';
import InventoryAdmin from './pages/admin/inventory/InventoryAdmin.jsx';
import SalesAdmin from './pages/admin/sales/SalesAdmin.jsx';
import MutasiAdmin from "./pages/admin/Mutasi/MutasiAdmin.jsx";
import OrderAdmin from "./pages/admin/Order/OrderAdmin.jsx";
// import PrediksiAdmin from "./pages/admin/Prediksi/PrediksiAdmin.jsx";

// Import Halaman Karyawan
import DashboardKaryawan from './pages/karyawan/dashboard/DashboardKaryawan.jsx';
import InventoryKaryawan from './pages/karyawan/inventory/InventoryKaryawan.jsx';
import SalesKaryawan from './pages/karyawan/sales/SalesKaryawan.jsx';
import MainLayout from './layouts/MainLayout';
// import CreateAkun from "./pages/admin/users/CreateAkun.jsx";
// import SwitchToko from "./pages/admin/stores/KelolaStores.jsx";
import KelolaInventoryAdmin from "./pages/admin/inventory/KelolaInventoryAdmin.jsx";
import Profile from "./pages/admin/ProfileAdmin.jsx";
import DetailSalesAdmin from "./pages/admin/sales/DetailSalesAdmin.jsx";
import HistorySalesAdmin from "./pages/admin/sales/HistorySalesAdmin.jsx";
import DetailOrderAdmin from "./pages/admin/Order/DetailOrderAdmin.jsx";
import StockOpnameAdmin from "./pages/admin/stockOpname/StockOpnameAdmin.jsx";
import KelolaStockOpnameAdmin from "./pages/admin/stockOpname/KelolaStockOpnameAdmin.jsx";
import HistorySalesKaryawan from "./pages/karyawan/sales/HistorySalesKaryawan.jsx";
import DetailSalesKaryawan from "./pages/karyawan/sales/DetailSalesKaryawan.jsx";
import KelolaStockOpnameKaryawan from "./pages/karyawan/stockOpname/KelolaStockOpnameKaryawan.jsx";
import StockOpnameKaryawan from "./pages/karyawan/stockOpname/StockOpnameKaryawan.jsx";
import MutasiKaryawan from "./pages/karyawan/mutasi/MutasiKaryawan.jsx";
import CreateAkun from "./pages/admin/users/CreateAkun.jsx";
import KelolaStores from "./pages/admin/stores/KelolaStores.jsx";
import ForgotPassword from "./pages/auth/RisetPassword.jsx";
import RisetPassword from "./pages/auth/RisetPassword.jsx";
import VerifikasiOtp from "./pages/auth/VerifikasiOtp.jsx";
import SetNewPassword from "./pages/auth/SetNewPassword.jsx";

function App() {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <Router>
            <Routes>
                {/* --- PUBLIC ROUTES --- */}
                <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={user?.role === 'OWNER' ? "/admin" : "/karyawan"} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/RisetPassword" element={<RisetPassword />} />
                <Route path="/VerifikasiOtp" element={<VerifikasiOtp />} />
                <Route path="/SetNewPassword" element={<SetNewPassword />} />

                {/* --- ADMIN ROUTES --- */}
                <Route
                    path="/admin"
                    element={isAuthenticated && user?.role === 'OWNER' ? <MainLayout /> : <Navigate to="/login" />}
                >
                    <Route index element={<DashboardAdmin />} />
                    <Route path="inventory" element={<InventoryAdmin />} />
                    <Route path="KelolaInventory" element={<KelolaInventoryAdmin />} />
                    <Route path="sales" element={<SalesAdmin />} />
                    <Route path="history-sales" element={<HistorySalesAdmin />} />
                    <Route path="detail-sales" element={<DetailSalesAdmin />} />
                    <Route path="order" element={<OrderAdmin />} />
                    <Route path="detail-order" element={<DetailOrderAdmin />} />
                    <Route path="mutasi" element={<MutasiAdmin />} />
                    <Route path="stock-opname" element={<StockOpnameAdmin />} />
                    <Route path="KelolaStockOpname" element={<KelolaStockOpnameAdmin />} />
                    {/*<Route path="prediksi" element={<PrediksiAdmin />} />*/}
                    <Route path="createAkun" element={<CreateAkun />} />
                    <Route path="kelolaCabang" element={<KelolaStores />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                {/* --- KARYAWAN ROUTES --- */}
                <Route
                    path="/karyawan"
                    element={isAuthenticated && (user?.role === 'EMPLOYE' || user?.role === 'KARYAWAN') ? <MainLayout /> : <Navigate to="/login" />}
                >
                    <Route index element={<DashboardKaryawan />} />
                    <Route path="inventory" element={<InventoryKaryawan />} />
                    <Route path="sales" element={<SalesKaryawan />} />
                    <Route path="history-sales" element={<HistorySalesKaryawan />} />
                    <Route path="detail-sales" element={<DetailSalesKaryawan />} />
                    <Route path="mutasi" element={<MutasiKaryawan />} />
                    <Route path="stock-opname" element={<StockOpnameKaryawan />} />
                    <Route path="KelolaStockOpname" element={<KelolaStockOpnameKaryawan />} />
                    <Route path="profile" element={<Profile />} />
                </Route>

                {/* --- INITIAL REDIRECT --- */}
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </Router>
    );
}

export default App;