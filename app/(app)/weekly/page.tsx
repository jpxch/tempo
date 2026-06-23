import { fetchWeekItems, fetchProjects } from '@/lib/supabase/queries';
import { WeeklyClient } from '@/components/weekly/WeeklyClient';

export default async function WeeklyPage() {
  const [weekItems, projects] = await Promise.all([fetchWeekItems(), fetchProjects()]);
  return <WeeklyClient initialWeekItems={weekItems} initialProjects={projects} />;
}
