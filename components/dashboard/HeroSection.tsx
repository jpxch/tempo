'use client';

import { useEffect, useState } from 'react';

const PHRASES = [
  'The body remembers what the mind forgets.',
  'One more time from the top.',
  'Mark it first, then commit.',
  'The transition is the dance.',
  'Energy through the fingertips.',
  'Find the pocket.',
  'Eight counts at a time.',
  'The stillness is just as important.',
  'Clean lines, clear intention.',
  'Suspension before the fall.',
  'The rehearsal is the performance.',
  'Breathe into the phrase.',
  'Make the space yours.',
  'From the inside out.',
  'Hit it and hold.',
  'Find your center, then leave it.',
  'Dynamics make the difference.',
  'The stage has memory too.',
  'Articulate every joint.',
  'Sharpen the edges.',
  'The preparation is everything.',
  'Move from the core.',
  'Land softly, exit clean.',
  'Contrast is the vocabulary.',
  'Let the phrase breathe.',
  'Every entrance is a choice.',
  'Commit to the shape.',
  'The space between counts matters.',
  'Weight shift, then go.',
  'Keep the focus alive.',
  'The body is the instrument.',
  'Mark the moments that matter.',
  'Texture over speed.',
  'Find the music within the music.',
  'Simplicity takes the most skill.',
  'The audience feels what you feel.',
  'Your intention arrives before you do.',
  'Press into the floor to rise.',
  'Control the release.',
  'The underscore carries the weight.',
  'Give the moment room.',
  'Know where your eyes go.',
  'The last note is still part of the piece.',
  'Begin as if it were opening night.',
  'Let the weight drop, then recover.',
  'The floor is your partner.',
  'Stay in your body.',
  'Where are you in the space?',
  'Let the music lead.',
  'The count is a suggestion — the feeling is the truth.',
] as const;

type GreetingInfo = {
  greeting: string;
  city: string | null;
  phrase: string;
};

function computeGreeting(): Pick<GreetingInfo, 'greeting' | 'city' | 'phrase'> {
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
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  return { greeting, city, phrase };
}

export function HeroSection() {
  const [info, setInfo] = useState<GreetingInfo>({
    greeting: 'Good morning',
    city: null,
    phrase: PHRASES[0],
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setInfo(computeGreeting());
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const { greeting, city, phrase } = info;

  return (
    <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/3 p-6 shadow-2xl comfort:gap-6 comfort:p-8 md:flex-row md:items-center">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300 comfort:text-base">
          Tempo
        </p>

        <h1 className="mt-3 text-4xl font-semibold tracking-tight comfort:text-5xl md:text-6xl comfort:md:text-7xl">
          {greeting}
          {city && <span className="text-neutral-400"> from {city}</span>}
          {', '}Ray.
        </h1>

        <p className="mt-3 max-w-2xl text-neutral-400 comfort:text-lg comfort:leading-relaxed">
          {phrase}
        </p>
      </div>

      <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 px-5 py-4 comfort:p-6">
        <p className="text-sm text-violet-200 comfort:text-base">Focus Brief</p>
        <p className="mt-1 text-2xl font-semibold comfort:text-3xl">3 priorities today</p>
      </div>
    </header>
  );
}
