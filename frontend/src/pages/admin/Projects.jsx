import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';
import StatusBadge from '../../components/StatusBadge';

export default function AdminProjects() {
  const [state, setState] = useState({ status: 'loading', data: [] });
  const [confirming, setConfirming] = useState(null);

  const load = () => {
    projectApi.list({ limit: 50, status: undefined })
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: [] }));
  };

  useEffect(() => { load(); }, []);

  const remove = async () => {
    await projectApi.remove(confirming);
    setConfirming(null);
    load();
  };

  if (state.status === 'loading') return <LoadingSpinner label="Loading projects..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Projects</h1>
      <div className="mt-6 overflow-x-auto rounded-xl2 border border-line">
        <table className="w-full text-sm">
          <thead className="border-b border-line bg-surface2 text-left text-xs text-mist">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Mentor</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {state.data.map((p) => (
              <tr key={p.id} className="border-b border-line/60 last:border-0 bg-surface">
                <td className="px-4 py-3"><Link to={`/projects/${p.id}`} className="text-paper hover:text-cyan">{p.title}</Link></td>
                <td className="px-4 py-3 text-mist">{p.mentor?.name || '—'}</td>
                <td className="px-4 py-3 text-mist">{p.category}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setConfirming(p.id)} className="text-mist hover:text-red-400" aria-label={`Delete ${p.title}`}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!confirming}
        title="Delete this project?"
        description="This also removes its applications and skill links."
        confirmLabel="Delete"
        danger
        onConfirm={remove}
        onCancel={() => setConfirming(null)}
      />
    </div>
  );
}
