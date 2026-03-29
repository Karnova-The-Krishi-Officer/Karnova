import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/cards/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const OfficerDashboard = () => {
  const [queries, setQueries] = useState([]);
  const [district, setDistrict] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/officer/escalations');
        setQueries(data || []);
      } catch {
        setQueries([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(
    () =>
      queries.filter((item) => {
        const districtOk = district ? (item.district || '').toLowerCase().includes(district.toLowerCase()) : true;
        const statusOk = status ? item.status === status : true;
        return districtOk && statusOk;
      }),
    [queries, district, status],
  );

  const updateQuery = async (id, nextStatus, responseText = '') => {
    try {
      await api.patch(`/officer/queries/${id}`, { status: nextStatus, response: responseText });
    } catch {
      // fallback in environments without endpoint
    }
    setQueries((prev) => prev.map((item) => (item.id === id ? { ...item, status: nextStatus, response: responseText || item.response } : item)));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Officer Dashboard</h1>
      <GlassCard className="p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <Input label="District" placeholder="Filter by district" value={district} onChange={(e) => setDistrict(e.target.value)} />
          <label className="space-y-2 block">
            <span className="text-xs sm:text-sm tracking-[0.2em] text-slate-400 uppercase">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-2xl border border-white/15 bg-black/20 px-4 py-3"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
              <option value="open">Open</option>
            </select>
          </label>
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="text-2xl font-medium mb-3">Farmer Queries</h2>
        {loading ? <p>Loading queries...</p> : null}
        {!loading && !filtered.length ? <p className="text-slate-500">No queries found.</p> : null}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="rounded-2xl border border-white/10 p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{item.query || item.text}</p>
                <Badge status={item.status || 'open'} />
              </div>
              <textarea
                className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                placeholder="Respond to farmer"
                defaultValue={item.response || ''}
                onBlur={(e) => updateQuery(item.id, item.status || 'open', e.target.value)}
              />
              <Button className="sm:w-auto" onClick={() => updateQuery(item.id, 'resolved', item.response || '')}>
                Mark Resolved
              </Button>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
};

export default OfficerDashboard;
