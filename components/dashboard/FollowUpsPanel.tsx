'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { insertFollowUp, updateFollowUp } from '@/lib/supabase/mutations';
import type { FollowUp, Project } from '@/types/dashboard';

type FollowUpsPanelProps = {
  followUps: FollowUp[];
  projects: Project[];
};

export function FollowUpsPanel({ followUps, projects }: FollowUpsPanelProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newPerson, setNewPerson] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newDueLabel, setNewDueLabel] = useState('');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getProject = (projectId: string) => projects.find((p) => p.id === projectId);

  async function handleCreate() {
    const person = newPerson.trim();
    const reason = newReason.trim();
    if (!person) { setError('Name is required.'); return; }
    if (!reason) { setError('Reason is required.'); return; }
    if (!newProjectId) { setError('Choose a project.'); return; }
    setSaving(true);
    setError(null);
    try {
      await insertFollowUp({ person, reason, dueLabel: newDueLabel.trim(), projectId: newProjectId });
      setCreating(false);
      setNewPerson('');
      setNewReason('');
      setNewDueLabel('');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not add follow-up.');
    } finally {
      setSaving(false);
    }
  }

  async function handleMarkDone(id: string) {
    setSaving(true);
    setError(null);
    try {
      await updateFollowUp(id, { status: 'done' });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update follow-up.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold comfort:text-3xl">Cue List</h2>
          <p className="text-sm text-neutral-400 comfort:text-base">
            People and replies waiting on you.
          </p>
        </div>
        {!creating && projects.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setNewProjectId(projects[0]?.id ?? '');
              setCreating(true);
              setError(null);
            }}
            className="min-h-9 shrink-0 rounded-full border border-violet-400/40 bg-violet-400/15 px-4 py-1.5 text-xs font-medium text-violet-200 transition hover:bg-violet-400/25 comfort:text-sm"
          >
            + New
          </button>
        )}
      </div>

      {error && (
        <p className="mt-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300 comfort:text-base">
          {error}
        </p>
      )}

      {creating && (
        <div className="mt-4 rounded-2xl border border-violet-400/30 bg-neutral-900/80 p-4 comfort:p-5">
          <div className="space-y-3">
            <div>
              <label
                htmlFor="fu-person"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
              >
                Person *
              </label>
              <input
                id="fu-person"
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Who needs a follow-up?"
                className="min-h-10 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-11 comfort:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="fu-reason"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
              >
                Reason *
              </label>
              <input
                id="fu-reason"
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="What's the follow-up about?"
                className="min-h-10 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-11 comfort:text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="fu-due"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
                >
                  Due
                </label>
                <input
                  id="fu-due"
                  type="text"
                  value={newDueLabel}
                  onChange={(e) => setNewDueLabel(e.target.value)}
                  placeholder="Today, Friday…"
                  className="min-h-10 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-11 comfort:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="fu-project"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
                >
                  Project *
                </label>
                <select
                  id="fu-project"
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="min-h-10 w-full rounded-xl border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-11 comfort:text-base"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                disabled={saving}
                onClick={handleCreate}
                className="min-h-9 rounded-xl bg-violet-400 px-4 py-1.5 text-sm font-medium text-neutral-950 transition hover:bg-violet-300 disabled:opacity-60 comfort:min-h-10 comfort:text-base"
              >
                {saving ? 'Saving…' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setCreating(false);
                  setError(null);
                }}
                className="min-h-9 rounded-xl border border-white/10 px-4 py-1.5 text-sm font-medium text-neutral-400 transition hover:text-white comfort:min-h-10 comfort:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-5 space-y-4 comfort:mt-6 comfort:space-y-5">
        {followUps.length === 0 && !creating && (
          <p className="text-sm text-neutral-500 comfort:text-base">
            No follow-ups pending — all clear.
          </p>
        )}
        {followUps.map((followUp) => {
          const project = getProject(followUp.projectId);
          return (
            <article
              key={followUp.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
              style={{ borderLeft: `4px solid ${project?.color ?? '#737373'}` }}
            >
              <div className="flex items-start justify-between gap-4 comfort:gap-5">
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium comfort:text-xl">{followUp.person}</h3>
                  <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
                    {followUp.reason}
                  </p>
                  <p
                    className="mt-1.5 text-xs comfort:text-sm"
                    style={{ color: project?.color ?? '#a3a3a3' }}
                  >
                    {project?.name ?? 'Unassigned'}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {followUp.dueLabel && (
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 comfort:px-4 comfort:py-2 comfort:text-sm">
                      {followUp.dueLabel}
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => handleMarkDone(followUp.id)}
                    className="rounded-xl border border-white/10 px-3 py-1 text-xs text-neutral-400 transition hover:border-green-400/30 hover:text-green-300 disabled:opacity-50 comfort:text-sm"
                  >
                    Done
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 comfort:mt-5">
        <Link
          href="/follow-ups"
          className="text-xs text-neutral-500 transition hover:text-neutral-300 comfort:text-sm"
        >
          Manage all follow-ups →
        </Link>
      </div>
    </div>
  );
}
