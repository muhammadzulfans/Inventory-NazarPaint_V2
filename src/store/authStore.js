import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Tambahkan createJSONStorage
import { authService } from '../api/services/authService.js';

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email, password) => {
                try {
                    const response = await authService.login({ email, password });
                    const userData = response.data.user;
                    const token = response.data.token;

                    set({
                        user: userData,
                        token: token,
                        isAuthenticated: true,
                    });

                    return { success: true, role: userData.role };
                } catch (error) {
                    return {
                        success: false,
                        message: error.response?.data?.message || 'Login gagal, periksa koneksi Anda',
                    };
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                // Dengan sessionStorage, kita cukup hapus dari session
                sessionStorage.removeItem('auth-storage');
            },
        }),
        {
            name: 'auth-storage',
            // Gunakan sessionStorage agar terisolasi per tab
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default useAuthStore;