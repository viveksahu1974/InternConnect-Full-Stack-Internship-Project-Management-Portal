import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { projectApi } from '../../api/projectApi';
import ProjectCard from '../../components/ProjectCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

const CATEGORIES = ['all', 'Frontend', 'Backend', 'Full Stack', 'AI/ML', 'Database'];
const DIFFICULTIES = ['', 'beginner', 'intermediate', 'advanced'];
const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'popular', label: 'Most popular' },
  { value: 'deadline', label: 'Deadline' },
  { value: 'difficulty', label: 'Difficulty' },
  { value: 'duration', label: 'Duration' },
];

export default function Projects() {
  const [params, setParams] = useSearchParams();
  const [state, setState] = useState({ status: 'loading', data: [], pagination: null });
  const [search, setSearch] = useState(params.get('search') || '');

  const category = params.get('category') || 'all';
  const difficulty = params.get('difficulty') || '';
  const sort = params.get('sort') || 'newest';
  const page = Number(params.get('page') || 1);

  useEffect(() => {
    setState((s) => ({ ...s, status: 'loading' }));
    const timeout = setTimeout(() => {
      projectApi
        .list({ search: params.get('search') || undefined, category: category === 'all' ? undefined : category, difficulty: difficulty || undefined, sort, page, limit: 9 })
        .then((res) => setState({ status: 'ready', data: res.data, pagination: res.pagination }))
        .catch(() => setState({ status: 'error', data: [], pagination: null }));
    }, 250);
    return () => clearTimeout(timeout);
  }, [params, category, difficulty, sort, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setParams(next);
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-paper">Project catalogue</h1>
      <p className="mt-2 text-mist">Search and filter open internship projects across every track.</p>

      <div className="mt-8 flex flex-col gap-4">
        <form
          onSubmit={(e) => { e.preventDefault(); updateParam('search', search); }}
          className="relative"
        >
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by project name, skill, or technology"
            className="w-full rounded-lg border border-line bg-surface py-3 pl-10 pr-4 text-sm text-paper placeholder:text-mist focus:border-cyan"
          />
        </form>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => updateParam('category', c === 'all' ? '' : c)}
              className={`rounded-full border px-3.5 py-1.5 text-xs capitalize transition-colors ${
                category === c ? 'border-cyan bg-cyan/10 text-cyan-soft' : 'border-line text-mist hover:text-paper'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={difficulty}
            onChange={(e) => updateParam('difficulty', e.target.value)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-paper"
          >
            <option value="">All difficulties</option>
            {DIFFICULTIES.filter(Boolean).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select
            value={sort}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="rounded-lg border border-line bg-surface px-3 py-2 text-sm text-paper"
          >
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-8">
        {state.status === 'loading' && <LoadingSpinner label="Loading projects..." />}
        {state.status === 'error' && <ErrorState message="Couldn't load projects." onRetry={() => setParams(new URLSearchParams(params))} />}
        {state.status === 'ready' && state.data.length === 0 && (
          <EmptyState title="No projects found" description="Try a different search term or clear your filters." />
        )}
        {state.status === 'ready' && state.data.length > 0 && (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {state.data.map((p) => <ProjectCard key={p.id} project={p} />)}
            </div>
            {state.pagination && state.pagination.totalPages > 1 && (
              <div className="mt-10 flex justify-center gap-2">
                {Array.from({ length: state.pagination.totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateParam('page', String(p))}
                    className={`h-9 w-9 rounded-lg text-sm transition-colors ${
                      p === page ? 'bg-cyan text-ink' : 'border border-line text-mist hover:text-paper'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
