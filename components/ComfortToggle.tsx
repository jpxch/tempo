'use client';

import { useTempo } from '@/components/TempoProvider';

export function ComfortToggle() {
  const { comfortView, setComfortView } = useTempo();

  return (
    <button
      type="button"
      aria-pressed={comfortView}
      onClick={() => setComfortView((current) => !current)}
      className={`inline-flex min-h-11 items-center rounded-full border px-4 py-2 text-sm font-medium transition comfort:min-h-12 comfort:px-5 comfort:text-base ${
        comfortView
          ? 'border-violet-400/40 bg-violet-400/15 text-violet-200'
          : 'border-white/10 bg-white/4 text-neutral-300 hover:border-white/20 hover:text-white'
      }`}
    >
      {comfortView ? 'Larger text: On' : 'Larger text: Off'}
    </button>
  );
}
