import { HeroSection } from '@/components/dashboard/HeroSection';
import { NotesPanel } from '@/components/dashboard/NotesPanel';
import { ProjectsPanel } from '@/components/dashboard/ProjectsPanel';
import { QuickCapture } from '@/components/dashboard/QuickCapture';
import { TodayPanel } from '@/components/dashboard/TodayPanel';
import { WeekPanel } from '@/components/dashboard/WeekPanel';
import type { DashboardData } from '@/types/dashboard';

const dashboardData: DashboardData = {
  todayItems: [
    {
      time: '9:00 AM',
      title: 'Review rehearsal plan',
      detail: 'Prep notes for today’s choreography session',
      type: 'Prep',
      projectColor: '#a78bfa',
    },
    {
      time: '12:30 PM',
      title: 'Follow up with artist team',
      detail: 'Confirm music cut, room time, and dancers',
      type: 'Follow-up',
      projectColor: '#38bdf8',
    },
    {
      time: '4:00 PM',
      title: 'Creative check-in',
      detail: 'Review concept notes and update project direction',
      type: 'Meeting',
      projectColor: '#f472b6',
    },
  ],
  weekItems: [
    'Showcase rehearsal on Thursday',
    'Payment follow-up due Friday',
    'New artist concept review this weekend',
  ],
  projects: [
    {
      name: 'Artist Choreo Package',
      status: 'Active',
      next: 'Needs music notes cleaned up',
      color: '#a78bfa',
    },
    {
      name: 'Live Show Prep',
      status: 'Upcoming',
      next: 'Confirm dancers and rehearsal space',
      color: '#38bdf8',
    },
    {
      name: 'Workshop Series',
      status: 'Waiting',
      next: 'Waiting on client approval',
      color: '#f472b6',
    },
  ],
  notes: [
    'Bridge section needs stronger transition.',
    'Try formation change after second chorus.',
    'Ask about lighting cues before final rehearsal.',
  ],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-6 text-neutral-100">
      <section className="mx-auto max-w-7xl space-y-6">
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
    </main>
  );
}
