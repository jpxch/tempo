'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deleteNote, insertNote, updateNote } from '@/lib/supabase/mutations';
import type { Note, Project } from '@/types/dashboard';

type NotesClientProps = {
  initialNotes: Note[];
  initialProjects: Project[];
};

export function NotesClient({ initialNotes, initialProjects }: NotesClientProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newText, setNewText] = useState('');
  const [newProjectId, setNewProjectId] = useState(initialProjects[0]?.id ?? '');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    const text = newText.trim();
    if (!text) { setError('Note text is required.'); return; }
    if (!newProjectId) { setError('Choose a project.'); return; }
    setSaving(true);
    setError(null);
    try {
      await insertNote({ text, projectId: newProjectId });
      setCreating(false);
      setNewText('');
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create note.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    const text = editText.trim();
    if (!text) { setError('Note text is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await updateNote(id, { title: text });
      setEditingId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update note.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    try {
      await deleteNote(id);
      setPendingDeleteId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete note.');
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
          <h1 className="text-3xl font-semibold comfort:text-4xl">Notes</h1>
          <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
            Creative memory attached to your projects.
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
            New note
          </button>
        )}
      </div>

      {/* Global error */}
      {error && (
        <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300 comfort:text-base">
          {error}
        </p>
      )}

      {/* New note form */}
      {creating && initialProjects.length === 0 && (
        <div className="rounded-3xl border border-amber-400/20 bg-amber-400/5 p-5 comfort:p-6">
          <p className="text-sm text-amber-300 comfort:text-base">
            You need a project before you can create a note.{' '}
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
              <label htmlFor="new-note-text" className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                Note *
              </label>
              <textarea
                id="new-note-text"
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Capture an idea, observation, or next creative step…"
                className="min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-28 comfort:text-base"
              />
            </div>
            <div>
              <label htmlFor="new-note-project" className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
                Project *
              </label>
              <select
                id="new-note-project"
                value={newProjectId}
                onChange={(e) => setNewProjectId(e.target.value)}
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
              >
                {initialProjects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                disabled={saving}
                onClick={handleCreate}
                className="min-h-11 rounded-2xl bg-violet-400 px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-violet-300 disabled:opacity-60 comfort:min-h-12 comfort:text-base"
              >
                {saving ? 'Saving…' : 'Add note'}
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

      {/* Notes list */}
      <div className="space-y-3 comfort:space-y-4">
        {initialNotes.length === 0 && !creating && (
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
            <p className="text-sm text-neutral-500 comfort:text-base">
              No notes yet. Capture one from the dashboard or above.
            </p>
          </div>
        )}

        {initialNotes.map((note) => {
          const project = initialProjects.find((p) => p.id === note.projectId);

          return (
            <div
              key={note.id}
              className="rounded-3xl border border-white/10 bg-white/4 p-5 comfort:p-6"
              style={{ borderLeft: `4px solid ${project?.color ?? '#737373'}` }}
            >
              {editingId === note.id ? (
                <div className="space-y-3 comfort:space-y-4">
                  <textarea
                    aria-label="Note text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="min-h-20 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-24 comfort:text-base"
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleUpdate(note.id)}
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
                </div>
              ) : pendingDeleteId === note.id ? (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-300 comfort:text-base">
                    Delete this note? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleDelete(note.id)}
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
                      {note.title}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 comfort:text-sm">
                      {note.updatedLabel}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => { setEditingId(note.id); setEditText(note.title); setError(null); }}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/20 hover:text-white comfort:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPendingDeleteId(note.id); setError(null); }}
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
