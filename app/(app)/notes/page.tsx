import { fetchNotes, fetchProjects } from '@/lib/supabase/queries';
import { NotesClient } from '@/components/notes/NotesClient';

export default async function NotesPage() {
  const [notes, projects] = await Promise.all([fetchNotes(), fetchProjects()]);
  return <NotesClient initialNotes={notes} initialProjects={projects} />;
}
