import { AppShell } from '@/components/AppShell';
import { TempoProvider } from '@/components/TempoProvider';
import { createClient } from '@/lib/supabase/server';
import {
  fetchProjects,
  fetchReminders,
  fetchNotes,
  fetchFollowUps,
  fetchWeekItems,
} from '@/lib/supabase/queries';
import type { DashboardData } from '@/types/dashboard';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const displayName = (user?.user_metadata?.name as string | undefined) ?? 'Ray';

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
    <TempoProvider initialData={initialData} displayName={displayName}>
      <AppShell>{children}</AppShell>
    </TempoProvider>
  );
}
