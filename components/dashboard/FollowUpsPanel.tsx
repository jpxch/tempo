import type { FollowUp, Project } from '@/types/dashboard';

type FollowUpsPanelProps = {
  followUps: FollowUp[];
  projects: Project[];
};

export function FollowUpsPanel({ followUps, projects }: FollowUpsPanelProps) {
  const getProjectColor = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.color ?? '#737373';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
      <div>
        <h2 className="text-2xl font-semibold">Follow Ups</h2>
        <p className="text-sm text-neutral-400">People waiting on your next move.</p>
      </div>

      <div className="mt-5 space-y-4">
        {followUps.map((followUp) => (
          <article
            key={`${followUp.projectId}-${followUp.person}`}
            className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4"
            style={{
              borderLeft: `4px solid ${getProjectColor(followUp.projectId)}`,
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-medium">{followUp.person}</h3>
                <p className="mt-1 text-sm text-neutral-400">{followUp.reason}</p>
              </div>

              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
                {followUp.dueLabel}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
