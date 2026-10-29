import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { analyticsApi } from '../../api/analyticsApi';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminAnalytics() {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    analyticsApi.admin()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: null }));
  }, []);

  if (state.status === 'loading') return <LoadingSpinner label="Loading analytics..." />;
  const d = state.data;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Analytics</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Completion rate" value={`${d.averageCompletionRate}%`} />
        <Stat label="Active internships" value={d.activeInternships} />
        <Stat label="Completed internships" value={d.completedInternships} />
      </div>

      <div className="mt-6 rounded-xl2 border border-line bg-surface p-6">
        <h2 className="font-display font-semibold text-paper">Applications by status</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={d.applicationsByStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#243252" vertical={false} />
              <XAxis dataKey="status" stroke="#8B96AD" fontSize={11} tickFormatter={(v) => v.replace(/_/g, ' ')} />
              <YAxis stroke="#8B96AD" fontSize={12} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#16223B', border: '1px solid #243252', borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="count" fill="#8B7CF6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-5">
      <p className="font-display text-2xl font-semibold text-paper">{value}</p>
      <p className="text-xs text-mist">{label}</p>
    </div>
  );
}
