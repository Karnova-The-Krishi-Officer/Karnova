import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'light',
      token: '',
      user: null,
      online: navigator.onLine,
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          document.documentElement.classList.toggle('dark', next === 'dark');
          return { theme: next };
        }),
      hydrateTheme: () =>
        set((state) => {
          document.documentElement.classList.toggle('dark', state.theme === 'dark');
          return state;
        }),
      setSession: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: '', user: null }),
      setOnline: (online) => set({ online }),
    }),
    { name: 'karnova-store' },
  ),
);
