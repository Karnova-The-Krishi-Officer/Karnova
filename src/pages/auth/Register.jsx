import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../components/layout/AuthLayout';
import GlassCard from '../../components/cards/GlassCard';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const defaultState = {
  name: '',
  email: '',
  phone: '',
  aadhaar: '',
  district: '',
  panchayat: '',
  password: '',
  confirmPassword: '',
};

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordMismatch = form.password && form.confirmPassword && form.password !== form.confirmPassword;
  const canSubmit = useMemo(
    () =>
      !loading &&
      form.name &&
      form.email &&
      form.phone &&
      form.district &&
      form.panchayat &&
      form.password &&
      form.confirmPassword &&
      !passwordMismatch,
    [form, loading, passwordMismatch],
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (passwordMismatch) return;

    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        aadhaar: form.aadhaar || undefined,
        district: form.district,
        panchayat: form.panchayat,
        password: form.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to register account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <GlassCard className="mx-auto max-w-5xl p-6 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-semibold">Create Account</h1>
          <p className="mt-2 text-slate-400">Join Karnova Krishi Platform</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Full Name" placeholder="Your full name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} required />
            <Input label="Email" type="email" placeholder="your.email@example.com" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required />
            <Input label="Phone Number" placeholder="9876543210" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required />
            <Input label="Aadhaar Number (Optional)" placeholder="123456789012" value={form.aadhaar} onChange={(e) => setForm((prev) => ({ ...prev, aadhaar: e.target.value }))} />
            <Input label="District" placeholder="Your district" value={form.district} onChange={(e) => setForm((prev) => ({ ...prev, district: e.target.value }))} required />
            <Input label="Panchayat" placeholder="Your panchayat" value={form.panchayat} onChange={(e) => setForm((prev) => ({ ...prev, panchayat: e.target.value }))} required />
            <Input label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} required />
            <Input label="Confirm Password" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} required />
          </div>

          {passwordMismatch ? <p className="text-sm text-rose-300">Passwords do not match.</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
          <Button type="submit" disabled={!canSubmit}>{loading ? 'Creating account...' : 'Create Account'}</Button>
        </form>

        <p className="mt-6 text-center text-slate-400">
          Already have an account?{' '}
          <Link className="text-emerald-400 hover:text-emerald-300" to="/login">
            Sign in here
          </Link>
        </p>
      </GlassCard>
    </AuthLayout>
  );
};

export default Register;
