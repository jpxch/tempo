import type { TodayItem } from '@/types/dashboard';

type TodayPanelProps = {
  items: TodayItem[];
};

export function TodayPanel({ items }: TodayPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Today</h2>
          <p className="text-sm text-neutral-400">Your day at a glance.</p>
        </div>

        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
          On track
        </span>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4"
            style={{ borderLeft: `4px solid ${item.projectColor}` }}
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-violet-300">
                  {item.time} · {item.type}
                </p>

                <h3 className="mt-1 text-lg font-medium">{item.title}</h3>

                <p className="mt-1 text-sm text-neutral-400">{item.detail}</p>
              </div>

              <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-violet-300 hover:text-white">
                Mark done
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
