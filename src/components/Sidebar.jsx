import { NavLink } from 'react-router-dom';
import { useMemo } from 'react';
import { useAppStore } from '../store/useAppStore';

export const Sidebar = () => {
  const role = useAppStore((s) => s.user?.role || 'farmer');
  const links = useMemo(() => {
    const base = [
      { to: '/', label: 'Dashboard' },
      { to: '/queries', label: 'AI Queries' },
      { to: '/schemes', label: 'Schemes' },
      { to: '/marketplace', label: 'Marketplace' },
    ];
    if (role === 'admin') base.push({ to: '/admin/users', label: 'User Management' });
    if (role === 'officer') base.push({ to: '/officer/escalations', label: 'Escalations' });
    return base;
  }, [role]);

  return (
    <aside className="card p-4 h-fit">
      <nav className="space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `block rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-brand-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
