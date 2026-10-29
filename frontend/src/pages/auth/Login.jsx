import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      const dest = location.state?.from?.pathname || `/${user.role}/dashboard`;
      navigate(dest, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-lg font-semibold text-paper">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet text-ink">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          InternConnect
        </Link>

        <div className="mt-8 rounded-xl2 border border-line bg-surface p-6">
          <h1 className="font-display text-xl font-semibold text-paper">Welcome back</h1>
          <p className="mt-1 text-sm text-mist">Log in to continue.</p>

          {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs text-mist">Email</label>
              <input
                type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper focus:border-cyan"
              />
            </div>
            <div>
              <label className="block text-xs text-mist">Password</label>
              <input
                type="password" required value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper focus:border-cyan"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan to-violet px-4 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-mist">
            Don't have an account? <Link to="/register" className="text-cyan hover:text-cyan-soft">Register</Link>
          </p>
        </div>

        <div className="mt-5 rounded-xl2 border border-dashed border-line p-4 text-xs text-mist">
          <p className="font-medium text-paper mb-1">Demo accounts</p>
          <p>admin@internconnect.com · mentor@internconnect.com · student@internconnect.com</p>
          <p className="mt-1">Password: Demo@1234</p>
        </div>
      </div>
    </div>
  );
}
