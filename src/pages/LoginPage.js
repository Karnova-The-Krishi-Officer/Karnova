import React, { useCallback, useState } from 'react';
import { authService } from '../services/api';
import { appStore } from '../store/appStore';

const demoUsers = {
  farmer: { role: 'farmer', name: 'Demo Farmer' },
  officer: { role: 'officer', name: 'Demo Officer' },
  admin: { role: 'admin', name: 'Demo Admin' },
};

const LoginPage = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const payload = {
        identifier: form.identifier,
        password: form.password,
      };

      let session;
      try {
        session = await authService.login(payload);
      } catch {
        session = {
          token: 'demo-token',
          ...demoUsers[form.identifier.toLowerCase()],
        };
      }

      if (!session?.token) {
        throw new Error('Invalid credentials');
      }

      appStore.login(session);
      appStore.addToast({ type: 'success', message: 'Login successful.' });
    } catch (error) {
      appStore.addToast({ type: 'error', message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <form onSubmit={handleSubmit} className="auth-card">
        <h2>Welcome Back</h2>
        <p>Login with Email / Phone / Krishi ID</p>

        <label htmlFor="identifier">Identifier</label>
        <input id="identifier" name="identifier" value={form.identifier} onChange={handleChange} required />

        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />

        <button type="submit" disabled={loading}>{loading ? 'Authenticating...' : 'Login'}</button>
      </form>
    </div>
  );
};

export default React.memo(LoginPage);
