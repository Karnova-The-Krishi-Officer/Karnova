import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';

const AdminPage = () => {
  const activeTab = useAppStore((s) => s.activeTab);

  const content = useMemo(() => {
    if (activeTab === 'users') return 'Manage farmer registrations, role access, and verification.';
    if (activeTab === 'officers') return 'Assign officers across villages and monitor workloads.';
    if (activeTab === 'schemes') return 'Publish and update scheme catalog with eligibility rules.';
    return 'Admin overview with state-wide service quality indicators.';
  }, [activeTab]);

  return (
    <section className="card">
      <h3>Admin Panel</h3>
      <p>{content}</p>
    </section>
  );
};

export default React.memo(AdminPage);
