'use client';

import { useState } from 'react';

import type { Project } from '@/types/dashboard';

type CaptureType = 'reminder' | 'note';

type QuickCaptureProps = {
  projects: Project[];
  onAddReminder: (input: { title: string; projectId: string }) => void;
  onAddNote: (input: { text: string; projectId: string }) => void;
};

export function QuickCapture({ projects, onAddReminder, onAddNote }: QuickCaptureProps) {
  const [captureType, setCaptureType] = useState<CaptureType>('reminder');
  const [text, setText] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [confirmation, setConfirmation] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!trimmedText || !projectId) {
      return;
    }

    if (captureType === 'reminder') {
      onAddReminder({ title: trimmedText, projectId });
      setConfirmation('Reminder added to Today.');
    } else {
      onAddNote({ text: trimmedText, projectId });
      setConfirmation('Note added to Recent Creative Notes.');
    }

    setText('');
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
      <h2 className="text-2xl font-semibold">Quick Capture</h2>

      <p className="mt-1 text-sm text-neutral-400">
        Add something before it slips away.
      </p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="sr-only">Capture type</legend>
          <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-neutral-950 p-1">
            {(['reminder', 'note'] as const).map((type) => {
              const isActive = captureType === type;

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setCaptureType(type);
                    setConfirmation('');
                  }}
                  className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
                    isActive
                      ? 'bg-violet-400 text-neutral-950'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label className="sr-only" htmlFor="quick-capture-text">
            {captureType === 'reminder' ? 'Reminder' : 'Note'}
          </label>
          <textarea
            id="quick-capture-text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setConfirmation('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950 p-4 text-sm outline-none placeholder:text-neutral-600 focus:border-violet-300"
            placeholder={
              captureType === 'reminder'
                ? 'Example: call Sarah about rehearsal changes...'
                : 'Example: try an alternate ending for the opening sequence...'
            }
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500" htmlFor="quick-capture-project">
            Project
          </label>
          <select
            id="quick-capture-project"
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 outline-none focus:border-violet-300"
          >
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={!text.trim() || !projectId}
          className="w-full rounded-2xl bg-violet-400 px-4 py-3 font-medium text-neutral-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add {captureType}
        </button>

        <p className="min-h-5 text-sm text-emerald-300" aria-live="polite">
          {confirmation}
        </p>
      </form>
    </div>
  );
}
