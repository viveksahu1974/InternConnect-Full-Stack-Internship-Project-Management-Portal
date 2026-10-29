import { useEffect, useState } from 'react';
import { Users, Activity, ClipboardCheck, TrendingUp } from 'lucide-react';
import { mentorApi } from '../../api/mentorApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { useAuth } from '../../context/AuthContext';

export default function MentorDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    mentorApi.dashboard()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: null }));
  }, []);

  if (state.status === 'loading') return <LoadingSpinner label="Loading dashboard..." />;
  if (state.status === 'error') return <ErrorState message="Couldn't load your dashboard." />;

  const d = state.data;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Welcome, {user.name.split(' ')[0]}</h1>
      <p className="mt-1 text-mist">Here's what's happening with your interns.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={Users} label="Total Interns" value={d.totalInterns} />
        <Card icon={Activity} label="Active Interns" value={d.activeInterns} />
        <Card icon={ClipboardCheck} label="Pending Reviews" value={d.pendingReviews} />
        <Card icon={TrendingUp} label="Avg Progress" value={`${d.averageProgress}%`} />
      </div>

      <div className="mt-6 rounded-xl2 border border-line bg-surface p-6">
        <h2 className="font-display font-semibold text-paper">Recent submissions</h2>
        {d.recentSubmissions.length === 0 ? (
          <p className="mt-3 text-sm text-mist">No submissions yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {d.recentSubmissions.map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-lg border border-line/70 bg-surface2 px-4 py-3 text-sm">
                <span className="text-paper">{s.student?.name}</span>
                <span className="text-mist">{new Date(s.submittedAt).toLocaleDateString('en-IN')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-paper">{value}</p>
      <p className="text-xs text-mist">{label}</p>
    </div>
  );
}
