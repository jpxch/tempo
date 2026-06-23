'use client';

import { useState } from 'react';

import type { Project, TodayItem } from '@/types/dashboard';

type TodayPanelProps = {
  items: TodayItem[];
  projects: Project[];
  saving: boolean;
  onMarkDone: (id: string) => Promise<void>;
};

export function TodayPanel({ items, projects, saving, onMarkDone }: TodayPanelProps) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const getProject = (projectId: string) =>
    projects.find((project) => project.id === projectId);

  async function handleMarkDone(item: TodayItem) {
    if (saving || pendingId) return;

    setPendingId(item.id);
    setError('');

    try {
      await onMarkDone(item.id);
    } catch {
      setError(`Could not mark "${item.title}" as done. Try again.`);
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <div className="mb-5 flex items-center justify-between comfort:mb-6">
        <div>
          <h2 className="text-2xl font-semibold comfort:text-3xl">Opening Count</h2>
          <p className="text-sm text-neutral-400 comfort:text-base">
            What needs your attention today.
          </p>
        </div>

        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300 comfort:px-4 comfort:py-2 comfort:text-base">
          On track
        </span>
      </div>

      {error && (
        <p className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300 comfort:text-base">
          {error}
        </p>
      )}

      <div className="space-y-4 comfort:space-y-5">
        {items.length === 0 && (
          <p className="text-sm text-neutral-500 comfort:text-base">
            Nothing due today — you&apos;re ahead of the beat.
          </p>
        )}
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
            style={{
              borderLeft: `4px solid ${getProject(item.projectId)?.color ?? '#737373'}`,
            }}
          >
            <div className="flex flex-col gap-3 comfort:gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm text-violet-300 comfort:text-base">
                    {item.time} · {item.type}
                  </span>
                  <span
                    className="text-xs comfort:text-sm"
                    style={{ color: getProject(item.projectId)?.color ?? '#a3a3a3' }}
                  >
                    {getProject(item.projectId)?.name ?? 'Unassigned'}
                  </span>
                </div>

                <h3 className="mt-1 text-lg font-medium comfort:text-xl">{item.title}</h3>

                <p className="mt-1 text-sm text-neutral-400 comfort:text-base">{item.detail}</p>
              </div>

              <button
                type="button"
                aria-label={`Mark "${item.title}" as done`}
                disabled={saving || pendingId !== null}
                onClick={() => handleMarkDone(item)}
                className="min-h-11 rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition comfort:min-h-12 comfort:px-5 comfort:py-3 comfort:text-base hover:border-violet-300 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {pendingId === item.id ? 'Marking...' : 'Mark done'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
