import React, { Suspense, lazy, useMemo } from 'react';
import './App.css';
import AppLayout from './layouts/AppLayout';
import Skeleton from './components/Skeleton';
import ToastContainer from './components/ToastContainer';
import { useAppStore } from './store/appStore';
import { useOnlineSync } from './hooks/useOnlineSync';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const FarmerPage = lazy(() => import('./pages/FarmerPage'));
const OfficerPage = lazy(() => import('./pages/OfficerPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

const App = () => {
  const user = useAppStore((s) => s.user);
  const role = useAppStore((s) => s.role);
  useOnlineSync();

  const panel = useMemo(() => {
    if (role === 'officer') return <OfficerPage />;
    if (role === 'admin') return <AdminPage />;
    return <FarmerPage />;
  }, [role]);

  return (
    <>
      <Suspense fallback={<Skeleton lines={6} />}>
        {user ? <AppLayout>{panel}</AppLayout> : <LoginPage />}
      </Suspense>
      <ToastContainer />
    </>
  );
};

export default App;
