import { useEffect, useState } from 'react';
import { mentorApi } from '../../api/mentorApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import StatusBadge from '../../components/StatusBadge';
import { Users } from 'lucide-react';

export default function MentorInterns() {
  const [state, setState] = useState({ status: 'loading', data: [] });

  useEffect(() => {
    mentorApi.interns()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: [] }));
  }, []);

  if (state.status === 'loading') return <LoadingSpinner label="Loading interns..." />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">My Interns</h1>
      <div className="mt-6">
        {state.data.length === 0 ? (
          <EmptyState icon={Users} title="No interns yet" description="Accepted applicants will show up here once assigned." />
        ) : (
          <div className="overflow-x-auto rounded-xl2 border border-line">
            <table className="w-full text-sm">
              <thead className="border-b border-line bg-surface2 text-left text-xs text-mist">
                <tr>
                  <th className="px-4 py-3 font-medium">Student</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Progress</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {state.data.map((i) => (
                  <tr key={i.id} className="border-b border-line/60 last:border-0 bg-surface">
                    <td className="px-4 py-3 text-paper">{i.student?.name}</td>
                    <td className="px-4 py-3 text-mist">{i.project?.title}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 rounded-full bg-line/50">
                          <div className="h-1.5 rounded-full bg-cyan" style={{ width: `${i.overallProgress}%` }} />
                        </div>
                        <span className="text-xs text-mist">{i.overallProgress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={i.status} /></td>
                    <td className="px-4 py-3 text-mist">{new Date(i.updatedAt).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
