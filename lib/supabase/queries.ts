// Server-side read functions. Import only from Server Components.
// Uses the anon key — RLS enforces access control.

import { createServerClient } from './server';
import type { Note, Project, TodayItem } from '@/types/dashboard';

export async function fetchProjects(): Promise<Project[]> {
  const supabase = createServerClient();
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
  }));
}

export async function fetchReminders(): Promise<TodayItem[]> {
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
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
  const supabase = createServerClient();
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
