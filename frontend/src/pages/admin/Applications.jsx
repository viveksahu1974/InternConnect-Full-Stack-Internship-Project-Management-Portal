import { useEffect, useState } from 'react';
import { applicationApi } from '../../api/applicationApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { FileText } from 'lucide-react';

const STATUSES = ['', 'pending', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn'];
const ACTIONS = [
  { status: 'under_review', label: 'Under review' },
  { status: 'shortlisted', label: 'Shortlist' },
  { status: 'accepted', label: 'Accept' },
  { status: 'rejected', label: 'Reject' },
];

export default function AdminApplications() {
  const [state, setState] = useState({ status: 'loading', data: [], pagination: null });
  const [filter, setFilter] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    applicationApi.list({ status: filter || undefined, limit: 20 })
      .then((res) => setState({ status: 'ready', data: res.data, pagination: res.pagination }))
      .catch(() => setState({ status: 'error', data: [], pagination: null }));
  };

  useEffect(() => { load(); }, [filter]);

  const act = async (id, status) => {
    setBusyId(id);
    try {
      await applicationApi.updateStatus(id, status);
      load();
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Applications</h1>

      <div className="mt-5 flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button
            key={s || 'all'}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-3 py-1.5 text-xs capitalize transition-colors ${filter === s ? 'border-cyan bg-cyan/10 text-cyan-soft' : 'border-line text-mist hover:text-paper'}`}
          >
            {s ? s.replace(/_/g, ' ') : 'All'}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {state.status === 'loading' ? (
          <LoadingSpinner />
        ) : state.data.length === 0 ? (
          <EmptyState icon={FileText} title="No applications" description="No applications match this filter." />
        ) : (
          <div className="space-y-3">
            {state.data.map((a) => (
              <div key={a.id} className="rounded-xl2 border border-line bg-surface p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-paper">{a.student?.name} <span className="font-normal text-mist">→ {a.project?.title}</span></p>
                    <p className="text-xs text-mist">{a.student?.email}</p>
                  </div>
                  <StatusBadge status={a.status} />
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ACTIONS.filter((act) => act.status !== a.status).map((action) => (
                    <button
                      key={action.status}
                      disabled={busyId === a.id}
                      onClick={() => act(a.id, action.status)}
                      className="rounded-lg border border-line px-3 py-1.5 text-xs text-paper hover:border-cyan hover:text-cyan disabled:opacity-60"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
