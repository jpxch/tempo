// Browser-side write functions. Import only from Client Components.
// The anon key with RLS is the intended security boundary until auth (0.5).

import { createClient } from './client';
import type { Note, TodayItem } from '@/types/dashboard';

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
