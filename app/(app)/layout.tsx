import { AppShell } from '@/components/AppShell';
import { TempoProvider } from '@/components/TempoProvider';
import {
  fetchProjects,
  fetchReminders,
  fetchNotes,
  fetchFollowUps,
  fetchWeekItems,
} from '@/lib/supabase/queries';
import type { DashboardData } from '@/types/dashboard';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [projects, todayItems, notes, followUps, weekItems] = await Promise.all([
    fetchProjects(),
    fetchReminders(),
    fetchNotes(),
    fetchFollowUps(),
    fetchWeekItems(),
  ]);

  const initialData: DashboardData = {
    projects,
    todayItems,
    notes,
    weekItems,
    followUps,
  };

  return (
    <TempoProvider initialData={initialData}>
      <AppShell>{children}</AppShell>
    </TempoProvider>
  );
}
