import { HeroSection } from '@/components/dashboard/HeroSection';
import { NotesPanel } from '@/components/dashboard/NotesPanel';
import { ProjectsPanel } from '@/components/dashboard/ProjectsPanel';
import { QuickCapture } from '@/components/dashboard/QuickCapture';
import { TodayPanel } from '@/components/dashboard/TodayPanel';
import { WeekPanel } from '@/components/dashboard/WeekPanel';
import { AppShell } from '@/components/AppShell';
import { dashboardData } from '@/lib/dashboard-data';

export default function Home() {
  return (
    <AppShell>
      <section className="space-y-6">
        <HeroSection />

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <TodayPanel items={dashboardData.todayItems} />

          <aside className="space-y-6">
            <WeekPanel items={dashboardData.weekItems} />
            <QuickCapture />
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <ProjectsPanel projects={dashboardData.projects} />
          <NotesPanel notes={dashboardData.notes} />
        </section>
      </section>
    </AppShell>
  );
}
