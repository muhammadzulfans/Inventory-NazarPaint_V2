export const salesTableData = [
    {
        kode: "229",
        namaBaranag: "White",
        type: "Pro",
        totalProduk: 5,
        hargaSatuan: 16000,
        tanggal: "12 Januari 2025",
    },
    {
        kode: "329",
        namaBaranag: "Yellow",
        type: "Super",
        totalProduk: 7,
        hargaSatuan: 18000,
        tanggal: "12 Januari 2025",
    },
    {
        kode: "331",
        namaBaranag: "Green",
        type: "Super",
        totalProduk: 10,
        hargaSatuan: 18000,
        tanggal: "12 Januari 2025",
    },
    {
        kode: "515",
        namaBaranag: "Black",
        type: "Gloss",
        totalProduk: 6,
        hargaSatuan: 35000,
        tanggal: "12 Januari 2025",
    },
    {
        kode: "525",
        namaBaranag: "White",
        type: "Gloss",
        totalProduk: 14,
        hargaSatuan: 35000,
        tanggal: "12 Januari 2025",
    },
    {
        kode: "201",
        namaBaranag: "Gray",
        type: "Pro",
        totalProduk: 11,
        hargaSatuan: 35000,
        tanggal: "12 Januari 2025",
    },

];


export const DUMMY_PRODUCTS = [
    { id: 1,
        name: "White Gloss Paint",
        type: "Tipe Gloss",
        price: 85000,
        unit: "kaleng",
        stock: 24,
        color: "bg-gray-100" },
    { id: 2, name: "Red Matte Paint", type: "Tipe Super", price: 72000, unit: "kaleng", stock: 18, color: "bg-red-500" },
    { id: 3, name: "Navy Blue Exterior", type: "Tipe Super", price: 92000, unit: "kaleng", stock: 15, color: "bg-blue-900" },
    { id: 4, name: "Pastel Yellow Interior", type: "Tipe Super", price: 78500, unit: "kaleng", stock: 30, color: "bg-yellow-100" },
    { id: 5, name: "Forest Green Matte", type: "Tipe Pro", price: 81000, unit: "kaleng", stock: 12, color: "bg-green-800" },
    { id: 6, name: "Cement Gray Primer", type: "Accessories", price: 58000, unit: "kaleng", stock: 40, color: "bg-gray-400" },
    { id: 7, name: "Coral Pink Interior", type: "Tipe Super", price: 76000, unit: "kaleng", stock: 22, color: "bg-red-300" },
    { id: 8, name: "Black Gloss Enamel", type: "Tipe Gloss", price: 88000, unit: "kaleng", stock: 9, color: "bg-gray-900" },
    { id: 9, name: "Putih Dinding Avitex", type: "Tipe Pro", price: 45000, unit: "kaleng", stock: 60, color: "bg-white border" },
    { id: 10, name: "Paint Roller 20cm", type: "Accessories", price: 34000, unit: "pcs", stock: 35, color: "bg-blue-600" },
    { id: 11, name: "Brush Set Pro 5pcs", type: "Accessories", price: 65000, unit: "set", stock: 20, color: "bg-purple-600" },
    { id: 12, name: "Thinner Premium 1L", type: "Accessories", price: 28000, unit: "botol", stock: 50, color: "bg-orange-500" },
];

export const PRODUCT_TYPES = [
    { value: "ALL", label: "Semua Tipe" },
    { value: "Tipe Pro", label: "Tipe Pro" },
    { value: "Tipe Super", label: "Tipe Super" },
    { value: "Tipe Gloss", label: "Tipe Gloss" },
    { value: "Accessories", label: "Accessories" },
];

export const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(number);
};