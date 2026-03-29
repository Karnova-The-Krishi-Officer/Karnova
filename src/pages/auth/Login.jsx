import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import AuthLayout from '../../components/layout/AuthLayout';

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 18c0-7 5-12 12-12 0 7-5 12-12 12Z" />
    <path d="M6 18c0-4 2-6 6-8" />
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = useMemo(() => form.email && form.password && !loading, [form, loading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', {
        identifier: form.email,
        password: form.password,
      });

      login(data);
      localStorage.setItem('token', data.token);

      if (data.user?.role === 'admin') navigate('/admin');
      else if (data.user?.role === 'officer') navigate('/officer');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="auth-card mx-auto max-w-3xl px-6 py-10 sm:px-12 sm:py-14">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-8 grid h-28 w-28 place-items-center rounded-full bg-emerald-500/20">
            <LeafIcon />
          </div>
          <h1 className="text-5xl font-medium text-slate-100">Karnova Krishi</h1>
          <p className="mt-3 text-base text-slate-400">Agricultural Platform for Farmers</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span className="auth-label">Email</span>
            <div className="auth-input-wrap">
              <MailIcon />
              <input
                type="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
          </label>

          <label className="auth-field">
            <span className="auth-label">Password</span>
            <div className="auth-input-wrap">
              <LockIcon />
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
          </label>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button className="auth-button" type="submit" disabled={!canSubmit}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-10 text-center text-2xl text-slate-400">
          Don&apos;t have an account?{' '}
          <Link className="text-emerald-400 hover:text-emerald-300" to="/register">
            Register here
          </Link>
        </p>

        <div className="mt-8 border-t border-white/10 pt-6 text-slate-400">
          <p className="text-xl font-semibold text-slate-200">Test Credentials:</p>
          <p className="mt-2">Admin: Pravith1p93@gmail.com / admin12345</p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
