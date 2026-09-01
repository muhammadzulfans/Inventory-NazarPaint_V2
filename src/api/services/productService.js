import api from "../axios.js";

export const productService = {
    // GET semua produk
    getAllProducts: async (params = {}) => {
        try {
            const response = await api.get("/products", {params});
            return response.data;
        } catch (error) {
            console.error("Error pada Product Service:", error);
            return { success: false, data: [] };
        }
    },
    
    getStocksByStore: async (params = {}) => {
        try {
            // Nembak ke endpoint /stocks, bukan /products
            const response = await api.get("/stocks", { params });
            return response.data;
        } catch (error) {
            console.error("Error Get Stocks:", error);
            return { success: false, data: [] };
        }
    },

    // GET produk by ID
    getProductById: async (id) => {
        try {
            const response = await api.get(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error Get Product By ID:", error);
            return { success: false, data: null };
        }
    },

    // POST tambah produk baru
    createProduct: async (productData) => {
        try {
            const response = await api.post("/products", productData);
            return response.data;
        } catch (error) {
            console.error("Error Create Product:", error);
            return error.response?.data || { success: false, message: "Gagal menambahkan produk" };
        }
    },

    // PUT update produk
    updateProduct: async (id, productData) => {
        try {
            const response = await api.put(`/products/${id}`, productData);
            return response.data;
        } catch (error) {
            console.error("Error Update Product:", error);
            return error.response?.data || { success: false, message: "Gagal memperbarui produk" };
        }
    },

    // DELETE produk
    deleteProduct: async (id) => {
        try {
            const response = await api.delete(`/products/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error Delete Product:", error);
            return error.response?.data || { success: false, message: "Gagal menghapus produk" };
        }
    },

    toggleStatus: async (id) => {
        const res = await api.patch(`/products/${id}/toggle-status`);
        return res.data;
    },
};