import { NavLink, Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const DashboardShell = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const links = [
    { to: '/dashboard', label: 'Farmer', roles: ['farmer'] },
    { to: '/officer', label: 'Officer', roles: ['officer'] },
    { to: '/admin', label: 'Admin', roles: ['admin'] },
  ];

  return (
    <div className="min-h-screen bg-karnova-gradient text-slate-100">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-8">
          <div>
            <p className="text-lg font-semibold">Karnova Krishi Platform</p>
            <p className="text-sm text-slate-400">{user?.role || 'user'} panel</p>
          </div>
          <button
            onClick={logout}
            className="rounded-xl border border-white/20 px-3 py-2 text-sm hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-8 md:grid-cols-[220px_1fr]">
        <aside className="rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-lg h-fit">
          <nav className="space-y-2">
            {links
              .filter((item) => item.roles.includes(user?.role))
              .map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block rounded-xl px-3 py-2 text-sm transition ${
                      isActive ? 'bg-emerald-500 text-white' : 'text-slate-300 hover:bg-white/10'
                    }`
                  }
                >
                  {item.label} Dashboard
                </NavLink>
              ))}
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
