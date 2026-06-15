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
  const { dashboardData, comfortView, setComfortView, addReminder, addNote } = useTempo();

  return (
    <section className="space-y-6 comfort:space-y-8">
      <div className="flex justify-end">
        <button
          type="button"
          aria-pressed={comfortView}
          onClick={() => setComfortView((current) => !current)}
          className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition comfort:min-h-12 comfort:px-5 comfort:py-3 comfort:text-base ${
            comfortView
              ? 'border-violet-400/40 bg-violet-400/15 text-violet-200'
              : 'border-white/10 bg-white/4 text-neutral-300 hover:border-white/20 hover:text-white'
          }`}
        >
          Larger text: {comfortView ? 'On' : 'Off'}
        </button>
      </div>

      <HeroSection />

      <section className="grid gap-6 comfort:gap-8 lg:grid-cols-[1.3fr_0.7fr]">
        <TodayPanel items={dashboardData.todayItems} projects={dashboardData.projects} />
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
        />
      </section>

      <section className="grid gap-6 comfort:gap-8 lg:grid-cols-2">
        <ProjectsPanel projects={dashboardData.projects} />
        <NotesPanel notes={dashboardData.notes} projects={dashboardData.projects} />
      </section>
    </section>
  );
}
