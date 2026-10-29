const STYLES = {
  pending: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  under_review: 'bg-violet/10 text-violet-soft border-violet/30',
  shortlisted: 'bg-cyan/10 text-cyan-soft border-cyan/30',
  accepted: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
  approved: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
  rejected: 'bg-red-400/10 text-red-300 border-red-400/30',
  withdrawn: 'bg-line/40 text-mist border-line',
  active: 'bg-cyan/10 text-cyan-soft border-cyan/30',
  completed: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
  not_started: 'bg-line/40 text-mist border-line',
  in_progress: 'bg-cyan/10 text-cyan-soft border-cyan/30',
  submitted: 'bg-violet/10 text-violet-soft border-violet/30',
  revision_required: 'bg-amber-400/10 text-amber-300 border-amber-400/30',
  open: 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30',
  closed: 'bg-line/40 text-mist border-line',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] || 'bg-line/40 text-mist border-line';
  const label = (status || '').replace(/_/g, ' ');
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}
