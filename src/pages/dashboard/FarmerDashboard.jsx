import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import GlassCard from '../../components/cards/GlassCard';
import TextArea from '../../components/ui/TextArea';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { addOfflineAction } from '../../services/idb';
import { syncQueuedQueries } from '../../services/offlineSync';

const FarmerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentQueries, setRecentQueries] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [schemesRes, historyRes] = await Promise.allSettled([
          api.get('/farmer/schemes'),
          api.get('/farmer/queries'),
        ]);

        if (schemesRes.status === 'fulfilled') {
          setSchemes(schemesRes.value.data || []);
        }

        if (historyRes.status === 'fulfilled') {
          setRecentQueries(historyRes.value.data || []);
        }
      } catch {
        // no-op
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    syncQueuedQueries().catch(() => null);
  }, []);

  const stats = useMemo(() => {
    const total = recentQueries.length;
    const resolved = recentQueries.filter((item) => item.status === 'resolved').length;
    return { total, resolved, pending: Math.max(total - resolved, 0) };
  }, [recentQueries]);

  const submitQuery = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setNotice('');

    const payload = { text: query.trim(), type: 'text' };

    try {
      if (!navigator.onLine) {
        await addOfflineAction({
          id: crypto.randomUUID(),
          type: 'ai_query',
          payload,
          createdAt: new Date().toISOString(),
        });
        setNotice('You are offline. Query queued and will sync automatically.');
        setQuery('');
        return;
      }

      const { data } = await api.post('/ai/query', payload);
      setRecentQueries((prev) => [
        {
          id: crypto.randomUUID(),
          text: payload.text,
          answer: data.answer,
          status: 'resolved',
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      setNotice('Query submitted successfully.');
      setQuery('');
    } catch {
      setNotice('Unable to submit query right now.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-4xl font-semibold">Welcome, {user?.name || 'Farmer'}</h1>
        <p className="mt-2 text-slate-400">
          Krishi ID: {user?.krishiId || 'N/A'} • {user?.district || 'Location unavailable'}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <GlassCard className="p-5">
          <h2 className="text-3xl font-medium">Ask AI Assistant</h2>
          <p className="text-slate-400">Get instant farming advice</p>
          <div className="mt-4 space-y-4">
            <TextArea
              rows={4}
              placeholder="Ask anything about farming, crops, weather, schemes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={submitQuery} disabled={!query.trim() || loading}>
              {loading ? 'Submitting...' : 'Submit Query'}
            </Button>
            {notice ? <p className="text-sm text-emerald-300">{notice}</p> : null}
          </div>
        </GlassCard>

        <div className="space-y-6">
          <GlassCard className="p-5">
            <h3 className="text-2xl font-medium">Active Schemes</h3>
            <ul className="mt-3 space-y-2 text-slate-300">
              {schemes.length ? (
                schemes.map((scheme) => <li key={scheme.id || scheme.name}>• {scheme.name}</li>)
              ) : (
                <li className="text-slate-500">No active schemes</li>
              )}
            </ul>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-2xl font-medium">Quick Stats</h3>
            <div className="mt-3 space-y-2 text-slate-300">
              <p className="flex justify-between"><span>Total Queries</span><span>{stats.total}</span></p>
              <p className="flex justify-between"><span>Resolved</span><span>{stats.resolved}</span></p>
              <p className="flex justify-between"><span>Pending</span><span>{stats.pending}</span></p>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="p-5">
        <h3 className="text-2xl font-medium">Recent Queries</h3>
        <div className="mt-4 space-y-3">
          {recentQueries.length ? (
            recentQueries.map((item) => (
              <div key={item.id || item._id} className="rounded-xl border border-white/10 p-3">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="line-clamp-1">{item.text || item.query || 'Query'}</p>
                  <Badge status={item.status || 'pending'} />
                </div>
                {item.answer ? <p className="text-sm text-slate-400">{item.answer}</p> : null}
              </div>
            ))
          ) : (
            <p className="text-slate-500">No queries yet.</p>
          )}
        </div>
      </GlassCard>
    </div>
  );
};

export default FarmerDashboard;
