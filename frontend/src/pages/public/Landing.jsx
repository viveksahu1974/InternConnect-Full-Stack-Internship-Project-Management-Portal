import { Link } from 'react-router-dom';
import { ArrowRight, Search, Users, Sparkles, GitBranch } from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectApi } from '../../api/projectApi';
import ProjectCard from '../../components/ProjectCard';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Landing() {
  const [projects, setProjects] = useState(null);

  useEffect(() => {
    projectApi.list({ limit: 3, sort: 'newest' }).then((res) => setProjects(res.data)).catch(() => setProjects([]));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line/60">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan/10 blur-3xl" />
          <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-violet/10 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs text-mist">
                <Sparkles className="h-3 w-3 text-cyan" /> Internships, mentored end to end
              </span>
              <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-paper sm:text-5xl">
                Connect. Learn. Build.<br />
                <span className="bg-gradient-to-r from-cyan to-violet bg-clip-text text-transparent">Launch your career.</span>
              </h1>
              <p className="mt-5 max-w-lg text-mist">
                A unified internship and project-management platform connecting students with mentors and real-world opportunities.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/projects" className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-cyan to-violet px-5 py-3 text-sm font-medium text-ink transition-opacity hover:opacity-90">
                  Explore Projects <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/register" className="inline-flex items-center gap-2 rounded-lg border border-line px-5 py-3 text-sm font-medium text-paper transition-colors hover:border-cyan hover:text-cyan">
                  Get Started
                </Link>
              </div>
            </div>

            <div className="relative rounded-xl2 border border-line bg-surface p-6 shadow-glow">
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold text-paper">Your internship progress</p>
                <span className="rounded-full border border-cyan/30 bg-cyan/10 px-2 py-0.5 text-xs text-cyan-soft">Active</span>
              </div>
              <div className="mt-5 space-y-4">
                {[
                  { label: 'Web Foundations', pct: 100 },
                  { label: 'Interface Design', pct: 50 },
                  { label: 'Interactivity', pct: 0 },
                  { label: 'Quality & Delivery', pct: 0 },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="flex justify-between text-xs text-mist"><span>{m.label}</span><span>{m.pct}%</span></div>
                    <div className="mt-1 h-1.5 rounded-full bg-line">
                      <div className="h-1.5 rounded-full bg-gradient-to-r from-cyan to-violet" style={{ width: `${m.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5 text-center">
                <div><p className="font-display text-xl font-semibold text-paper">38%</p><p className="text-xs text-mist">Overall</p></div>
                <div><p className="font-display text-xl font-semibold text-paper">4</p><p className="text-xs text-mist">Milestones</p></div>
                <div><p className="font-display text-xl font-semibold text-paper">2</p><p className="text-xs text-mist">Reviews</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <h2 className="font-display text-2xl font-semibold text-paper">How it works</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {[
            { icon: Search, title: 'Discover a project', desc: 'Filter the catalogue by skill, category and difficulty to find the right fit.' },
            { icon: Users, title: 'Apply & get matched', desc: 'Submit an application, get reviewed, and get paired with a mentor.' },
            { icon: GitBranch, title: 'Build & get feedback', desc: 'Work through milestones, submit tasks, and get real mentor reviews.' },
          ].map((s) => (
            <div key={s.title} className="rounded-xl2 border border-line bg-surface p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                <s.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-semibold text-paper">{s.title}</h3>
              <p className="mt-1.5 text-sm text-mist">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured projects */}
      <section className="border-t border-line/60 bg-surface/40">
        <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-semibold text-paper">Open projects right now</h2>
            <Link to="/projects" className="hidden text-sm text-cyan hover:text-cyan-soft sm:inline">View all →</Link>
          </div>
          <div className="mt-8">
            {projects === null ? (
              <LoadingSpinner />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((p) => <ProjectCard key={p.id} project={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
