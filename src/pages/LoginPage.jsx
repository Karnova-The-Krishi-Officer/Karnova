import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { apiFetch } from '../services/api';

const LoginPage = () => {
  const setSession = useAppStore((s) => s.setSession);
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(form) });
      setSession(data);
      navigate('/');
    } catch {
      setError('Unable to login. Try demo credentials: admin@karnova.local / admin123');
    }
  };

  return (
    <div className="min-h-screen grid place-items-center px-4 bg-gradient-to-b from-brand-50 to-sky-100 dark:from-slate-900 dark:to-slate-950">
      <form onSubmit={onSubmit} className="card w-full max-w-md p-6 space-y-4">
        <h1 className="text-2xl font-bold">Karnova Login</h1>
        <input className="w-full rounded-xl border p-3 bg-transparent" placeholder="Email / Phone / Krishi ID" onChange={(e) => setForm({ ...form, identifier: e.target.value })} />
        <input className="w-full rounded-xl border p-3 bg-transparent" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-rose-600">{error}</p>}
        <button className="w-full rounded-xl bg-brand-500 py-3 text-white font-semibold">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
