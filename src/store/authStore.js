import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (data) =>
        set({
          user: data.user,
          token: data.token,
        }),
      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },
    }),
    {
      name: 'karnova-auth',
      partialize: (state) => ({ user: state.user, token: state.token }),
    },
  ),
);

export default useAuthStore;
