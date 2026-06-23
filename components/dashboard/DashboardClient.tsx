'use client';

import { useTempo } from '@/components/TempoProvider';
import { FollowUpsPanel } from '@/components/dashboard/FollowUpsPanel';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { NotesPanel } from '@/components/dashboard/NotesPanel';
import { ProjectsPanel } from '@/components/dashboard/ProjectsPanel';
import { QuickCapture } from '@/components/dashboard/QuickCapture';
import { TodayPanel } from '@/components/dashboard/TodayPanel';
import { WeekPanel } from '@/components/dashboard/WeekPanel';

export function DashboardClient() {
  const { dashboardData, displayName, addReminder, addNote, completeReminder, saving } = useTempo();
  const priorityCount = dashboardData.todayItems.length;

  return (
    <section className="space-y-6 comfort:space-y-8">
      <HeroSection displayName={displayName} priorityCount={priorityCount} />

      <section className="grid gap-6 comfort:gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <TodayPanel
          items={dashboardData.todayItems}
          projects={dashboardData.projects}
          saving={saving}
          onMarkDone={completeReminder}
        />
        <FollowUpsPanel
          followUps={dashboardData.followUps}
          projects={dashboardData.projects}
        />
      </section>

      <section className="grid gap-6 comfort:gap-8 lg:grid-cols-2">
        <WeekPanel items={dashboardData.weekItems} projects={dashboardData.projects} />
        <QuickCapture
          projects={dashboardData.projects}
          onAddReminder={addReminder}
          onAddNote={addNote}
          saving={saving}
        />
      </section>

      <section className="grid gap-6 comfort:gap-8 lg:grid-cols-2">
        <ProjectsPanel projects={dashboardData.projects} />
        <NotesPanel notes={dashboardData.notes} projects={dashboardData.projects} />
      </section>
    </section>
  );
}
