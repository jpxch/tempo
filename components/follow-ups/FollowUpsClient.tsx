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

export function FollowUpsClient({ initialFollowUps, initialProjects }: FollowUpsClientProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newPerson, setNewPerson] = useState('');
  const [newReason, setNewReason] = useState('');
  const [newDueLabel, setNewDueLabel] = useState('');
  const [newProjectId, setNewProjectId] = useState(initialProjects[0]?.id ?? '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPerson, setEditPerson] = useState('');
  const [editReason, setEditReason] = useState('');
  const [editDueLabel, setEditDueLabel] = useState('');
  const [editProjectId, setEditProjectId] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(e instanceof Error ? e.message : 'Could not create follow-up.');
    } finally {
      setSaving(false);
    }
  }

  function startEdit(followUp: FollowUp) {
    setEditingId(followUp.id);
    setEditPerson(followUp.person);
    setEditReason(followUp.reason);
    setEditDueLabel(followUp.dueLabel);
    setEditProjectId(followUp.projectId);
    setError(null);
  }

  async function handleUpdate(id: string) {
    const person = editPerson.trim();
    const reason = editReason.trim();
    if (!person) { setError('Name is required.'); return; }
    if (!reason) { setError('Reason is required.'); return; }
    if (!editProjectId) { setError('Choose a project.'); return; }
    setSaving(true);
    setError(null);
    try {
      await updateFollowUp(id, {
        person,
        reason,
        dueLabel: editDueLabel.trim(),
        projectId: editProjectId,
      });
      setEditingId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update follow-up.');
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleStatus(followUp: FollowUp) {
    setSaving(true);
    setError(null);
    try {
      await updateFollowUp(followUp.id, {
        status: followUp.status === 'open' ? 'done' : 'open',
      });
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

  const openFollowUps = initialFollowUps.filter((f) => f.status === 'open');
  const doneFollowUps = initialFollowUps.filter((f) => f.status === 'done');

  return (
    <section className="space-y-6 comfort:space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold comfort:text-4xl">Follow-ups</h1>
          <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
            People you are waiting on or need to contact.
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
          <div className="space-y-3 comfort:space-y-4">
            <div>
              <label
                htmlFor="new-fu-person"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
              >
                Person *
              </label>
              <input
                id="new-fu-person"
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                placeholder="Who needs a follow-up?"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
              />
            </div>
            <div>
              <label
                htmlFor="new-fu-reason"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
              >
                Reason *
              </label>
              <input
                id="new-fu-reason"
                type="text"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
                placeholder="What's the follow-up about?"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="new-fu-due"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
                >
                  Due
                </label>
                <input
                  id="new-fu-due"
                  type="text"
                  value={newDueLabel}
                  onChange={(e) => setNewDueLabel(e.target.value)}
                  placeholder="Today, Friday…"
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
                />
              </div>
              <div>
                <label
                  htmlFor="new-fu-project"
                  className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
                >
                  Project *
                </label>
                <select
                  id="new-fu-project"
                  value={newProjectId}
                  onChange={(e) => setNewProjectId(e.target.value)}
                  className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
                >
                  {initialProjects.map((p) => (
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
          </div>
        </div>
      )}

      {/* Open follow-ups */}
      <div className="space-y-3 comfort:space-y-4">
        {openFollowUps.length === 0 && !creating && (
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
            <p className="text-sm text-neutral-500 comfort:text-base">
              No open follow-ups. Add one above.
            </p>
          </div>
        )}
        {openFollowUps.map((followUp) => (
          <FollowUpCard
            key={followUp.id}
            followUp={followUp}
            projects={initialProjects}
            editingId={editingId}
            editPerson={editPerson}
            editReason={editReason}
            editDueLabel={editDueLabel}
            editProjectId={editProjectId}
            pendingDeleteId={pendingDeleteId}
            saving={saving}
            onStartEdit={startEdit}
            onEditPerson={setEditPerson}
            onEditReason={setEditReason}
            onEditDueLabel={setEditDueLabel}
            onEditProjectId={setEditProjectId}
            onUpdate={handleUpdate}
            onCancelEdit={() => { setEditingId(null); setError(null); }}
            onToggleStatus={handleToggleStatus}
            onPendingDelete={setPendingDeleteId}
            onDelete={handleDelete}
            onCancelDelete={() => setPendingDeleteId(null)}
          />
        ))}
      </div>

      {/* Done follow-ups */}
      {doneFollowUps.length > 0 && (
        <div className="space-y-3 comfort:space-y-4">
          <h2 className="text-sm font-medium uppercase tracking-wider text-neutral-500 comfort:text-base">
            Completed
          </h2>
          {doneFollowUps.map((followUp) => (
            <FollowUpCard
              key={followUp.id}
              followUp={followUp}
              projects={initialProjects}
              editingId={editingId}
              editPerson={editPerson}
              editReason={editReason}
              editDueLabel={editDueLabel}
              editProjectId={editProjectId}
              pendingDeleteId={pendingDeleteId}
              saving={saving}
              onStartEdit={startEdit}
              onEditPerson={setEditPerson}
              onEditReason={setEditReason}
              onEditDueLabel={setEditDueLabel}
              onEditProjectId={setEditProjectId}
              onUpdate={handleUpdate}
              onCancelEdit={() => { setEditingId(null); setError(null); }}
              onToggleStatus={handleToggleStatus}
              onPendingDelete={setPendingDeleteId}
              onDelete={handleDelete}
              onCancelDelete={() => setPendingDeleteId(null)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type FollowUpCardProps = {
  followUp: FollowUp;
  projects: Project[];
  editingId: string | null;
  editPerson: string;
  editReason: string;
  editDueLabel: string;
  editProjectId: string;
  pendingDeleteId: string | null;
  saving: boolean;
  onStartEdit: (f: FollowUp) => void;
  onEditPerson: (v: string) => void;
  onEditReason: (v: string) => void;
  onEditDueLabel: (v: string) => void;
  onEditProjectId: (v: string) => void;
  onUpdate: (id: string) => void;
  onCancelEdit: () => void;
  onToggleStatus: (f: FollowUp) => void;
  onPendingDelete: (id: string) => void;
  onDelete: (id: string) => void;
  onCancelDelete: () => void;
};

function FollowUpCard({
  followUp,
  projects,
  editingId,
  editPerson,
  editReason,
  editDueLabel,
  editProjectId,
  pendingDeleteId,
  saving,
  onStartEdit,
  onEditPerson,
  onEditReason,
  onEditDueLabel,
  onEditProjectId,
  onUpdate,
  onCancelEdit,
  onToggleStatus,
  onPendingDelete,
  onDelete,
  onCancelDelete,
}: FollowUpCardProps) {
  const project = projects.find((p) => p.id === followUp.projectId);
  const isDone = followUp.status === 'done';

  return (
    <div
      className="rounded-3xl border border-white/10 bg-white/4 p-5 comfort:p-6"
      style={{ borderLeft: `4px solid ${project?.color ?? '#737373'}` }}
    >
      {editingId === followUp.id ? (
        <div className="space-y-3 comfort:space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor={`edit-person-${followUp.id}`}
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
              >
                Person
              </label>
              <input
                id={`edit-person-${followUp.id}`}
                type="text"
                value={editPerson}
                onChange={(e) => onEditPerson(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
              />
            </div>
            <div>
              <label
                htmlFor={`edit-due-${followUp.id}`}
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
              >
                Due
              </label>
              <input
                id={`edit-due-${followUp.id}`}
                type="text"
                value={editDueLabel}
                onChange={(e) => onEditDueLabel(e.target.value)}
                placeholder="Today, Friday…"
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor={`edit-reason-${followUp.id}`}
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
            >
              Reason
            </label>
            <input
              id={`edit-reason-${followUp.id}`}
              type="text"
              value={editReason}
              onChange={(e) => onEditReason(e.target.value)}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
            />
          </div>
          <div>
            <label
              htmlFor={`edit-project-${followUp.id}`}
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
            >
              Project
            </label>
            <select
              id={`edit-project-${followUp.id}`}
              value={editProjectId}
              onChange={(e) => onEditProjectId(e.target.value)}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => onUpdate(followUp.id)}
              className="rounded-xl bg-violet-400 px-4 py-2 text-sm font-medium text-neutral-950 transition hover:bg-violet-300 disabled:opacity-60 comfort:text-base"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancelEdit}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-white comfort:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : pendingDeleteId === followUp.id ? (
        <div className="space-y-3">
          <p className="text-sm text-neutral-300 comfort:text-base">
            Delete this follow-up? This cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => onDelete(followUp.id)}
              className="rounded-xl bg-red-500/20 px-4 py-2 text-sm font-medium text-red-300 transition hover:bg-red-500/30 disabled:opacity-50 comfort:text-base"
            >
              {saving ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              type="button"
              onClick={onCancelDelete}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:text-white comfort:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p
              className="text-xs comfort:text-sm"
              style={{ color: project?.color ?? '#a3a3a3' }}
            >
              {project?.name ?? 'Unassigned'}
            </p>
            <p className={`mt-1 font-medium comfort:text-lg ${isDone ? 'text-neutral-500 line-through' : 'text-neutral-100'}`}>
              {followUp.person}
            </p>
            {followUp.reason && (
              <p className="mt-0.5 text-sm text-neutral-400 comfort:text-base">
                {followUp.reason}
              </p>
            )}
            {followUp.dueLabel && (
              <p className="mt-1 text-xs text-neutral-500 comfort:text-sm">
                {followUp.dueLabel}
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => onToggleStatus(followUp)}
              className={`rounded-xl border px-3 py-1.5 text-xs transition disabled:opacity-50 comfort:text-sm ${
                isDone
                  ? 'border-white/10 text-neutral-400 hover:border-white/20 hover:text-white'
                  : 'border-white/10 text-neutral-400 hover:border-green-400/30 hover:text-green-300'
              }`}
            >
              {isDone ? 'Reopen' : 'Done'}
            </button>
            <button
              type="button"
              onClick={() => onStartEdit(followUp)}
              className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/20 hover:text-white comfort:text-sm"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => { onPendingDelete(followUp.id); }}
              className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-red-400/30 hover:text-red-300 comfort:text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
