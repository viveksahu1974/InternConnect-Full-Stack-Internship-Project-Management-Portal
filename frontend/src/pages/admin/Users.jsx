import { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { userApi } from '../../api/userApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';

const EMPTY = { name: '', email: '', password: '', role: 'student' };

export default function AdminUsers() {
  const [state, setState] = useState({ status: 'loading', data: [], pagination: null });
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState('');
  const [confirming, setConfirming] = useState(null);
  const [page, setPage] = useState(1);

  const load = () => {
    setState((s) => ({ ...s, status: 'loading' }));
    userApi.list({ search: search || undefined, role: role || undefined, page, limit: 10 })
      .then((res) => setState({ status: 'ready', data: res.data, pagination: res.pagination }))
      .catch(() => setState({ status: 'error', data: [], pagination: null }));
  };

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, role, page]);

  const createUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await userApi.create(form);
      setShowForm(false);
      setForm(EMPTY);
      load();
    } catch (err) {
      setFormError(err.response?.data?.errors?.[0]?.message || 'Could not create user.');
    }
  };

  const toggleStatus = async (u) => {
    await userApi.update(u.id, { status: u.status === 'active' ? 'inactive' : 'active' });
    load();
  };

  const remove = async () => {
    await userApi.remove(confirming);
    setConfirming(null);
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-semibold text-paper">Users</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan to-violet px-3.5 py-2 text-sm font-medium text-ink hover:opacity-90">
          <Plus className="h-4 w-4" /> New user
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <input
          value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name or email"
          className="flex-1 min-w-[220px] rounded-lg border border-line bg-surface px-3 py-2 text-sm text-paper focus:border-cyan"
        />
        <select value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-paper">
          <option value="">All roles</option>
          <option value="student">Student</option>
          <option value="mentor">Mentor</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="mt-5">
        {state.status === 'loading' ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto rounded-xl2 border border-line">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-surface2 text-left text-xs text-mist">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((u) => (
                  <tr key={u.id} className="border-b border-line/60 last:border-0 bg-surface">
                    <td className="px-4 py-3 text-paper">{u.name}</td>
                    <td className="px-4 py-3 text-mist">{u.email}</td>
                    <td className="px-4 py-3 capitalize text-mist">{u.role}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleStatus(u)}><StatusBadge status={u.status} /></button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setConfirming(u.id)} className="text-mist hover:text-red-400" aria-label={`Delete ${u.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {state.pagination && state.pagination.totalPages > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {Array.from({ length: state.pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`h-8 w-8 rounded-lg text-xs ${p === page ? 'bg-cyan text-ink' : 'border border-line text-mist'}`}>{p}</button>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form onSubmit={createUser} className="w-full max-w-sm rounded-xl2 border border-line bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-paper">New user</h3>
            {formError && <p className="mt-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs text-red-300">{formError}</p>}
            <div className="mt-4 space-y-3">
              <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan" />
              <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan" />
              <input required type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan" />
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan">
                <option value="student">Student</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-mist hover:text-paper">Cancel</button>
              <button type="submit" className="rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-ink hover:bg-cyan-soft">Create</button>
            </div>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={!!confirming}
        title="Delete this user?"
        description="This permanently removes their account and related data."
        confirmLabel="Delete"
        danger
        onConfirm={remove}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
