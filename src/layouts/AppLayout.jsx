import { Outlet } from 'react-router-dom';
import { NavBar } from '../components/NavBar';
import { Sidebar } from '../components/Sidebar';

export const AppLayout = () => (
  <div className="min-h-screen">
    <NavBar />
    <main className="mx-auto grid max-w-7xl gap-4 px-4 py-4 md:grid-cols-[240px_1fr]">
      <Sidebar />
      <section className="space-y-4">
        <Outlet />
      </section>
    </main>
  </div>
);
