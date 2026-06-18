import { AppShell } from '@/components/AppShell';
import { TempoProvider } from '@/components/TempoProvider';
import { fetchProjects, fetchReminders, fetchNotes, fetchFollowUps } from '@/lib/supabase/queries';
import { mockWeekItems } from '@/lib/dashboard-data';
import type { DashboardData } from '@/types/dashboard';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [projects, todayItems, notes, allFollowUps] = await Promise.all([
    fetchProjects(),
    fetchReminders(),
    fetchNotes(),
    fetchFollowUps(),
  ]);

  const initialData: DashboardData = {
    projects,
    todayItems,
    notes,
    weekItems: mockWeekItems,
    followUps: allFollowUps.filter((f) => f.status === 'open'),
  };

  return (
    <TempoProvider initialData={initialData}>
      <AppShell>{children}</AppShell>
    </TempoProvider>
  );
}
