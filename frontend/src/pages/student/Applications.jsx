import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import ConfirmDialog from '../../components/ConfirmDialog';
import { FileText } from 'lucide-react';

export default function StudentApplications() {
  const [state, setState] = useState({ status: 'loading', data: [] });
  const [confirming, setConfirming] = useState(null);

  const load = () => {
    applicationApi.mine()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: [] }));
  };

  useEffect(() => { load(); }, []);

  const withdraw = async () => {
    await applicationApi.withdraw(confirming);
    setConfirming(null);
    load();
  };

  if (state.status === 'loading') return <LoadingSpinner label="Loading applications..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">My Applications</h1>
      <p className="mt-1 text-mist">Track every project you've applied to.</p>

      <div className="mt-6">
        {state.data.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No applications yet"
            description="Browse the project catalogue and apply to get started."
            action={<Link to="/projects" className="mt-2 rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-ink hover:bg-cyan-soft">Browse projects</Link>}
          />
        ) : (
          <div className="overflow-x-auto rounded-xl2 border border-line">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-surface2 text-left text-xs text-mist">
                <tr>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((a) => (
                  <tr key={a.id} className="border-b border-line/60 last:border-0 bg-surface">
                    <td className="px-4 py-3">
                      <Link to={`/projects/${a.project?.id}`} className="text-paper hover:text-cyan">{a.project?.title}</Link>
                    </td>
                    <td className="px-4 py-3 text-mist">{new Date(a.appliedAt).toLocaleDateString('en-IN')}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {['pending', 'under_review', 'shortlisted'].includes(a.status) && (
                        <button onClick={() => setConfirming(a.id)} className="text-xs text-mist hover:text-red-400">Withdraw</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!confirming}
        title="Withdraw application?"
        description="You can't undo this. You'd need to re-apply to be considered again."
        confirmLabel="Withdraw"
        danger
        onConfirm={withdraw}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
