import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

const formatRupiah = (value) => {
    if (value >= 1_000_000) return `Rp ${(value / 1_000_000).toFixed(1)}jt`;
    if (value >= 1_000) return `Rp ${(value / 1_000).toFixed(0)}rb`;
    return `Rp ${value}`;
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-line rounded-lg px-4 py-2 shadow text-sm font-inter">
                <p className="font-medium mb-1">{label}</p>
                <p className="text-black">
                    {`Rp ${payload[0].value.toLocaleString('id-ID')}`}
                </p>
            </div>
        );
    }
    return null;
};

const Chart = ({ title, data, xKey = 'label', dataKey = 'totalAmount', image }) => {
    // Fallback ke gambar statis jika tidak ada data (backward compatibility)
    if (!data && image) {
        return (
            <div className="bg-card py-7 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
                <h2 className="text-2xl font-inter font-medium mb-4">{title}</h2>
                <img src={image} alt={title} className="w-full" />
            </div>
        );
    }

    return (
        <div className="bg-card py-7 px-7 shadow-[0_4px_4px_rgba(0,0,0,0.2)]">
            <h2 className="text-2xl font-inter font-medium mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis
                        dataKey={xKey}
                        tick={{ fontSize: 12, fontFamily: 'Inter', fill: '#374151' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tickFormatter={formatRupiah}
                        tick={{ fontSize: 11, fontFamily: 'Inter', fill: '#6b7280' }}
                        axisLine={false}
                        tickLine={false}
                        width={70}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey={dataKey} fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Chart;