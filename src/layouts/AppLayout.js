import React, { useMemo } from 'react';
import ThemeToggle from '../components/ThemeToggle';
import { APP_NAME, NAV_BY_ROLE } from '../utils/constants';
import { appStore, useAppStore } from '../store/appStore';

const AppLayout = ({ children }) => {
  const role = useAppStore((s) => s.role);
  const activeTab = useAppStore((s) => s.activeTab);
  const isOnline = useAppStore((s) => s.isOnline);

  const tabs = useMemo(() => NAV_BY_ROLE[role] || [], [role]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <h1>{APP_NAME}</h1>
        <p className={`network-pill ${isOnline ? 'online' : 'offline'}`}>{isOnline ? 'Online' : 'Offline'}</p>
        <nav>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={activeTab === tab ? 'active' : ''}
              onClick={() => appStore.setState({ activeTab: tab })}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      <main className="content-area">
        <header className="topbar">
          <ThemeToggle />
          <button onClick={appStore.logout}>Logout</button>
        </header>
        {children}
      </main>
    </div>
  );
};

export default React.memo(AppLayout);
