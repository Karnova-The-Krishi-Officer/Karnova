import { useEffect, useCallback } from 'react';
import { appStore, useAppStore } from '../store/appStore';

export const useTheme = () => {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    appStore.setTheme(theme === 'light' ? 'dark' : 'light');
  }, [theme]);

  return { theme, toggleTheme };
};
