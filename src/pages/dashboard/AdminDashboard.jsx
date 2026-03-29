import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/cards/GlassCard';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    const load = async () => {
      const [usersRes, queriesRes] = await Promise.allSettled([api.get('/users/'), api.get('/officer/escalations')]);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data || []);
      if (queriesRes.status === 'fulfilled') setQueries(queriesRes.value.data || []);
    };
    load();
  }, []);

  const analytics = useMemo(() => {
    const totalUsers = users.length;
    const activeQueries = queries.filter((q) => q.status !== 'resolved').length;
    const resolutionRate = queries.length
      ? Math.round((queries.filter((q) => q.status === 'resolved').length / queries.length) * 100)
      : 0;
    return { totalUsers, activeQueries, resolutionRate };
  }, [users, queries]);

  const updateRole = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}`, { role });
    } catch {
      // endpoint may not be present in all environments
    }

    setUsers((prev) => prev.map((user) => (user._id === id ? { ...user, role } : user)));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <GlassCard className="p-5"><p className="text-slate-400">Total Users</p><p className="text-3xl font-semibold">{analytics.totalUsers}</p></GlassCard>
        <GlassCard className="p-5"><p className="text-slate-400">Active Queries</p><p className="text-3xl font-semibold">{analytics.activeQueries}</p></GlassCard>
        <GlassCard className="p-5"><p className="text-slate-400">Resolution Rate</p><p className="text-3xl font-semibold">{analytics.resolutionRate}%</p></GlassCard>
      </div>

      <GlassCard className="p-5">
        <h2 className="text-2xl font-medium mb-4">Manage Users</h2>
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user._id} className="rounded-xl border border-white/10 p-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p>{user.name || user.identifier}</p>
                <p className="text-sm text-slate-400">{user.identifier}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge status={user.role === 'admin' ? 'resolved' : user.role === 'officer' ? 'open' : 'pending'} />
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user._id, e.target.value)}
                  className="rounded-xl border border-white/10 bg-black/20 px-3 py-2"
                >
                  <option value="farmer">farmer</option>
                  <option value="officer">officer</option>
                  <option value="admin">admin</option>
                </select>
                <Button variant="ghost" className="w-auto" onClick={() => updateRole(user._id, 'farmer')}>
                  Reset Role
                </Button>
              </div>
            </div>
          ))}
          {!users.length ? <p className="text-slate-500">No users available.</p> : null}
        </div>
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="text-2xl font-medium mb-4">All System Queries</h2>
        <div className="space-y-3">
          {queries.map((query) => (
            <div key={query.id} className="rounded-xl border border-white/10 p-3 flex items-center justify-between gap-3">
              <p>{query.query}</p>
              <Badge status={query.status || 'open'} />
            </div>
          ))}
          {!queries.length ? <p className="text-slate-500">No queries found.</p> : null}
        </div>
      </GlassCard>
    </div>
  );
};

export default AdminDashboard;
