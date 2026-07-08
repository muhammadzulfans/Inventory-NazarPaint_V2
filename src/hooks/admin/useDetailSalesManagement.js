import { useState, useEffect } from "react";

// DATA DUMMY 10 BARIS DETAIL PENJUALAN SESUAI KETENTUAN
const DUMMY_DETAIL_DATA = [
    { idPenjualan: "NZR-00001", kode: "229", namaBarang: "White Pro Paint", quantity: 5, type: "PRO", hargaJual: 16000, hargaBeli: 14000, tanggal: "12 Jan 2025" },
    { idPenjualan: "NZR-00002", kode: "207", namaBarang: "Green Leaf Paint", quantity: 10, type: "PRO", hargaJual: 20000, hargaBeli: 17000, tanggal: "13 Jan 2025" },
    { idPenjualan: "NZR-00003", kode: "210", namaBarang: "Red Chili Paint", quantity: 8, type: "PRO", hargaJual: 20000, hargaBeli: 17000, tanggal: "14 Jan 2025" },
    { idPenjualan: "NZR-00005", kode: "319", namaBarang: "Coklat Kayu Paint", quantity: 4, type: "SUPER", hargaJual: 20000, hargaBeli: 17000, tanggal: "16 Jan 2025" },
    { idPenjualan: "NZR-00006", kode: "309", namaBarang: "Orange Fresh Paint", quantity: 15, type: "SUPER", hargaJual: 25000, hargaBeli: 20000, tanggal: "17 Jan 2025" },
    { idPenjualan: "NZR-00007", kode: "321", namaBarang: "White Super Paint", quantity: 20, type: "SUPER", hargaJual: 35000, hargaBeli: 30000, tanggal: "18 Jan 2025" },
    { idPenjualan: "NZR-00008", kode: "529", namaBarang: "Yellow Bright Paint", quantity: 6, type: "GLOSS", hargaJual: 25000, hargaBeli: 20000, tanggal: "19 Jan 2025" },
    { idPenjualan: "NZR-00009", kode: "531", namaBarang: "Green Tosca Paint", quantity: 7, type: "GLOSS", hargaJual: 25000, hargaBeli: 20000, tanggal: "20 Jan 2025" },
    { idPenjualan: "NZR-00004", kode: "511", namaBarang: "Black Glossy Enamel", quantity: 12, type: "GLOSS", hargaJual: 35000, hargaBeli: 30000, tanggal: "15 Jan 2025" },
    { idPenjualan: "NZR-00010", kode: "601", namaBarang: "Paint Roller 20cm", quantity: 2, type: "ACCESSORIES", hargaJual: 34000, hargaBeli: 28000, tanggal: "21 Jan 2025" }
];

export const useDetailSalesManagement = () => {
    const [detailSalesData, setDetailSalesData] = useState(DUMMY_DETAIL_DATA);
    const [filteredData, setFilteredData] = useState(DUMMY_DETAIL_DATA);
    const [isLoading, setIsLoading] = useState(false);
    const [error] = useState("");

    // Filter States
    const [search, setSearch] = useState("");
    const [type, setType] = useState("");
    const [storeId, setStoreId] = useState("");
    const [storeOptions] = useState([
        { value: "", label: "Semua Cabang" },
        { value: "store-tegal", label: "NazarPaint Tegal" },
        { value: "store-suradadi", label: "Toko Cabang Suradadi" }
    ]);

    // Pagination State
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    // Simulasi filter data lokal (Client-side filtering untuk dummy UI)
    useEffect(() => {
        let result = [...detailSalesData];

        if (search) {
            result = result.filter(item =>
                item.namaBarang.toLowerCase().includes(search.toLowerCase()) ||
                item.idPenjualan.toLowerCase().includes(search.toLowerCase()) ||
                item.kode.includes(search)
            );
        }

        if (type) {
            result = result.filter(item => item.type === type);
        }

        setFilteredData(result);
        setPagination(prev => ({
            ...prev,
            totalPages: Math.ceil(result.length / prev.limit) || 1
        }));
    }, [search, type, detailSalesData]);

    const handlePageChange = (newPage) => {
        setPagination(prev => ({ ...prev, page: newPage }));
    };

    const handleRowsPerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
    };

    return {
        detailSalesData: filteredData,
        isLoading,
        error,
        search,
        setSearch,
        type,
        setType,
        storeId,
        setStoreId,
        storeOptions,
        pagination,
        handlePageChange,
        handleRowsPerPageChange
    };
};