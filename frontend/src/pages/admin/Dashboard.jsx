import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Briefcase, FolderKanban, FileText } from 'lucide-react';
import { analyticsApi } from '../../api/analyticsApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';

const COLORS = ['#2DD4E8', '#8B7CF6', '#34D399', '#FBBF24', '#F87171', '#8B96AD'];

export default function AdminDashboard() {
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    analyticsApi.admin()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: null }));
  }, []);

  if (state.status === 'loading') return <LoadingSpinner label="Loading analytics..." />;
  if (state.status === 'error') return <ErrorState message="Couldn't load analytics." />;

  const d = state.data;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Platform Overview</h1>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={Users} label="Total Students" value={d.totalStudents} />
        <Card icon={Users} label="Total Mentors" value={d.totalMentors} />
        <Card icon={FolderKanban} label="Total Projects" value={d.totalProjects} />
        <Card icon={Briefcase} label="Active Internships" value={d.activeInternships} />
        <Card icon={FileText} label="Pending Applications" value={d.pendingApplications} />
        <Card icon={FileText} label="Approved Applications" value={d.approvedApplications} />
        <Card icon={Briefcase} label="Completed Internships" value={d.completedInternships} />
        <Card icon={Briefcase} label="Avg Completion Rate" value={`${d.averageCompletionRate}%`} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl2 border border-line bg-surface p-6">
          <h2 className="font-display font-semibold text-paper">Applications by status</h2>
          <div className="mt-4 h-64">
            {d.applicationsByStatus.length === 0 ? (
              <p className="text-sm text-mist">No applications yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={d.applicationsByStatus} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {d.applicationsByStatus.map((entry, i) => <Cell key={entry.status} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#16223B', border: '1px solid #243252', borderRadius: 8, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="mt-2 flex flex-wrap gap-3">
            {d.applicationsByStatus.map((s, i) => (
              <span key={s.status} className="flex items-center gap-1.5 text-xs text-mist capitalize">
                <span className="h-2 w-2 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                {s.status.replace(/_/g, ' ')} ({s.count})
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl2 border border-line bg-surface p-6">
          <h2 className="font-display font-semibold text-paper">Most popular projects</h2>
          <div className="mt-4 h-64">
            {d.projectPopularity.length === 0 ? (
              <p className="text-sm text-mist">No projects yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={d.projectPopularity} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#243252" horizontal={false} />
                  <XAxis type="number" stroke="#8B96AD" fontSize={12} allowDecimals={false} />
                  <YAxis type="category" dataKey="title" stroke="#8B96AD" fontSize={11} width={120} tickFormatter={(v) => (v.length > 16 ? v.slice(0, 16) + '…' : v)} />
                  <Tooltip contentStyle={{ background: '#16223B', border: '1px solid #243252', borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="applications" fill="#2DD4E8" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet/10 text-violet">
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-paper">{value}</p>
      <p className="text-xs text-mist">{label}</p>
    </div>
  );
}
