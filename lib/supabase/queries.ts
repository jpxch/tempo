// Server-side read functions. Import only from Server Components.
// Uses the anon key — RLS enforces access control.

import { createClient } from './server';
import type { Client, FollowUp, Note, Project, TodayItem, WeekItem } from '@/types/dashboard';

export async function fetchClients(): Promise<Client[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch clients: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    contactName: row.contact_name,
  }));
}

export async function fetchProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    status: row.status,
    next: row.next,
    color: row.color,
    clientId: row.client_id,
  }));
}

export async function fetchReminders(): Promise<TodayItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .is('completed_at', null)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch reminders: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    detail: row.detail,
    time: row.time_label,
    type: row.type,
    projectId: row.project_id,
  }));
}

export async function fetchNotes(): Promise<Note[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch notes: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    preview: row.preview,
    projectId: row.project_id,
    updatedLabel: row.updated_label,
  }));
}

export async function fetchFollowUps(): Promise<FollowUp[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('follow_ups')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch follow-ups: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    person: row.person,
    reason: row.reason,
    dueLabel: row.due_label,
    projectId: row.project_id,
  }));
}

export async function fetchWeekItems(): Promise<WeekItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('week_items')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw new Error(`Failed to fetch week items: ${error.message}`);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    dueLabel: row.due_label,
    projectId: row.project_id,
  }));
}
