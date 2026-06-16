import type { FollowUp, Project } from '@/types/dashboard';

type FollowUpsPanelProps = {
  followUps: FollowUp[];
  projects: Project[];
};

export function FollowUpsPanel({ followUps, projects }: FollowUpsPanelProps) {
  const getProject = (projectId: string) =>
    projects.find((project) => project.id === projectId);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <div>
        <h2 className="text-2xl font-semibold comfort:text-3xl">Cue List</h2>
        <p className="text-sm text-neutral-400 comfort:text-base">
          People and replies waiting on you.
        </p>
      </div>

      <div className="mt-5 space-y-4 comfort:mt-6 comfort:space-y-5">
        {followUps.length === 0 && (
          <p className="text-sm text-neutral-500 comfort:text-base">
            No follow-ups pending — all clear.
          </p>
        )}
        {followUps.map((followUp) => (
          <article
            key={`${followUp.projectId}-${followUp.person}`}
            className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
            style={{
              borderLeft: `4px solid ${getProject(followUp.projectId)?.color ?? '#737373'}`,
            }}
          >
            <div className="flex items-start justify-between gap-4 comfort:gap-5">
              <div>
                <h3 className="font-medium comfort:text-xl">{followUp.person}</h3>
                <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
                  {followUp.reason}
                </p>
                <p
                  className="mt-1.5 text-xs comfort:text-sm"
                  style={{ color: getProject(followUp.projectId)?.color ?? '#a3a3a3' }}
                >
                  {getProject(followUp.projectId)?.name ?? 'Unassigned'}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 comfort:px-4 comfort:py-2 comfort:text-sm">
                {followUp.dueLabel}
              </span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
