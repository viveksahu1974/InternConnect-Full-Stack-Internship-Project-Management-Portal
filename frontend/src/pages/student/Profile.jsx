import { useEffect, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { studentApi } from '../../api/studentApi';
import LoadingSpinner from '../../components/LoadingSpinner';

const FIELDS = [
  ['college', 'College'], ['degree', 'Degree'], ['branch', 'Branch'], ['semester', 'Semester'],
  ['github', 'GitHub URL'], ['linkedin', 'LinkedIn URL'], ['resumeUrl', 'Resume URL'],
];

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [completion, setCompletion] = useState(0);
  const [newSkill, setNewSkill] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = () => {
    studentApi.getProfile().then((res) => {
      setProfile(res.data.profile || {});
      setSkills(res.data.skills || []);
      setCompletion(res.data.profileCompletion || 0);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await studentApi.updateProfile(profile);
      setSaved(true);
      load();
    } finally {
      setSaving(false);
    }
  };

  const addSkill = async () => {
    if (!newSkill.trim()) return;
    await studentApi.addSkill({ name: newSkill.trim() });
    setNewSkill('');
    load();
  };

  const removeSkill = async (id) => {
    await studentApi.removeSkill(id);
    load();
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-paper">My Profile</h1>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 rounded-full bg-line/50">
          <div className="h-2 rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${completion}%` }} />
        </div>
        <span className="text-sm text-mist whitespace-nowrap">{completion}% complete</span>
      </div>

      <form onSubmit={save} className="mt-8 rounded-xl2 border border-line bg-surface p-6">
        <h2 className="font-display font-semibold text-paper">Basic information</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {FIELDS.map(([key, label]) => (
            <div key={key}>
              <label className="block text-xs text-mist">{label}</label>
              <input
                value={profile[key] || ''}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
              />
            </div>
          ))}
        </div>
        <label className="mt-4 block text-xs text-mist">Bio</label>
        <textarea
          rows={3}
          value={profile.bio || ''}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="mt-1 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
        />
        {saved && <p className="mt-3 text-sm text-emerald-400">Profile saved.</p>}
        <button
          type="submit" disabled={saving}
          className="mt-5 rounded-lg bg-gradient-to-r from-cyan to-violet px-5 py-2.5 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save profile'}
        </button>
      </form>

      <div className="mt-6 rounded-xl2 border border-line bg-surface p-6">
        <h2 className="font-display font-semibold text-paper">Skills</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.length === 0 && <p className="text-sm text-mist">No skills added yet.</p>}
          {skills.map((s) => (
            <span key={s.id} className="flex items-center gap-1.5 rounded-full border border-line bg-surface2 px-3 py-1 text-xs text-paper">
              {s.Skill?.name}
              <button onClick={() => removeSkill(s.id)} aria-label={`Remove ${s.Skill?.name}`}>
                <X className="h-3 w-3 text-mist hover:text-red-400" />
              </button>
            </span>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. React"
            className="flex-1 rounded-lg border border-line bg-ink px-3 py-2 text-sm text-paper focus:border-cyan"
          />
          <button onClick={addSkill} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-2 text-sm text-paper hover:border-cyan hover:text-cyan">
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
