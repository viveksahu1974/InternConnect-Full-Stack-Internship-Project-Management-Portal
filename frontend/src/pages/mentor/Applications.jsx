import { useEffect, useState } from 'react';
import { applicationApi } from '../../api/applicationApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { FileText } from 'lucide-react';

const ACTIONS = [
  { status: 'under_review', label: 'Mark under review' },
  { status: 'shortlisted', label: 'Shortlist' },
  { status: 'accepted', label: 'Accept' },
  { status: 'rejected', label: 'Reject' },
];

export default function MentorApplications() {
  const [state, setState] = useState({ status: 'loading', data: [] });
  const [busyId, setBusyId] = useState(null);

  const load = () => {
    applicationApi.list()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: [] }));
  };

  useEffect(() => { load(); }, []);

  const act = async (id, status) => {
    setBusyId(id);
    try {
      await applicationApi.updateStatus(id, status);
      load();
    } finally {
      setBusyId(null);
    }
  };

  if (state.status === 'loading') return <LoadingSpinner label="Loading applications..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Applications</h1>
      <p className="mt-1 text-mist">Review applicants to your projects. Accepting one automatically creates the internship.</p>

      <div className="mt-6 space-y-3">
        {state.data.length === 0 ? (
          <EmptyState icon={FileText} title="No applications yet" description="Applications to your projects will show up here." />
        ) : (
          state.data.map((a) => (
            <div key={a.id} className="rounded-xl2 border border-line bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-paper">{a.student?.name} <span className="text-mist font-normal">· {a.student?.email}</span></p>
                  <p className="text-xs text-mist mt-0.5">{a.project?.title}</p>
                </div>
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-3 text-sm text-mist line-clamp-2">{a.motivation}</p>
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
          ))
        )}
      </div>
    </div>
  );
}
