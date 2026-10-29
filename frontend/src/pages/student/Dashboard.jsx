import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileText, Briefcase, TrendingUp, ListTodo } from 'lucide-react';
import { studentApi } from '../../api/studentApi';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import { useAuth } from '../../context/AuthContext';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [state, setState] = useState({ status: 'loading', data: null });

  useEffect(() => {
    studentApi.dashboard()
      .then((res) => setState({ status: 'ready', data: res.data }))
      .catch(() => setState({ status: 'error', data: null }));
  }, []);

  if (state.status === 'loading') return <LoadingSpinner label="Loading your dashboard..." />;
  if (state.status === 'error') return <ErrorState message="Couldn't load your dashboard." />;

  const d = state.data;
  const totalTasks = d.tasks.completed + d.tasks.pending + d.tasks.underReview;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-paper">Welcome back, {user.name.split(' ')[0]}</h1>
      <p className="mt-1 text-mist">Here's where things stand.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card icon={CheckCircle2} label="Profile Completion" value={`${d.profileCompletion}%`} accent="cyan" />
        <Card icon={FileText} label="Applications" value={d.applicationsCount} accent="violet" />
        <Card icon={Briefcase} label="Active Internship" value={d.activeInternship ? 'Yes' : 'None'} accent="cyan" />
        <Card icon={TrendingUp} label="Overall Progress" value={`${d.overallProgress}%`} accent="violet" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl2 border border-line bg-surface p-6">
          <h2 className="font-display font-semibold text-paper">Task overview</h2>
          {totalTasks === 0 ? (
            <p className="mt-3 text-sm text-mist">No tasks yet — once you're accepted into an internship, tasks will show up here.</p>
          ) : (
            <div className="mt-4 space-y-3">
              <TaskBar label="Completed" value={d.tasks.completed} total={totalTasks} color="bg-emerald-400" />
              <TaskBar label="Under review" value={d.tasks.underReview} total={totalTasks} color="bg-violet" />
              <TaskBar label="Pending" value={d.tasks.pending} total={totalTasks} color="bg-line" />
            </div>
          )}
        </div>

        <div className="rounded-xl2 border border-line bg-surface p-6">
          <h2 className="font-display font-semibold text-paper flex items-center gap-2"><ListTodo className="h-4 w-4 text-cyan" />Pending tasks</h2>
          <p className="mt-3 text-3xl font-display font-semibold text-paper">{d.tasks.pending}</p>
          <p className="mt-1 text-sm text-mist">tasks not yet started</p>
          <Link to="/student/internship" className="mt-4 inline-block text-sm text-cyan hover:text-cyan-soft">View internship →</Link>
        </div>
      </div>

      {!d.activeInternship && (
        <div className="mt-6 rounded-xl2 border border-dashed border-line p-6 text-center">
          <p className="text-paper font-display font-semibold">No active internship yet</p>
          <p className="mt-1 text-sm text-mist">Browse the catalogue and apply to a project to get started.</p>
          <Link to="/projects" className="mt-4 inline-block rounded-lg bg-gradient-to-r from-cyan to-violet px-4 py-2 text-sm font-medium text-ink hover:opacity-90">
            Browse projects
          </Link>
        </div>
      )}
    </div>
  );
}

const ACCENTS = {
  cyan: 'bg-cyan/10 text-cyan',
  violet: 'bg-violet/10 text-violet',
};

function Card({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-xl2 border border-line bg-surface p-5">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${ACCENTS[accent]}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-paper">{value}</p>
      <p className="text-xs text-mist">{label}</p>
    </div>
  );
}

function TaskBar({ label, value, total, color }) {
  const pct = total ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-xs text-mist"><span>{label}</span><span>{value}</span></div>
      <div className="mt-1 h-2 rounded-full bg-line/50">
        <div className={`h-2 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
