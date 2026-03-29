import React, { Suspense, lazy, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import useAuthStore from './store/authStore';
import DashboardShell from './components/layout/DashboardShell';
import ProtectedRoute from './routes/ProtectedRoute';
import { initOfflineSync, syncQueuedQueries } from './services/offlineSync';

const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const FarmerDashboard = lazy(() => import('./pages/dashboard/FarmerDashboard'));
const OfficerDashboard = lazy(() => import('./pages/dashboard/OfficerDashboard'));
const AdminDashboard = lazy(() => import('./pages/dashboard/AdminDashboard'));
const CreateOfficerPage = lazy(() => import('./pages/admin/CreateOfficerPage'));

const HomeRedirect = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'officer') return <Navigate to="/officer" replace />;
  return <Navigate to="/dashboard" replace />;
};

const App = () => {
  useEffect(() => {
    initOfflineSync();
    syncQueuedQueries().catch(() => null);
  }, []);

  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen grid place-items-center bg-karnova-gradient text-slate-200">Loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomeRedirect />} />
            <Route element={<DashboardShell />}>
              <Route path="/dashboard" element={<FarmerDashboard />} />
              <Route element={<ProtectedRoute roles={['officer']} />}>
                <Route path="/officer" element={<OfficerDashboard />} />
              </Route>
              <Route element={<ProtectedRoute roles={['admin']} />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/officers" element={<CreateOfficerPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
