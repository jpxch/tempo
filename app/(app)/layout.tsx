import { AppShell } from '@/components/AppShell';
import { TempoProvider } from '@/components/TempoProvider';
import { fetchProjects, fetchReminders, fetchNotes } from '@/lib/supabase/queries';
import { mockWeekItems, mockFollowUps } from '@/lib/dashboard-data';
import type { DashboardData } from '@/types/dashboard';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [projects, todayItems, notes] = await Promise.all([
    fetchProjects(),
    fetchReminders(),
    fetchNotes(),
  ]);

  const initialData: DashboardData = {
    projects,
    todayItems,
    notes,
    weekItems: mockWeekItems,
    followUps: mockFollowUps,
  };

  return (
    <TempoProvider initialData={initialData}>
      <AppShell>{children}</AppShell>
    </TempoProvider>
  );
}
