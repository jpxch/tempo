import { fetchProjects, fetchReminders } from '@/lib/supabase/queries';
import { RemindersClient } from '@/components/reminders/RemindersClient';

export default async function RemindersPage() {
  const [reminders, projects] = await Promise.all([fetchReminders(), fetchProjects()]);
  return <RemindersClient initialReminders={reminders} initialProjects={projects} />;
}
