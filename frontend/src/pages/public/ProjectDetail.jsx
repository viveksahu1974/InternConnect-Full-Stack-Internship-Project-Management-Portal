import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, User as UserIcon } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import { applicationApi } from '../../api/applicationApi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import StatusBadge from '../../components/StatusBadge';

function fmtDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [status, setStatus] = useState('loading');
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', college: '', degree: '', branch: '', semester: '',
    skillsText: '', resumeUrl: '', github: '', linkedin: '', motivation: '', previousProjects: '',
  });

  useEffect(() => {
    setStatus('loading');
    projectApi.getById(id)
      .then((res) => { setProject(res.data); setStatus('ready'); })
      .catch(() => setStatus('error'));
  }, [id]);

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, fullName: user.name, email: user.email }));
  }, [user]);

  const skills = (project?.ProjectSkills || []).map((ps) => ps.Skill?.name).filter(Boolean);

  const onApplyClick = () => {
    if (!user) return navigate('/login', { state: { from: { pathname: `/projects/${id}` } } });
    if (user.role !== 'student') return;
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!form.fullName || !form.email || !form.motivation) {
      setFormError('Full name, email and motivation are required.');
      return;
    }
    setSubmitting(true);
    try {
      await applicationApi.apply(id, form);
      setApplied(true);
      setShowForm(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Could not submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') return <div className="mx-auto max-w-5xl px-5 py-14"><LoadingSpinner /></div>;
  if (status === 'error' || !project) return <div className="mx-auto max-w-5xl px-5 py-14"><ErrorState message="Project not found." /></div>;

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-paper">{project.title}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-2 text-mist">{project.category} · {project.difficulty}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="font-display font-semibold text-paper">Overview</h2>
            <p className="mt-2 text-sm leading-relaxed text-mist">{project.description}</p>
          </section>
          {project.objectives && (
            <section>
              <h2 className="font-display font-semibold text-paper">Objectives</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{project.objectives}</p>
            </section>
          )}
          {project.requirements && (
            <section>
              <h2 className="font-display font-semibold text-paper">Requirements</h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">{project.requirements}</p>
            </section>
          )}
          <section>
            <h2 className="font-display font-semibold text-paper">Required skills</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.length ? skills.map((s) => (
                <span key={s} className="rounded-md bg-surface2 px-2.5 py-1 text-xs text-mist">{s}</span>
              )) : <span className="text-sm text-mist">Not specified</span>}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl2 border border-line bg-surface p-5">
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mist"><UserIcon className="h-4 w-4" />Mentor</dt><dd className="text-paper">{project.mentor?.name || 'TBD'}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mist"><Clock className="h-4 w-4" />Duration</dt><dd className="text-paper">{project.duration}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mist"><Users className="h-4 w-4" />Seats</dt><dd className="text-paper">{project.seats}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-mist">Applications</dt><dd className="text-paper">{project.applicationsCount}</dd></div>
              <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-mist"><Calendar className="h-4 w-4" />Start</dt><dd className="text-paper">{fmtDate(project.startDate)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-mist">End</dt><dd className="text-paper">{fmtDate(project.endDate)}</dd></div>
              <div className="flex items-center justify-between"><dt className="text-mist">Apply by</dt><dd className="text-paper">{fmtDate(project.applicationDeadline)}</dd></div>
            </dl>

            {applied ? (
              <p className="mt-5 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-3 py-2 text-center text-sm text-emerald-300">
                Application submitted!
              </p>
            ) : (
              <button
                onClick={onApplyClick}
                disabled={user?.role && user.role !== 'student'}
                className="mt-5 w-full rounded-lg bg-gradient-to-r from-cyan to-violet px-4 py-2.5 text-sm font-medium text-ink transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {user?.role === 'mentor' || user?.role === 'admin' ? 'Students only' : 'Apply Now'}
              </button>
            )}
          </div>
        </aside>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <form onSubmit={submit} className="max-h-[90vh] w-full max-w-lg overflow-y-auto scrollbar-thin rounded-xl2 border border-line bg-surface p-6">
            <h3 className="font-display text-lg font-semibold text-paper">Apply to {project.title}</h3>
            {formError && <p className="mt-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-300">{formError}</p>}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Field label="Full name" value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} required />
              <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} required />
              <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
              <Field label="College" value={form.college} onChange={(v) => setForm({ ...form, college: v })} />
              <Field label="Degree" value={form.degree} onChange={(v) => setForm({ ...form, degree: v })} />
              <Field label="Branch" value={form.branch} onChange={(v) => setForm({ ...form, branch: v })} />
              <Field label="Semester" value={form.semester} onChange={(v) => setForm({ ...form, semester: v })} />
              <Field label="Skills (comma separated)" value={form.skillsText} onChange={(v) => setForm({ ...form, skillsText: v })} />
              <Field label="Resume URL" value={form.resumeUrl} onChange={(v) => setForm({ ...form, resumeUrl: v })} />
              <Field label="GitHub" value={form.github} onChange={(v) => setForm({ ...form, github: v })} />
              <Field label="LinkedIn" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
            </div>
            <label className="mt-3 block text-xs text-mist">Motivation</label>
            <textarea
              required
              rows={3}
              value={form.motivation}
              onChange={(e) => setForm({ ...form, motivation: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
            />
            <label className="mt-3 block text-xs text-mist">Previous projects</label>
            <textarea
              rows={2}
              value={form.previousProjects}
              onChange={(e) => setForm({ ...form, previousProjects: e.target.value })}
              className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
            />
            <div className="mt-5 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-lg px-4 py-2 text-sm text-mist hover:text-paper">Cancel</button>
              <button type="submit" disabled={submitting} className="rounded-lg bg-cyan px-4 py-2 text-sm font-medium text-ink hover:bg-cyan-soft disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Submit application'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs text-mist">{label}{required && ' *'}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
      />
    </div>
  );
}
