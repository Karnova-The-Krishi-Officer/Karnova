import { useEffect, useState } from 'react';
import api from '../../services/api';
import GlassCard from '../../components/cards/GlassCard';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const defaultForm = {
  name: '',
  email: '',
  phone: '',
  district: '',
  panchayat: '',
  password: '',
};

const CreateOfficerPage = () => {
  const [form, setForm] = useState(defaultForm);
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadOfficers = async () => {
    try {
      const { data } = await api.get('/users/');
      setOfficers((data || []).filter((user) => user.role === 'officer'));
    } catch {
      setOfficers([]);
    }
  };

  useEffect(() => {
    loadOfficers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await api.post('/admin/officers', form);
      setForm(defaultForm);
      setMessage('Officer account created successfully.');
      await loadOfficers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not create officer account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Create Officer</h1>

      <GlassCard className="p-5">
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
          <Input label="Full Name" placeholder="Officer name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
          <Input label="Email" type="email" placeholder="officer@example.com" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
          <Input label="Phone Number" placeholder="9876543210" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
          <Input label="District" placeholder="District" value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} required />
          <Input label="Panchayat" placeholder="Panchayat" value={form.panchayat} onChange={(e) => setForm((p) => ({ ...p, panchayat: e.target.value }))} required />
          <Input label="Password" type="password" placeholder="Create password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
          <div className="md:col-span-2">
            <Button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create Officer Account'}</Button>
          </div>
        </form>

        {message ? <p className="mt-4 text-emerald-400">{message}</p> : null}
        {error ? <p className="mt-4 text-rose-300">{error}</p> : null}
      </GlassCard>

      <GlassCard className="p-5">
        <h2 className="mb-4 text-xl font-medium">Existing Officers</h2>
        <div className="space-y-2">
          {officers.map((officer) => (
            <div key={officer._id} className="flex items-center justify-between rounded-xl border border-white/10 p-3">
              <div>
                <p>{officer.name || officer.identifier}</p>
                <p className="text-sm text-slate-400">{officer.identifier}</p>
              </div>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">Officer</span>
            </div>
          ))}
          {!officers.length ? <p className="text-slate-500">No officers created yet.</p> : null}
        </div>
      </GlassCard>
    </div>
  );
};

export default CreateOfficerPage;
