// Browser-side write functions. Import only from Client Components.
// Uses the anon key — RLS is the security boundary until milestone 0.5 auth.

import { createClient } from './client';
import type { Client, Note, Project, TodayItem } from '@/types/dashboard';

// ─── Clients ──────────────────────────────────────────────────────────────────

export async function insertClient(input: {
  name: string;
  contactName?: string | null;
}): Promise<Client> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('clients')
    .insert({ name: input.name, contact_name: input.contactName ?? null })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return { id: data.id, name: data.name, contactName: data.contact_name };
}

export async function updateClient(
  id: string,
  input: { name?: string; contactName?: string | null },
): Promise<Client> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if ('contactName' in input) patch.contact_name = input.contactName ?? null;

  const { data, error } = await supabase
    .from('clients')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return { id: data.id, name: data.name, contactName: data.contact_name };
}

export async function deleteClient(id: string): Promise<void> {
  // FK on projects.client_id is ON DELETE SET NULL, so this succeeds even
  // when projects reference this client — those projects become unassigned.
  const supabase = createClient();
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function insertProject(input: {
  name: string;
  status: string;
  next: string;
  color: string;
  clientId?: string | null;
}): Promise<Project> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .insert({
      name: input.name,
      status: input.status,
      next: input.next,
      color: input.color,
      client_id: input.clientId ?? null,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    name: data.name,
    status: data.status,
    next: data.next,
    color: data.color,
    clientId: data.client_id,
  };
}

export async function updateProject(
  id: string,
  input: {
    name?: string;
    status?: string;
    next?: string;
    color?: string;
    clientId?: string | null;
  },
): Promise<Project> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.name !== undefined) patch.name = input.name;
  if (input.status !== undefined) patch.status = input.status;
  if (input.next !== undefined) patch.next = input.next;
  if (input.color !== undefined) patch.color = input.color;
  if ('clientId' in input) patch.client_id = input.clientId ?? null;

  const { data, error } = await supabase
    .from('projects')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    name: data.name,
    status: data.status,
    next: data.next,
    color: data.color,
    clientId: data.client_id,
  };
}

export async function deleteProject(id: string): Promise<void> {
  const supabase = createClient();

  // Reminders and notes FK to projects with ON DELETE RESTRICT (the default).
  // Pre-check and surface a readable message instead of a raw FK error.
  const [{ count: rc, error: re }, { count: nc, error: ne }] = await Promise.all([
    supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('project_id', id),
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('project_id', id),
  ]);

  if (re) throw new Error(re.message);
  if (ne) throw new Error(ne.message);

  const reminders = rc ?? 0;
  const notes = nc ?? 0;

  if (reminders > 0 || notes > 0) {
    const parts: string[] = [];
    if (reminders > 0) parts.push(`${reminders} reminder${reminders !== 1 ? 's' : ''}`);
    if (notes > 0) parts.push(`${notes} note${notes !== 1 ? 's' : ''}`);
    throw new Error(
      `Cannot delete: this project has ${parts.join(' and ')}. Delete them first.`,
    );
  }

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Reminders ────────────────────────────────────────────────────────────────

export async function insertReminder(input: {
  title: string;
  projectId: string;
}): Promise<TodayItem> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reminders')
    .insert({ title: input.title, project_id: input.projectId })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    detail: data.detail,
    time: data.time_label,
    type: data.type,
    projectId: data.project_id,
  };
}

export async function updateReminder(
  id: string,
  input: { title: string },
): Promise<TodayItem> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('reminders')
    .update({ title: input.title })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    detail: data.detail,
    time: data.time_label,
    type: data.type,
    projectId: data.project_id,
  };
}

export async function deleteReminder(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('reminders').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Notes ────────────────────────────────────────────────────────────────────

export async function insertNote(input: {
  text: string;
  projectId: string;
}): Promise<Note> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notes')
    .insert({ title: input.text, preview: input.text, project_id: input.projectId })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    preview: data.preview,
    projectId: data.project_id,
    updatedLabel: data.updated_label,
  };
}

export async function updateNote(id: string, input: { title: string }): Promise<Note> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notes')
    .update({ title: input.title, preview: input.title })
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    preview: data.preview,
    projectId: data.project_id,
    updatedLabel: data.updated_label,
  };
}

export async function deleteNote(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('notes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
