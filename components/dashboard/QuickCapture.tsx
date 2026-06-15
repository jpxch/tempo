'use client';

import { useState } from 'react';

import type { Project } from '@/types/dashboard';

type QuickCaptureProps = {
  projects: Project[];
  onCapture: (input: { title: string; projectId: string }) => void;
};

export function QuickCapture({ projects, onCapture }: QuickCaptureProps) {
  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [confirmation, setConfirmation] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle || !projectId) {
      return;
    }

    onCapture({ title: trimmedTitle, projectId });
    setTitle('');
    setConfirmation('Added to Today.');
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
      <h2 className="text-2xl font-semibold">Quick Capture</h2>

      <p className="mt-1 text-sm text-neutral-400">
        Add a reminder before it slips away.
      </p>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="sr-only" htmlFor="quick-capture-reminder">
            Reminder
          </label>
          <textarea
            id="quick-capture-reminder"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setConfirmation('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950 p-4 text-sm outline-none placeholder:text-neutral-600 focus:border-violet-300"
            placeholder="Example: call Sarah about rehearsal changes..."
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
          disabled={!title.trim() || !projectId}
          className="w-full rounded-2xl bg-violet-400 px-4 py-3 font-medium text-neutral-950 transition hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add reminder
        </button>

        <p className="min-h-5 text-sm text-emerald-300" aria-live="polite">
          {confirmation}
        </p>
      </form>
    </div>
  );
}
