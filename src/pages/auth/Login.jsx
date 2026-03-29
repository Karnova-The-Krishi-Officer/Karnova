import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import AuthLayout from '../../components/layout/AuthLayout';
import GlassCard from '../../components/cards/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

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
      <GlassCard className="mx-auto max-w-2xl p-6 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold">Karnova Krishi</h1>
          <p className="mt-2 text-slate-400">Agricultural Platform for Farmers</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" disabled={!canSubmit}>{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Don&apos;t have an account?{' '}
          <Link className="text-emerald-400 hover:text-emerald-300" to="/register">
            Register here
          </Link>
        </p>
      </GlassCard>
    </AuthLayout>
  );
};

export default Login;
