'use client';

import { createContext, useContext, useState } from 'react';

import { dashboardData as seedData } from '@/lib/dashboard-data';
import type { DashboardData, Note, TodayItem } from '@/types/dashboard';

type TempoContextValue = {
  dashboardData: DashboardData;
  comfortView: boolean;
  addReminder: (input: { title: string; projectId: string }) => void;
  addNote: (input: { text: string; projectId: string }) => void;
  setComfortView: React.Dispatch<React.SetStateAction<boolean>>;
};

const TempoContext = createContext<TempoContextValue | null>(null);

export function useTempo(): TempoContextValue {
  const context = useContext(TempoContext);
  if (!context) {
    throw new Error('useTempo must be used inside TempoProvider');
  }
  return context;
}

export function TempoProvider({ children }: { children: React.ReactNode }) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(seedData);
  const [comfortView, setComfortView] = useState(true);

  function addReminder(input: { title: string; projectId: string }) {
    const reminder: TodayItem = {
      id: crypto.randomUUID(),
      time: 'Just now',
      title: input.title,
      detail: 'Captured locally in Tempo',
      type: 'Reminder',
      projectId: input.projectId,
    };
    setDashboardData((current) => ({
      ...current,
      todayItems: [reminder, ...current.todayItems],
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
    setDashboardData((current) => ({
      ...current,
      notes: [note, ...current.notes],
    }));
  }

  return (
    <TempoContext.Provider value={{ dashboardData, comfortView, addReminder, addNote, setComfortView }}>
      <div data-comfort-view={comfortView}>
        {children}
      </div>
    </TempoContext.Provider>
  );
}
