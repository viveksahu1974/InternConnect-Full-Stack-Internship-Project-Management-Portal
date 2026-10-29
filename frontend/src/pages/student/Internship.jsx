import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import { internshipApi } from '../../api/internshipApi';
import { submissionApi } from '../../api/submissionApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';

export default function StudentInternship() {
  const [state, setState] = useState({ status: 'loading', data: null });
  const [openTask, setOpenTask] = useState(null);
  const [form, setForm] = useState({ content: '', githubUrl: '', liveUrl: '', fileUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    internshipApi.mine()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: null }));
  };

  useEffect(() => { load(); }, []);

  const submitTask = async (taskId) => {
    setSubmitting(true);
    try {
      await submissionApi.create(taskId, form);
      setOpenTask(null);
      setForm({ content: '', githubUrl: '', liveUrl: '', fileUrl: '' });
      load();
    } finally {
      setSubmitting(false);
    }
  };

  if (state.status === 'loading') return <LoadingSpinner label="Loading internship..." />;

  if (!state.data) {
    return (
      <EmptyState
        icon={Briefcase}
        title="No active internship"
        description="Once your application is accepted, your internship roadmap will show up here."
        action={<Link to="/projects" className="mt-2 rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-ink hover:bg-cyan-soft">Browse projects</Link>}
      />
    );
  }

  const i = state.data;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-paper">{i.project?.title}</h1>
          <p className="mt-1 text-mist">Mentor: {i.mentor?.name} · {i.mentor?.email}</p>
        </div>
        <StatusBadge status={i.status} />
      </div>

      <div className="mt-4 rounded-xl2 border border-line bg-surface p-5">
        <div className="flex justify-between text-sm"><span className="text-mist">Overall progress</span><span className="text-paper font-medium">{i.overallProgress}%</span></div>
        <div className="mt-2 h-2 rounded-full bg-line/50">
          <div className="h-2 rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${i.overallProgress}%` }} />
        </div>
      </div>

      <div className="mt-8 space-y-5">
        {(i.Milestones || []).map((m) => (
          <div key={m.id} className="rounded-xl2 border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display font-semibold text-paper">{m.title}</h3>
              <div className="flex items-center gap-3">
                <span className="text-xs text-mist">{m.progress}%</span>
                <StatusBadge status={m.status} />
              </div>
            </div>
            <p className="mt-1 text-sm text-mist">{m.description}</p>

            <div className="mt-4 space-y-2">
              {(m.Tasks || []).map((t) => (
                <div key={t.id} className="rounded-lg border border-line/70 bg-surface2 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm text-paper">{t.title}</p>
                    <StatusBadge status={t.status} />
                  </div>
                  {t.status === 'pending' || t.status === 'in_progress' ? (
                    openTask === t.id ? (
                      <div className="mt-3 space-y-2">
                        <textarea
                          placeholder="Describe what you did"
                          value={form.content}
                          onChange={(e) => setForm({ ...form, content: e.target.value })}
                          rows={2}
                          className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="rounded-lg border border-line bg-ink px-3 py-2 text-xs text-paper focus:border-cyan" />
                          <input placeholder="Live URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="rounded-lg border border-line bg-ink px-3 py-2 text-xs text-paper focus:border-cyan" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => submitTask(t.id)} disabled={submitting} className="rounded-lg bg-cyan px-3 py-1.5 text-xs font-medium text-ink hover:bg-cyan-soft disabled:opacity-60">
                            {submitting ? 'Submitting...' : 'Submit work'}
                          </button>
                          <button onClick={() => setOpenTask(null)} className="rounded-lg px-3 py-1.5 text-xs text-mist hover:text-paper">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setOpenTask(t.id)} className="mt-2 text-xs text-cyan hover:text-cyan-soft">Submit work →</button>
                    )
                  ) : (
                    <p className="mt-1 text-xs text-mist">Submitted for review</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
