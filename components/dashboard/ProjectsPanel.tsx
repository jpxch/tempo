import type { Project } from '@/types/dashboard';

type ProjectsPanelProps = {
  projects: Project[];
};

export function ProjectsPanel({ projects }: ProjectsPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <h2 className="text-2xl font-semibold comfort:text-3xl">Active Projects</h2>

      <div className="mt-4 space-y-4 comfort:mt-6 comfort:space-y-5">
        {projects.map((project) => (
          <article
            key={project.name}
            className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
            style={{ borderLeft: `4px solid ${project.color}` }}
          >
            <div className="flex items-start justify-between gap-4 comfort:gap-5">
              <div>
                <h3 className="font-medium comfort:text-xl">{project.name}</h3>
                <p className="mt-1 text-sm text-neutral-400 comfort:text-base">{project.next}</p>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 comfort:px-4 comfort:py-2 comfort:text-sm">
                {project.status}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
