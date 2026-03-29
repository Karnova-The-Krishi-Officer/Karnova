import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';

export const NavBar = memo(() => {
  const { theme, toggleTheme, online, user, logout } = useAppStore();
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link className="text-lg font-bold text-brand-700 dark:text-brand-500" to="/">
          {import.meta.env.VITE_APP_NAME || 'Karnova'}
        </Link>
        <div className="flex items-center gap-3">
          <span className={`text-xs px-2 py-1 rounded ${online ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {online ? 'Online' : 'Offline'}
          </span>
          <button className="card px-3 py-1 text-sm" onClick={toggleTheme}>{theme === 'light' ? 'Dark' : 'Light'}</button>
          <span className="text-sm">{user?.role || 'guest'}</span>
          <button className="card px-3 py-1 text-sm" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
});
