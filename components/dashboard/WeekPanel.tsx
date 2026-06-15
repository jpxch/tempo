import type { Project, WeekItem } from '@/types/dashboard';

type WeekPanelProps = {
  items: WeekItem[];
  projects: Project[];
};

export function WeekPanel({ items, projects }: WeekPanelProps) {
  const getProjectColor = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.color ?? '#737373';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <h2 className="text-2xl font-semibold comfort:text-3xl">Weekly Rhythm</h2>
      <p className="text-sm text-neutral-400 comfort:text-base">
        What&apos;s coming up over the next few days.
      </p>

      <div className="mt-4 space-y-3 comfort:mt-6 comfort:space-y-5">
        {items.map((item) => (
          <div
            key={`${item.projectId}-${item.title}`}
            className="rounded-2xl bg-neutral-900/80 p-4 comfort:p-6"
            style={{
              borderLeft: `4px solid ${getProjectColor(item.projectId)}`,
            }}
          >
            <p className="text-sm text-neutral-500 comfort:text-base">{item.dueLabel}</p>
            <p className="mt-1 text-sm text-neutral-200 comfort:text-lg">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
