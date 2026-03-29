import React, { useCallback, useMemo, useState } from 'react';
import { useAppStore, appStore } from '../store/appStore';
import { queryService } from '../services/api';
import { offlineDb } from '../utils/indexedDb';

const FarmerPage = () => {
  const user = useAppStore((s) => s.user);
  const isOnline = useAppStore((s) => s.isOnline);
  const activeTab = useAppStore((s) => s.activeTab);
  const [input, setInput] = useState('');
  const [queries, setQueries] = useState([]);

  const submitQuery = useCallback(async () => {
    if (!input.trim()) return;

    const payload = { content: input, channel: 'text' };
    if (!isOnline) {
      await offlineDb.addAction({ type: 'query.create', payload, createdAt: Date.now() });
      setQueries((prev) => [{ ...payload, status: 'queued offline' }, ...prev]);
      appStore.addToast({ type: 'info', message: 'Saved offline. Will sync once online.' });
      setInput('');
      return;
    }

    try {
      await queryService.create(user?.token, payload);
      setQueries((prev) => [{ ...payload, status: 'submitted' }, ...prev]);
      setInput('');
      appStore.addToast({ type: 'success', message: 'Query submitted.' });
    } catch (error) {
      appStore.addToast({ type: 'error', message: error.message });
    }
  }, [input, isOnline, user]);

  const panel = useMemo(() => {
    if (activeTab === 'queries') {
      return (
        <section className="card">
          <h3>Ask Query</h3>
          <textarea placeholder="Describe crop issue, upload image path, or voice note ID" value={input} onChange={(e) => setInput(e.target.value)} />
          <button onClick={submitQuery}>Submit Query</button>
          <div className="list">
            {queries.map((q, idx) => (
              <article key={`${q.content}-${idx}`} className="list-item">
                <p>{q.content}</p>
                <small>{q.status}</small>
              </article>
            ))}
          </div>
        </section>
      );
    }

    if (activeTab === 'schemes') return <section className="card"><h3>Schemes</h3><p>Apply for subsidy, insurance, and support programs.</p></section>;
    if (activeTab === 'marketplace') return <section className="card"><h3>Marketplace</h3><p>Trade produce, machinery, and inputs with verified partners.</p></section>;
    if (activeTab === 'community') return <section className="card"><h3>Community</h3><p>Post local insights and learn from nearby farmers.</p></section>;

    return <section className="card"><h3>Farmer Dashboard</h3><p>Monitor crop health, rainfall alerts, and open support tickets.</p></section>;
  }, [activeTab, input, queries, submitQuery]);

  return <>{panel}</>;
};

export default React.memo(FarmerPage);
