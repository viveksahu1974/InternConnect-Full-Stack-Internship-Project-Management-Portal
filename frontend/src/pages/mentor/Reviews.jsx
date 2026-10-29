import { useEffect, useState } from 'react';
import { submissionApi } from '../../api/submissionApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { ClipboardCheck } from 'lucide-react';

export default function MentorReviews() {
  const [state, setState] = useState({ status: 'loading', data: [] });
  const [openId, setOpenId] = useState(null);
  const [comment, setComment] = useState('');
  const [score, setScore] = useState('');
  const [busy, setBusy] = useState(false);

  const load = () => {
    submissionApi.listForMentor({ status: 'submitted' })
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: [] }));
  };

  useEffect(() => { load(); }, []);

  const decide = async (id, decision) => {
    setBusy(true);
    try {
      await submissionApi.review(id, { decision, comment, score: score ? Number(score) : undefined });
      setOpenId(null);
      setComment('');
      setScore('');
      load();
    } finally {
      setBusy(false);
    }
  };

  if (state.status === 'loading') return <LoadingSpinner label="Loading submissions..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Reviews</h1>
      <p className="mt-1 text-mist">Submissions waiting on your feedback.</p>

      <div className="mt-6 space-y-4">
        {state.data.length === 0 ? (
          <EmptyState icon={ClipboardCheck} title="No pending reviews" description="You're all caught up." />
        ) : (
          state.data.map((s) => (
            <div key={s.id} className="rounded-xl2 border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-paper">{s.student?.name}</p>
                  <p className="text-xs text-mist">{s.Task?.title}</p>
                </div>
                <StatusBadge status={s.status} />
              </div>
              {s.content && <p className="mt-3 text-sm text-mist">{s.content}</p>}
              <div className="mt-2 flex gap-4 text-xs">
                {s.githubUrl && <a href={s.githubUrl} target="_blank" rel="noreferrer" className="text-cyan hover:text-cyan-soft">GitHub repo →</a>}
                {s.liveUrl && <a href={s.liveUrl} target="_blank" rel="noreferrer" className="text-cyan hover:text-cyan-soft">Live URL →</a>}
              </div>

              {openId === s.id ? (
                <div className="mt-4 space-y-3 border-t border-line pt-4">
                  <textarea
                    placeholder="Feedback comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={2}
                    className="w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
                  />
                  <input
                    type="number" min="0" max="100" placeholder="Score (optional)"
                    value={score} onChange={(e) => setScore(e.target.value)}
                    className="w-40 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button disabled={busy} onClick={() => decide(s.id, 'approved')} className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-500 disabled:opacity-60">Approve</button>
                    <button disabled={busy} onClick={() => decide(s.id, 'revision_required')} className="rounded-lg bg-amber-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-500 disabled:opacity-60">Request revision</button>
                    <button disabled={busy} onClick={() => decide(s.id, 'rejected')} className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500 disabled:opacity-60">Reject</button>
                    <button onClick={() => setOpenId(null)} className="rounded-lg px-3 py-1.5 text-xs text-mist hover:text-paper">Cancel</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setOpenId(s.id)} className="mt-3 text-xs text-cyan hover:text-cyan-soft">Review →</button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
