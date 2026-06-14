import type { Project } from '@/types/dashboard';

type ProjectsPanelProps = {
  projects: Project[];
};

export function ProjectsPanel({ projects }: ProjectsPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
      <h2 className="text-2xl font-semibold">Active Projects</h2>

      <div className="mt-4 space-y-4">
        {projects.map((project) => (
          <article
            key={project.name}
            className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4"
            style={{ borderLeft: `4px solid ${project.color}` }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{project.name}</h3>
                <p className="mt-1 text-sm text-neutral-400">{project.next}</p>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
                {project.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
