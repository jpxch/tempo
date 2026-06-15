import type { Project, TodayItem } from '@/types/dashboard';

type TodayPanelProps = {
  items: TodayItem[];
  projects: Project[];
};

export function TodayPanel({ items, projects }: TodayPanelProps) {
  const getProjectColor = (projectId: string) =>
    projects.find((project) => project.id === projectId)?.color ?? '#737373';

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <div className="mb-5 flex items-center justify-between comfort:mb-6">
        <div>
          <h2 className="text-2xl font-semibold comfort:text-3xl">Today</h2>
          <p className="text-sm text-neutral-400 comfort:text-base">Your day at a glance.</p>
        </div>

        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300 comfort:px-4 comfort:py-2 comfort:text-base">
          On track
        </span>
      </div>

      <div className="space-y-4 comfort:space-y-5">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
            style={{
              borderLeft: `4px solid ${getProjectColor(item.projectId)}`,
            }}
          >
            <div className="flex flex-col gap-3 comfort:gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-violet-300 comfort:text-base">
                  {item.time} · {item.type}
                </p>

                <h3 className="mt-1 text-lg font-medium comfort:text-xl">{item.title}</h3>

                <p className="mt-1 text-sm text-neutral-400 comfort:text-base">{item.detail}</p>
              </div>

              <button className="min-h-11 rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition comfort:min-h-12 comfort:px-5 comfort:py-3 comfort:text-base hover:border-violet-300 hover:text-white">
                Mark done
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
