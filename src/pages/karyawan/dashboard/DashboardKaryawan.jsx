import { BsBoxSeam } from 'react-icons/bs';
import { AiOutlineProduct } from 'react-icons/ai';
import { LuShoppingCart } from 'react-icons/lu';
import Card from '../../../components/ui/Card.jsx';
import Chart from '../../../components/ui/Chart.jsx';
import { useDashboardAdmin } from '../../../hooks/admin/useDashboardAdmin.js';

const formatRupiah = (angka) =>
    angka !== null && angka !== undefined
        ? `Rp ${angka.toLocaleString('id-ID')}`
        : 'Rp 0';

const DashboardKaryawan = () => {
    const { dashboardData,
        isLoading,
        weeklyChartData,
        monthlyChartData
    } = useDashboardAdmin();

    if (isLoading) {
        return (
            <div className="px-8 pt-6 pb-10 bg-white min-h-screen flex items-center justify-center">
                <p className="text-lg font-inter text-black">Memuat data...</p>
            </div>
        );
    }

    const { productSummary, salesSummary, stockRecap, endOfMonthRecap } = dashboardData;

    // Penyesuaian yang sama untuk dashboard karyawan
    const rekapRows = [
        ['Total Stok Order', `${stockRecap.totalStokMasuk} Kg`],
        ['Total Stok Keluar', `${stockRecap.totalStokKeluar} Kg`],
        ['Total Stok Akhir', `${stockRecap.totalStokAkhir} Kg`],
        ['Jumlah Total Penghasilan Kotor', formatRupiah(endOfMonthRecap.sales.thisMonth.totalAmount)],
    ];

    return (
        <div className="px-8 pt-6 pb-10 bg-white min-h-screen">
            <div className="mb-14">
                <h1 className="text-3xl font-inter font-medium text-black">Dashboard</h1>
                <p className="text-sm font-inter text-black">Selamat datang di management sistem</p>
            </div>

            <div className="grid grid-cols-3 gap-16 mb-14">
                <Card
                    title="Kategori Produk"
                    value={`${productSummary.categories.length}`}
                    icon={<BsBoxSeam className="size-7 m-3.5" />}
                />
                <Card
                    title="Total Produk"
                    value={`${productSummary.totalProduct}`}
                    icon={<AiOutlineProduct className="size-8 m-3" />}
                />
                <Card
                    title="Total Penjualan"
                    value={`${salesSummary.thisMonth.totalTransaction} Transaksi`}
                    icon={<LuShoppingCart className="size-7 m-3.5" />}
                />
            </div>

            <div className="grid grid-cols-2 gap-16 mb-12">
                <Chart
                    title="Penjualan Mingguan"
                    data={weeklyChartData}
                    xKey="label"
                    dataKey="totalAmount"
                />
                <Chart
                    title="Penjualan Bulanan"
                    data={monthlyChartData}
                    xKey="label"
                    dataKey="totalAmount"
                />
            </div>

            <div className="bg-card py-7 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <h2 className="text-2xl font-inter font-medium mb-3">Data Rekap Akhir Bulan</h2>
                <div className="space-y-4">
                    {rekapRows.map(([label, value], i) => (
                        <div
                            key={i}
                            className="flex justify-between items-center bg-white rounded-lg px-8 py-4 shadow-[0_0_10px_rgba(0,0,0,0.12)]"
                        >
                            <span className="text-lg font-inter text-black">{label}</span>
                            <span className="text-lg font-inter text-black">{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardKaryawan;