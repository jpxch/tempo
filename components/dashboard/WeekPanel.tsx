import type { Project, WeekItem } from '@/types/dashboard';

type WeekPanelProps = {
  items: WeekItem[];
  projects: Project[];
};

export function WeekPanel({ items, projects }: WeekPanelProps) {
  const getProjectColor = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.color ?? '#737373';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
      <h2 className="text-2xl font-semibold">This Week</h2>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div
            key={`${item.projectId}-${item.title}`}
            className="rounded-2xl bg-neutral-900/80 p-4"
            style={{
              borderLeft: `4px solid ${getProjectColor(item.projectId)}`,
            }}
          >
            <p className="text-sm text-neutral-500">{item.dueLabel}</p>
            <p className="mt-1 text-sm text-neutral-200">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
