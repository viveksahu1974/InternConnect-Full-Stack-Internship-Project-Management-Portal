import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { FolderKanban } from 'lucide-react';

const EMPTY = {
  title: '', description: '', objectives: '', requirements: '', category: 'Frontend',
  difficulty: 'beginner', duration: '', seats: 1, applicationDeadline: '', startDate: '', endDate: '', skills: '',
};

export default function MentorProjects() {
  const { user } = useAuth();
  const [state, setState] = useState({ status: 'loading', data: [] });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    projectApi.list({ mentor: user.id, limit: 50 })
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: [] }));
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await projectApi.create({ ...form, skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean) });
      setShowForm(false);
      setForm(EMPTY);
      load();
    } finally {
      setSaving(false);
    }
  };

  if (state.status === 'loading') return <LoadingSpinner label="Loading projects..." />;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-paper">My Projects</h1>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan to-violet px-3.5 py-2 text-sm font-medium text-ink hover:opacity-90">
          <Plus className="h-4 w-4" /> New project
        </button>
      </div>

      <div className="mt-6">
        {state.data.length === 0 ? (
          <EmptyState icon={FolderKanban} title="No projects yet" description="Create your first project to start accepting applications." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {state.data.map((p) => (
              <Link key={p.id} to={`/projects/${p.id}`} className="rounded-xl2 border border-line bg-surface p-5 hover:border-cyan/50">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-paper">{p.title}</h3>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-mist">{p.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form onSubmit={submit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-xl2 border border-line bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-paper">New project</h3>
            <div className="mt-4 space-y-3">
              <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} required />
              <Textarea label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} required />
              <Textarea label="Objectives" value={form.objectives} onChange={(v) => setForm({ ...form, objectives: v })} />
              <Textarea label="Requirements" value={form.requirements} onChange={(v) => setForm({ ...form, requirements: v })} />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-mist">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan">
                    {['Frontend', 'Backend', 'Full Stack', 'AI/ML', 'Database'].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-mist">Difficulty</label>
                  <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan">
                    {['beginner', 'intermediate', 'advanced'].map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Duration" value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="e.g. 6 weeks" />
                <Input label="Seats" type="number" value={form.seats} onChange={(v) => setForm({ ...form, seats: v })} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Input label="Apply by" type="date" value={form.applicationDeadline} onChange={(v) => setForm({ ...form, applicationDeadline: v })} />
                <Input label="Start" type="date" value={form.startDate} onChange={(v) => setForm({ ...form, startDate: v })} />
                <Input label="End" type="date" value={form.endDate} onChange={(v) => setForm({ ...form, endDate: v })} />
              </div>
              <Input label="Skills (comma separated)" value={form.skills} onChange={(v) => setForm({ ...form, skills: v })} placeholder="React, Node.js" />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-mist hover:text-paper">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-ink hover:bg-cyan-soft disabled:opacity-60">
                {saving ? 'Creating...' : 'Create project'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Input({ label, value, onChange, type = 'text', required, placeholder }) {
  return (
    <div>
      <label className="block text-xs text-mist">{label}{required && ' *'}</label>
      <input
        type={type} required={required} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
      />
    </div>
  );
}

function Textarea({ label, value, onChange, required }) {
  return (
    <div>
      <label className="block text-xs text-mist">{label}{required && ' *'}</label>
      <textarea
        required={required} rows={2} value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
      />
    </div>
  );
}
