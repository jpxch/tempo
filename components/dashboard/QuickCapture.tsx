'use client';

import { useRef, useState } from 'react';

import type { Project } from '@/types/dashboard';

type CaptureType = 'reminder' | 'note';

type QuickCaptureProps = {
  projects: Project[];
  saving: boolean;
  onAddReminder: (input: { title: string; projectId: string }) => Promise<void>;
  onAddNote: (input: { text: string; projectId: string }) => Promise<void>;
};

export function QuickCapture({ projects, saving, onAddReminder, onAddNote }: QuickCaptureProps) {
  const [captureType, setCaptureType] = useState<CaptureType>('reminder');
  const [text, setText] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    const trimmedText = text.trim();

    if (!trimmedText) {
      setMessage(`Enter a ${captureType} first.`);
      setMessageType('error');
      textAreaRef.current?.focus();
      return;
    }

    if (!projectId) {
      setMessage('Choose a project first.');
      setMessageType('error');
      return;
    }

    try {
      if (captureType === 'reminder') {
        await onAddReminder({ title: trimmedText, projectId });
        setMessage('Reminder saved.');
      } else {
        await onAddNote({ text: trimmedText, projectId });
        setMessage('Note saved.');
      }
      setMessageType('success');
      setText('');
    } catch {
      setMessage('Could not save. Check your connection and try again.');
      setMessageType('error');
      // text is intentionally preserved so nothing is lost on failure
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <h2 className="text-2xl font-semibold comfort:text-3xl">Catch a Beat</h2>

      <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
        Save a reminder or note before it slips.
      </p>

      <form className="mt-4 space-y-4 comfort:mt-6 comfort:space-y-5" onSubmit={handleSubmit}>
        <fieldset>
          <legend className="sr-only">Capture type</legend>
          <div className="grid grid-cols-2 rounded-2xl border border-white/10 bg-neutral-950 p-1 comfort:p-1.5">
            {(['reminder', 'note'] as const).map((type) => {
              const isActive = captureType === type;

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => {
                    setCaptureType(type);
                    setMessage('');
                    textAreaRef.current?.focus();
                  }}
                  className={`min-h-11 rounded-xl px-4 py-2 text-sm font-medium capitalize transition comfort:min-h-12 comfort:px-5 comfort:py-3 comfort:text-base ${
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
            ref={textAreaRef}
            id="quick-capture-text"
            value={text}
            onChange={(event) => {
              setText(event.target.value);
              setMessage('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
            aria-describedby="quick-capture-message"
            className="min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950 p-4 text-sm outline-none comfort:min-h-36 comfort:p-5 comfort:text-base placeholder:text-neutral-600 focus:border-violet-300"
            placeholder={
              captureType === 'reminder'
                ? 'Example: call Sarah about rehearsal changes...'
                : 'Example: try an alternate ending for the opening sequence...'
            }
          />
        </div>

        <div>
          <label
            className="mb-2 block text-xs font-medium uppercase tracking-wider text-neutral-500 comfort:text-sm"
            htmlFor="quick-capture-project"
          >
            Project
          </label>
          <select
            id="quick-capture-project"
            value={projectId}
            onChange={(event) => setProjectId(event.target.value)}
            className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-sm text-neutral-200 outline-none comfort:min-h-14 comfort:px-5 comfort:text-base focus:border-violet-300"
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
          disabled={saving}
          className="min-h-11 w-full cursor-pointer rounded-2xl bg-violet-400 px-4 py-3 font-medium text-neutral-950 transition comfort:min-h-14 comfort:px-5 comfort:text-lg hover:bg-violet-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving…' : `Add ${captureType}`}
        </button>

        <p
          id="quick-capture-message"
          className={`min-h-5 text-sm comfort:min-h-6 comfort:text-base ${
            messageType === 'error' ? 'text-amber-300' : 'text-emerald-300'
          }`}
          role="status"
          aria-live="polite"
        >
          {message}
        </p>
      </form>
    </div>
  );
}
