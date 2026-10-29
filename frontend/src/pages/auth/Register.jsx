import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = await register(form);
      navigate(`/${user.role}/dashboard`, { replace: true });
    } catch (err) {
      setError(err.response?.data?.errors?.[0]?.message || err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-5 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="flex items-center justify-center gap-2 font-display text-lg font-semibold text-paper">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan to-violet text-ink">
            <Zap className="h-4 w-4" strokeWidth={2.5} />
          </span>
          InternConnect
        </Link>

        <div className="mt-8 rounded-xl2 border border-line bg-surface p-6">
          <h1 className="font-display text-xl font-semibold text-paper">Create your account</h1>
          <p className="mt-1 text-sm text-mist">Join as a student or a mentor.</p>

          {error && <p className="mt-4 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{error}</p>}

          <form onSubmit={submit} className="mt-5 space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {['student', 'mentor'].map((r) => (
                <button
                  key={r} type="button" onClick={() => setForm({ ...form, role: r })}
                  className={`rounded-lg border px-3 py-2 text-sm capitalize transition-colors ${
                    form.role === r ? 'border-cyan bg-cyan/10 text-cyan-soft' : 'border-line text-mist'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <div>
              <label className="block text-xs text-mist">Full name</label>
              <input
                required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2.5 text-sm text-paper focus:border-cyan"
              />
            </div>
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
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-mist">
            Already have an account? <Link to="/login" className="text-cyan hover:text-cyan-soft">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
