'use client';

import { createContext, useContext, useState } from 'react';

import { deleteReminder, insertReminder, insertNote } from '@/lib/supabase/mutations';
import type { DashboardData } from '@/types/dashboard';

type TempoContextValue = {
  dashboardData: DashboardData;
  comfortView: boolean;
  saving: boolean;
  addReminder: (input: { title: string; projectId: string }) => Promise<void>;
  addNote: (input: { text: string; projectId: string }) => Promise<void>;
  completeReminder: (id: string) => Promise<void>;
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

type TempoProviderProps = {
  children: React.ReactNode;
  initialData: DashboardData;
};

export function TempoProvider({ children, initialData }: TempoProviderProps) {
  const [dashboardData, setDashboardData] = useState<DashboardData>(initialData);
  const [prevInitialData, setPrevInitialData] = useState<DashboardData>(initialData);
  const [comfortView, setComfortView] = useState(true);
  const [saving, setSaving] = useState(false);

  // Sync dashboard state when the root layout re-fetches after router.refresh().
  // This React "adjusting state during render" pattern avoids an extra render
  // cycle vs. useEffect and does not retrigger the effect-lint rule.
  if (prevInitialData !== initialData) {
    setPrevInitialData(initialData);
    setDashboardData(initialData);
  }

  async function addReminder(input: { title: string; projectId: string }) {
    if (saving) return;
    setSaving(true);
    try {
      const reminder = await insertReminder(input);
      setDashboardData((current) => ({
        ...current,
        todayItems: [reminder, ...current.todayItems],
      }));
    } finally {
      setSaving(false);
    }
  }

  async function addNote(input: { text: string; projectId: string }) {
    if (saving) return;
    setSaving(true);
    try {
      const note = await insertNote(input);
      setDashboardData((current) => ({
        ...current,
        notes: [note, ...current.notes],
      }));
    } finally {
      setSaving(false);
    }
  }

  async function completeReminder(id: string) {
    if (saving) return;
    setSaving(true);
    try {
      await deleteReminder(id);
      setDashboardData((current) => ({
        ...current,
        todayItems: current.todayItems.filter((item) => item.id !== id),
      }));
    } finally {
      setSaving(false);
    }
  }

  return (
    <TempoContext.Provider
      value={{
        dashboardData,
        comfortView,
        saving,
        addReminder,
        addNote,
        completeReminder,
        setComfortView,
      }}
    >
      <div data-comfort-view={comfortView}>{children}</div>
    </TempoContext.Provider>
  );
}
