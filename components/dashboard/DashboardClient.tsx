'use client';

import { useState } from 'react';

import { FollowUpsPanel } from '@/components/dashboard/FollowUpsPanel';
import { HeroSection } from '@/components/dashboard/HeroSection';
import { NotesPanel } from '@/components/dashboard/NotesPanel';
import { ProjectsPanel } from '@/components/dashboard/ProjectsPanel';
import { QuickCapture } from '@/components/dashboard/QuickCapture';
import { TodayPanel } from '@/components/dashboard/TodayPanel';
import { WeekPanel } from '@/components/dashboard/WeekPanel';
import type { DashboardData, Note, TodayItem } from '@/types/dashboard';

type DashboardClientProps = {
  initialData: DashboardData;
};

export function DashboardClient({ initialData }: DashboardClientProps) {
  const [dashboardData, setDashboardData] = useState(initialData);

  function addReminder(input: { title: string; projectId: string }) {
    const reminder: TodayItem = {
      id: crypto.randomUUID(),
      time: 'Just now',
      title: input.title,
      detail: 'Captured locally in Tempo',
      type: 'Reminder',
      projectId: input.projectId,
    };

    setDashboardData((currentData) => ({
      ...currentData,
      todayItems: [reminder, ...currentData.todayItems],
    }));
  }

  function addNote(input: { text: string; projectId: string }) {
    const note: Note = {
      id: crypto.randomUUID(),
      title: input.text,
      preview: input.text,
      projectId: input.projectId,
      updatedLabel: 'Just now',
    };

    setDashboardData((currentData) => ({
      ...currentData,
      notes: [note, ...currentData.notes],
    }));
  }

  return (
    <section className="space-y-6">
      <HeroSection />

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <TodayPanel items={dashboardData.todayItems} projects={dashboardData.projects} />
        <FollowUpsPanel
          followUps={dashboardData.followUps}
          projects={dashboardData.projects}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <WeekPanel items={dashboardData.weekItems} projects={dashboardData.projects} />
        <QuickCapture
          projects={dashboardData.projects}
          onAddReminder={addReminder}
          onAddNote={addNote}
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <ProjectsPanel projects={dashboardData.projects} />
        <NotesPanel notes={dashboardData.notes} projects={dashboardData.projects} />
      </section>
    </section>
  );
}
