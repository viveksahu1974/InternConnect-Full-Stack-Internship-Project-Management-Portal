import { Link } from 'react-router-dom';
import { Clock, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ProjectCard({ project }) {
  const skills = (project.ProjectSkills || []).map((ps) => ps.Skill?.name).filter(Boolean);
  return (
    <Link
      to={`/projects/${project.id}`}
      className="group flex flex-col rounded-xl2 border border-line bg-surface p-5 transition-colors hover:border-cyan/50"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display font-semibold text-paper group-hover:text-cyan transition-colors">{project.title}</h3>
        <StatusBadge status={project.status} />
      </div>
      <p className="mt-2 line-clamp-2 text-sm text-mist">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {skills.slice(0, 3).map((s) => (
          <span key={s} className="rounded-md bg-surface2 px-2 py-0.5 text-xs text-mist">{s}</span>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-line pt-4 text-xs text-mist">
        <span className="capitalize">{project.difficulty}</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{project.duration}</span>
        <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{project.seats} seats</span>
      </div>
    </Link>
  );
}
