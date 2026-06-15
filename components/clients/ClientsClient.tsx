'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { deleteClient, insertClient, updateClient } from '@/lib/supabase/mutations';
import type { Client, Project } from '@/types/dashboard';

type ClientsClientProps = {
  initialClients: Client[];
  initialProjects: Project[];
};

type FormData = {
  name: string;
  contactName: string;
};

const blankForm: FormData = { name: '', contactName: '' };

export function ClientsClient({ initialClients, initialProjects }: ClientsClientProps) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [newForm, setNewForm] = useState<FormData>(blankForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<FormData>(blankForm);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function startEdit(client: Client) {
    setEditingId(client.id);
    setEditForm({ name: client.name, contactName: client.contactName ?? '' });
    setError(null);
  }

  async function handleCreate() {
    const name = newForm.name.trim();
    if (!name) { setError('Client name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await insertClient({ name, contactName: newForm.contactName.trim() || null });
      setCreating(false);
      setNewForm(blankForm);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create client.');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(id: string) {
    const name = editForm.name.trim();
    if (!name) { setError('Client name is required.'); return; }
    setSaving(true);
    setError(null);
    try {
      await updateClient(id, { name, contactName: editForm.contactName.trim() || null });
      setEditingId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not update client.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    setSaving(true);
    setError(null);
    try {
      await deleteClient(id);
      setPendingDeleteId(null);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete client.');
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
          <h1 className="text-3xl font-semibold comfort:text-4xl">Clients</h1>
          <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
            Organizations and contacts you work with.
          </p>
        </div>
        {!creating && (
          <button
            type="button"
            onClick={() => { setCreating(true); setError(null); }}
            className="min-h-11 rounded-full border border-violet-400/40 bg-violet-400/15 px-5 py-2 text-sm font-medium text-violet-200 transition hover:bg-violet-400/25 comfort:min-h-12 comfort:text-base"
          >
            New client
          </button>
        )}
      </div>

      {/* Global error */}
      {error && (
        <p className="rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300 comfort:text-base">
          {error}
        </p>
      )}

      {/* New client form */}
      {creating && (
        <ClientForm
          form={newForm}
          saving={saving}
          onChange={setNewForm}
          onSave={handleCreate}
          onCancel={() => { setCreating(false); setError(null); }}
        />
      )}

      {/* List */}
      <div className="space-y-3 comfort:space-y-4">
        {initialClients.length === 0 && !creating && (
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
            <p className="text-sm text-neutral-500 comfort:text-base">
              No clients yet. Add one above.
            </p>
          </div>
        )}

        {initialClients.map((client) => {
          const projectCount = initialProjects.filter((p) => p.clientId === client.id).length;

          if (editingId === client.id) {
            return (
              <ClientForm
                key={client.id}
                form={editForm}
                saving={saving}
                onChange={setEditForm}
                onSave={() => handleUpdate(client.id)}
                onCancel={() => { setEditingId(null); setError(null); }}
              />
            );
          }

          return (
            <div
              key={client.id}
              className="rounded-3xl border border-white/10 bg-white/4 p-5 comfort:p-6"
            >
              {pendingDeleteId === client.id ? (
                <div className="space-y-3">
                  <p className="text-sm text-neutral-300 comfort:text-base">
                    Delete <span className="font-medium text-neutral-100">{client.name}</span>?
                    {projectCount > 0 && (
                      <span className="text-amber-300">
                        {' '}
                        {projectCount} project{projectCount !== 1 ? 's' : ''} will become
                        unassigned.
                      </span>
                    )}
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleDelete(client.id)}
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
                  <div>
                    <p className="text-lg font-semibold text-neutral-100 comfort:text-xl">
                      {client.name}
                    </p>
                    {client.contactName && (
                      <p className="mt-0.5 text-sm text-neutral-400 comfort:text-base">
                        {client.contactName}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-neutral-500 comfort:text-sm">
                      {projectCount} project{projectCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(client)}
                      className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-400 transition hover:border-white/20 hover:text-white comfort:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => { setPendingDeleteId(client.id); setError(null); }}
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

type ClientFormProps = {
  form: FormData;
  saving: boolean;
  onChange: (form: FormData) => void;
  onSave: () => void;
  onCancel: () => void;
};

function ClientForm({ form, saving, onChange, onSave, onCancel }: ClientFormProps) {
  return (
    <div className="rounded-3xl border border-violet-400/30 bg-white/4 p-5 comfort:p-6">
      <div className="space-y-3 comfort:space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 comfort:gap-4">
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
              Name *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => onChange({ ...form, name: e.target.value })}
              placeholder="Client or organization name"
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm">
              Contact name
            </label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => onChange({ ...form, contactName: e.target.value })}
              placeholder="Primary contact (optional)"
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none focus:border-violet-300 comfort:min-h-12 comfort:text-base"
            />
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
