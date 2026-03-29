import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import AuthLayout from '../../components/layout/AuthLayout';

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

const icons = {
  user: (
    <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.22a2 2 0 0 1 2.11-.45 13.6 13.6 0 0 0 2.62.65A2 2 0 0 1 22 16.92z" />,
  card: <rect x="2" y="6" width="20" height="12" rx="2" />,
  pin: (
    <>
      <path d="M12 22s7-5.5 7-12a7 7 0 1 0-14 0c0 6.5 7 12 7 12Z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
};

const FieldIcon = ({ type }) => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {icons[type]}
  </svg>
);

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

  const Field = ({ label, type = 'text', icon, value, onChange, placeholder, required = false }) => (
    <label className="auth-field">
      <span className="auth-label">{label}</span>
      <div className="auth-input-wrap">
        <FieldIcon type={icon} />
        <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
      </div>
    </label>
  );

  return (
    <AuthLayout>
      <div className="auth-card mx-auto max-w-6xl px-7 py-10 sm:px-14 sm:py-14">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-8 grid h-28 w-28 place-items-center rounded-full bg-emerald-500/20">
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-emerald-400" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18c0-7 5-12 12-12 0 7-5 12-12 12Z" />
              <path d="M6 18c0-4 2-6 6-8" />
            </svg>
          </div>
          <h1 className="text-6xl font-medium text-slate-100">Create Account</h1>
          <p className="mt-3 text-slate-400">Join Karnova Krishi Platform</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Full Name" icon="user" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your full name" required />
            <Field label="Email" type="email" icon="mail" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="your.email@example.com" required />
            <Field label="Phone Number" icon="phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} placeholder="9876543210" required />
            <Field label="Aadhaar Number (Optional)" icon="card" value={form.aadhaar} onChange={(e) => setForm((p) => ({ ...p, aadhaar: e.target.value }))} placeholder="123456789012" />
            <Field label="District" icon="pin" value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} placeholder="Your district" required />
            <Field label="Panchayat" icon="pin" value={form.panchayat} onChange={(e) => setForm((p) => ({ ...p, panchayat: e.target.value }))} placeholder="Your panchayat" required />
            <Field label="Password" type="password" icon="lock" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} placeholder="••••••••" required />
            <Field label="Confirm Password" type="password" icon="lock" value={form.confirmPassword} onChange={(e) => setForm((p) => ({ ...p, confirmPassword: e.target.value }))} placeholder="••••••••" required />
          </div>

          {passwordMismatch ? <p className="text-sm text-rose-300">Passwords do not match.</p> : null}
          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button className="auth-button" type="submit" disabled={!canSubmit}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-10 text-center text-2xl text-slate-400">
          Already have an account?{' '}
          <Link className="text-emerald-400 hover:text-emerald-300" to="/login">
            Sign in here
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
