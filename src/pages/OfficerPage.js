import React, { useMemo } from 'react';
import { useAppStore } from '../store/appStore';

const OfficerPage = () => {
  const activeTab = useAppStore((s) => s.activeTab);

  const content = useMemo(() => {
    if (activeTab === 'queue') return 'View all incoming farmer queries sorted by urgency.';
    if (activeTab === 'escalations') return 'Review escalated tickets requiring district-level intervention.';
    if (activeTab === 'responses') return 'Respond with agronomic advice and resolution notes.';
    return 'Officer dashboard with SLA metrics and pending load.';
  }, [activeTab]);

  return (
    <section className="card">
      <h3>Officer Panel</h3>
      <p>{content}</p>
    </section>
  );
};

export default React.memo(OfficerPage);
