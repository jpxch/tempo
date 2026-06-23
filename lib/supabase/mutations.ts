// Browser-side write functions. Import only from Client Components.
// Runs as the authenticated user via the JWT stored in session cookies.
// user_id is stamped on every insert by the database default (auth.uid());
// RLS policies enforce ownership for all reads and writes.

import { createClient } from './client';
import type { Client, FollowUp, Note, Project, TodayItem, WeekItem } from '@/types/dashboard';

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

  // Reminders, notes, follow_ups, and week_items FK to projects with ON DELETE RESTRICT.
  // Pre-check and surface a readable message instead of a raw FK error.
  const [
    { count: rc, error: re },
    { count: nc, error: ne },
    { count: fc, error: fe },
    { count: wc, error: we },
  ] = await Promise.all([
    supabase.from('reminders').select('*', { count: 'exact', head: true }).eq('project_id', id),
    supabase.from('notes').select('*', { count: 'exact', head: true }).eq('project_id', id),
    supabase.from('follow_ups').select('*', { count: 'exact', head: true }).eq('project_id', id),
    supabase.from('week_items').select('*', { count: 'exact', head: true }).eq('project_id', id),
  ]);

  if (re) throw new Error(re.message);
  if (ne) throw new Error(ne.message);
  if (fe) throw new Error(fe.message);
  if (we) throw new Error(we.message);

  const reminders = rc ?? 0;
  const notes = nc ?? 0;
  const followUps = fc ?? 0;
  const weekItems = wc ?? 0;

  if (reminders > 0 || notes > 0 || followUps > 0 || weekItems > 0) {
    const parts: string[] = [];
    if (reminders > 0) parts.push(`${reminders} reminder${reminders !== 1 ? 's' : ''}`);
    if (notes > 0) parts.push(`${notes} note${notes !== 1 ? 's' : ''}`);
    if (followUps > 0) parts.push(`${followUps} follow-up${followUps !== 1 ? 's' : ''}`);
    if (weekItems > 0) parts.push(`${weekItems} weekly item${weekItems !== 1 ? 's' : ''}`);
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

export async function completeReminder(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from('reminders')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', id);

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

// ─── Follow-ups ───────────────────────────────────────────────────────────────

export async function insertFollowUp(input: {
  person: string;
  reason: string;
  dueLabel: string;
  projectId: string;
}): Promise<FollowUp> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('follow_ups')
    .insert({
      person: input.person,
      reason: input.reason,
      due_label: input.dueLabel,
      project_id: input.projectId,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    person: data.person,
    reason: data.reason,
    dueLabel: data.due_label,
    projectId: data.project_id,
  };
}

export async function updateFollowUp(
  id: string,
  input: { person?: string; reason?: string; dueLabel?: string },
): Promise<FollowUp> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.person !== undefined) patch.person = input.person;
  if (input.reason !== undefined) patch.reason = input.reason;
  if (input.dueLabel !== undefined) patch.due_label = input.dueLabel;

  const { data, error } = await supabase
    .from('follow_ups')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    person: data.person,
    reason: data.reason,
    dueLabel: data.due_label,
    projectId: data.project_id,
  };
}

export async function deleteFollowUp(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('follow_ups').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ─── Week Items ───────────────────────────────────────────────────────────────

export async function insertWeekItem(input: {
  title: string;
  dueLabel: string;
  projectId: string;
}): Promise<WeekItem> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('week_items')
    .insert({
      title: input.title,
      due_label: input.dueLabel,
      project_id: input.projectId,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    dueLabel: data.due_label,
    projectId: data.project_id,
  };
}

export async function updateWeekItem(
  id: string,
  input: { title?: string; dueLabel?: string },
): Promise<WeekItem> {
  const supabase = createClient();
  const patch: Record<string, unknown> = {};
  if (input.title !== undefined) patch.title = input.title;
  if (input.dueLabel !== undefined) patch.due_label = input.dueLabel;

  const { data, error } = await supabase
    .from('week_items')
    .update(patch)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw new Error(error.message);

  return {
    id: data.id,
    title: data.title,
    dueLabel: data.due_label,
    projectId: data.project_id,
  };
}

export async function deleteWeekItem(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('week_items').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
