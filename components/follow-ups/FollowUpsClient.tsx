'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  deleteFollowUp,
  insertFollowUp,
  updateFollowUp,
} from '@/lib/supabase/mutations';
import type { FollowUp, Project } from '@/types/dashboard';

type FollowUpsClientProps = {
  initialFollowUps: FollowUp[];
  initialProjects: Project[];
};

const DUE_OPTIONS = ['Today', 'Tomorrow', 'This Week', 'Soon'];

export function FollowUpsClient({ initialFollowUps, initialProjects }: FollowUpsClientProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newPerson, setNewPerson] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newDueLabel, setNewDueLabel] = useState(DUE_OPTIONS[3]);
  const [newProjectId, setNewProjectId] = useState(initialProjects[0]?.id ?? '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPerson, setEditPerson] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editDueLabel, setEditDueLabel] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const person = newPerson.trim();
    if (!person) { setError('Name is required.'); return; }
    if (!newProjectId) { setError('Choose a project.'); return; }
    setSaving(true);
    setError(null);
    try {
      await insertFollowUp({
        person,
        reason: newReason.trim(),
        dueLabel: newDueLabel,
        projectId: newProjectId,
      });
      setCreating(false);
      setNewPerson('');
      setNewReason('');
      setNewDueLabel(DUE_OPTIONS[3]);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create follow-up.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string, event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    const person = editPerson.trim();
    if (!person) { setError('Name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await updateFollowUp(id, { person, reason: editReason.trim(), dueLabel: editDueLabel });
      setEditingId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update follow-up.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    try {
      await deleteFollowUp(id);
      setPendingDeleteId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete follow-up.');
      setPendingDeleteId(null);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="space-y-6 comfort:space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold comfort:text-4xl">Follow-ups</h1>
          <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
            People and replies waiting on you.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => {
              setCreating(true);
              setNewProjectId(initialProjects[0]?.id ?? '');
              setError(null);
            }}
            className="min-h-11 rounded-full border border-violet-400/40 bg-violet-400/15 px-5 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-400/25 comfort:min-h-12 comfort:text-base"
          >
            New follow-up
          </button>
        )}
      </div>

      {/* Global error */}
      {error && (
        <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300 comfort:text-base">
          {error}
        </p>
      )}

      {/* New follow-up form */}
      {creating && initialProjects.length === 0 && (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5 comfort:p-6">
          <p className="text-sm text-amber-300 comfort:text-base">
            You need a project before you can create a follow-up.{' '}
            <Link href="/projects" className="underline hover:text-amber-200">
              Add a project →
            </Link>
          </p>
        </div>
      )}
      {creating && initialProjects.length > 0 && (
        <div className="rounded-3xl border border-violet-400/30 bg-white/4 p-5 comfort:p-6">
          <form className="space-y-3 comfort:space-y-4" onSubmit={handleCreate}>
            <div>
              <label htmlFor="new-followup-person" className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                Person *
              </label>
              <input
                id="new-followup-person"
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Who do you need to follow up with?"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
              />
            </div>
            <div>
              <label htmlFor="new-followup-reason" className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                Reason
              </label>
              <input
                id="new-followup-reason"
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                placeholder="What are you waiting on?"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 comfort:gap-4">
              <div>
                <label htmlFor="new-followup-due" className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                  When
                </label>
                <select
                  id="new-followup-due"
                  value={newDueLabel}
                  onChange={(e) => setNewDueLabel(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
                >
                  {DUE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="new-followup-project" className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                  Project *
                </label>
                <select
                  id="new-followup-project"
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
                >
                  {initialProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="min-h-11 rounded-2xl bg-violet-400 px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-violet-300 disabled:opacity-60 comfort:min-h-12 comfort:text-base"
              >
                {saving ? 'Saving…' : 'Add follow-up'}
              </button>
              <button
                type="button"
                onClick={() => { setCreating(false); setError(null); }}
                className="min-h-11 rounded-2xl border border-white/10 px-5 py-2 text-sm font-medium text-neutral-400 transition hover:text-white comfort:min-h-12 comfort:text-base"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Follow-ups list */}
      <div className="space-y-3 comfort:space-y-4">
        {initialFollowUps.length === 0 && !creating && (
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
            <p className="text-sm text-neutral-500 comfort:text-base">
              No follow-ups pending — all clear.
            </p>
          </div>
        )}

        {initialFollowUps.map((followUp) => {
          const project = initialProjects.find((p) => p.id === followUp.projectId);

          return (
            <div
              key={followUp.id}
              className="rounded-3xl border border-white/10 bg-white/4 p-5 comfort:p-6"
              style={{ borderLeft: `4px solid ${project?.color ?? '#737373'}` }}
            >
              {editingId === followUp.id ? (
                <form
                  className="space-y-3 comfort:space-y-4"
                  onSubmit={(event) => handleUpdate(followUp.id, event)}
                >
                  <div>
                    <label htmlFor={`edit-person-${followUp.id}`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                      Person *
                    </label>
                    <input
                      id={`edit-person-${followUp.id}`}
                      type="text"
                      value={editPerson}
                      onChange={(e) => setEditPerson(e.target.value)}
                      className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-reason-${followUp.id}`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                      Reason
                    </label>
                    <input
                      id={`edit-reason-${followUp.id}`}
                      type="text"
                      value={editReason}
                      onChange={(e) => setEditReason(e.target.value)}
                      className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-due-${followUp.id}`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                      When
                    </label>
                    <select
                      id={`edit-due-${followUp.id}`}
                      value={editDueLabel}
                      onChange={(e) => setEditDueLabel(e.target.value)}
                      className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
                    >
                      {DUE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-xl bg-violet-400 px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-violet-300 disabled:opacity-60 comfort:text-base"
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setEditingId(null); setError(null); }}
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-white comfort:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : pendingDeleteId === followUp.id ? (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-300 comfort:text-base">
                    Delete this follow-up? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleDelete(followUp.id)}
                      className="rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30 disabled:opacity-50 comfort:text-base"
                    >
                      {saving ? 'Deleting…' : 'Yes, delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDeleteId(null)}
                      className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-white comfort:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs comfort:text-sm" style={{ color: project?.color ?? '#a3a3a3' }}>
                      {project?.name ?? 'Unassigned'}
                    </p>
                    <p className="mt-1 text-sm font-medium text-neutral-100 comfort:text-base">
                      {followUp.person}
                    </p>
                    {followUp.reason && (
                      <p className="mt-0.5 text-xs text-neutral-400 comfort:text-sm">
                        {followUp.reason}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-start gap-2">
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 comfort:px-4 comfort:py-2 comfort:text-sm">
                      {followUp.dueLabel}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(followUp.id);
                        setEditPerson(followUp.person);
                        setEditReason(followUp.reason);
                        setEditDueLabel(followUp.dueLabel);
                        setError(null);
                      }}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/20 hover:text-white comfort:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPendingDeleteId(followUp.id); setError(null); }}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-red-400/30 hover:text-red-300 comfort:text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
