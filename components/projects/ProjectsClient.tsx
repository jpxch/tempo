'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import {
  deleteProject,
  insertProject,
  updateProject,
} from '@/lib/supabase/mutations';
import type { Client, Project } from '@/types/dashboard';

type ProjectsClientProps = {
  initialProjects: Project[];
  initialClients: Client[];
};

type FormData = {
  name: string;
  status: string;
  next: string;
  color: string;
  clientId: string;
};

const blankForm: FormData = {
  name: '',
  status: 'Active',
  next: '',
  color: '#a78bfa',
  clientId: '',
};

const STATUS_OPTIONS = ['Active', 'Upcoming', 'Waiting', 'Completed'];

export function ProjectsClient({ initialProjects, initialClients }: ProjectsClientProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<FormData>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormData>(blankForm);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(project: Project) {
    setEditingId(project.id);
    setEditForm({
      name: project.name,
      status: project.status,
      next: project.next,
      color: project.color,
      clientId: project.clientId ?? '',
    });
    setError(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setError(null);
  }

  async function handleCreate() {
    const name = newForm.name.trim();
    if (!name) { setError('Project name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await insertProject({
        name,
        status: newForm.status,
        next: newForm.next.trim(),
        color: newForm.color,
        clientId: newForm.clientId || null,
      });
      setCreating(false);
      setNewForm(blankForm);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create project.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    const name = editForm.name.trim();
    if (!name) { setError('Project name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await updateProject(id, {
        name,
        status: editForm.status,
        next: editForm.next.trim(),
        color: editForm.color,
        clientId: editForm.clientId || null,
      });
      setEditingId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update project.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    try {
      await deleteProject(id);
      setPendingDeleteId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete project.');
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
          <h1 className="text-3xl font-semibold comfort:text-4xl">Projects</h1>
          <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
            All projects and their current status.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => { setCreating(true); setError(null); }}
            className="min-h-11 rounded-full border border-violet-400/40 bg-violet-400/15 px-5 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-400/25 comfort:min-h-12 comfort:text-base"
          >
            New project
          </button>
        )}
      </div>

      {/* Global error */}
      {error && (
        <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300 comfort:text-base">
          {error}
        </p>
      )}

      {/* New project form */}
      {creating && (
        <ProjectForm
          form={newForm}
          clients={initialClients}
          saving={saving}
          formId="project-create"
          onChange={setNewForm}
          onSave={handleCreate}
          onCancel={() => { setCreating(false); setError(null); }}
        />
      )}

      {/* List */}
      <div className="space-y-3 comfort:space-y-4">
        {initialProjects.length === 0 && !creating && (
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
            <p className="text-sm text-neutral-500 comfort:text-base">
              No projects yet. Create your first one above.
            </p>
          </div>
        )}

        {initialProjects.map((project) => {
          const client = initialClients.find((c) => c.id === project.clientId);

          if (editingId === project.id) {
            return (
              <ProjectForm
                key={project.id}
                form={editForm}
                clients={initialClients}
                saving={saving}
                formId="project-edit"
                onChange={setEditForm}
                onSave={() => handleUpdate(project.id)}
                onCancel={cancelEdit}
              />
            );
          }

          return (
            <div
              key={project.id}
              className="rounded-3xl border border-white/10 bg-white/4 p-5 comfort:p-6"
              style={{ borderLeft: `4px solid ${project.color}` }}
            >
              {pendingDeleteId === project.id ? (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-300 comfort:text-base">
                    Delete <span className="font-medium text-neutral-100">{project.name}</span>?
                    This cannot be undone. The project must have no reminders or notes.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleDelete(project.id)}
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
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: project.color }}
                      />
                      <Link
                        href={`/projects/${project.id}`}
                        className="text-lg font-semibold text-neutral-100 transition hover:underline comfort:text-xl"
                      >
                        {project.name}
                      </Link>
                      <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs text-neutral-300 comfort:text-sm">
                        {project.status}
                      </span>
                    </div>
                    {project.next && (
                      <p className="pl-6 text-sm text-neutral-400 comfort:text-base">
                        {project.next}
                      </p>
                    )}
                    {client && (
                      <p className="pl-6 text-xs text-neutral-500 comfort:text-sm">
                        {client.name}
                        {client.contactName ? ` · ${client.contactName}` : ''}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(project)}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/20 hover:text-white comfort:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPendingDeleteId(project.id); setError(null); }}
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

type ProjectFormProps = {
  form: FormData;
  clients: Client[];
  saving: boolean;
  formId: string;
  onChange: (form: FormData) => void;
  onSave: () => void;
  onCancel: () => void;
};

function ProjectForm({ form, clients, saving, formId, onChange, onSave, onCancel }: ProjectFormProps) {
  return (
    <div className="rounded-3xl border border-violet-400/30 bg-white/4 p-5 comfort:p-6">
      <div className="space-y-3 comfort:space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 comfort:gap-4">
          <div>
            <label htmlFor={`${formId}-name`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
              Name *
            </label>
            <input
              id={`${formId}-name`}
              type="text"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              placeholder="Project name"
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
            />
          </div>
          <div>
            <label htmlFor={`${formId}-status`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
              Status *
            </label>
            <select
              id={`${formId}-status`}
              value={form.status}
              onChange={(e) => onChange({ ...form, status: e.target.value })}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor={`${formId}-next`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
            Next action
          </label>
          <input
            id={`${formId}-next`}
            type="text"
            value={form.next}
            onChange={(e) => onChange({ ...form, next: e.target.value })}
            placeholder="Short next step"
            className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
          />
        </div>

        <div className="grid gap-3 sm:grid-cols-2 comfort:gap-4">
          <div>
            <label htmlFor={`${formId}-client`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
              Client
            </label>
            <select
              id={`${formId}-client`}
              value={form.clientId}
              onChange={(e) => onChange({ ...form, clientId: e.target.value })}
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
            >
              <option value="">No client</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${formId}-color`} className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
              Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id={`${formId}-color`}
                type="color"
                value={form.color}
                onChange={(e) => onChange({ ...form, color: e.target.value })}
                className="h-11 w-16 cursor-pointer rounded-xl border border-white/10 bg-neutral-950 p-1 comfort:h-12"
              />
              <span className="font-mono text-sm text-neutral-500 comfort:text-base">
                {form.color}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="min-h-11 rounded-2xl bg-violet-400 px-5 py-2 text-sm font-medium text-neutral-950 transition hover:bg-violet-300 disabled:opacity-60 comfort:min-h-12 comfort:text-base"
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="min-h-11 rounded-2xl border border-white/10 px-5 py-2 text-sm font-medium text-neutral-400 transition hover:text-white comfort:min-h-12 comfort:text-base"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
