'use client';

import { useState } from 'react';

type GreetingInfo = {
  greeting: string;
  city: string | null;
  ready: boolean;
};

function computeGreeting(): Pick<GreetingInfo, 'greeting' | 'city'> {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const segments = tz.split('/');
  const city =
    segments.length > 1
      ? segments[segments.length - 1].replace(/_/g, ' ')
      : null;
  const hour = new Date().getHours();
  const greeting =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
        ? 'Good afternoon'
        : 'Good evening';
  return { greeting, city };
}

export function HeroSection() {
  const [info, setInfo] = useState<GreetingInfo>({ greeting: 'Good morning', city: null, ready: false });

  // "Adjusting state during render" pattern — runs once on first client render.
  // typeof window check prevents this from running during SSR.
  if (!info.ready && typeof window !== 'undefined') {
    setInfo({ ...computeGreeting(), ready: true });
  }

  const { greeting, city } = info;

  return (
    <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/3 p-6 shadow-2xl comfort:gap-6 comfort:p-8 md:flex-row md:items-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300 comfort:text-base">
          Tempo
        </p>

        {/* suppressHydrationWarning: greeting text intentionally differs between
            server (UTC fallback) and client (user's local timezone). */}
        <h1
          suppressHydrationWarning
          className="mt-3 text-4xl font-semibold tracking-tight comfort:text-5xl md:text-6xl comfort:md:text-7xl"
        >
          {greeting}
          {city && <span className="text-neutral-400"> from {city}</span>}
          {', '}Ray.
        </h1>

        <p className="mt-3 max-w-2xl text-neutral-400 comfort:text-lg comfort:leading-relaxed">
          Here&apos;s what needs your attention today, this week, and across your active creative
          work.
        </p>
      </div>

      <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 px-5 py-4 comfort:p-6">
        <p className="text-sm text-violet-200 comfort:text-base">Focus Brief</p>
        <p className="mt-1 text-2xl font-semibold comfort:text-3xl">3 priorities today</p>
      </div>
    </header>
  );
}
