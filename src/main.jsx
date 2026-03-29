import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import { AppLayout } from './layouts/AppLayout';
import { useAppStore } from './store/useAppStore';
import { initSyncEngine } from './services/syncEngine';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const QueryPage = lazy(() => import('./pages/QueryPage'));
const SchemesPage = lazy(() => import('./pages/SchemesPage'));
const MarketplacePage = lazy(() => import('./pages/MarketplacePage'));
const AdminUsersPage = lazy(() => import('./pages/AdminUsersPage'));
const OfficerEscalationsPage = lazy(() => import('./pages/OfficerEscalationsPage'));

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

initSyncEngine();

const Protected = ({ children }) => {
  const token = useAppStore((state) => state.token);
  return token ? children : <Navigate to="/login" replace />;
};

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <AppLayout />
            </Protected>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="queries" element={<QueryPage />} />
          <Route path="schemes" element={<SchemesPage />} />
          <Route path="marketplace" element={<MarketplacePage />} />
          <Route path="admin/users" element={<AdminUsersPage />} />
          <Route path="officer/escalations" element={<OfficerEscalationsPage />} />
        </Route>
      </Routes>
    </Suspense>
  </BrowserRouter>
);

createRoot(document.getElementById('root')).render(<App />);
