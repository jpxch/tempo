import type { Note, Project } from '@/types/dashboard';

type NotesPanelProps = {
  notes: Note[];
  projects: Project[];
};

export function NotesPanel({ notes, projects }: NotesPanelProps) {
  const getProject = (projectId: string) =>
    projects.find((project) => project.id === projectId);

  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <h2 className="text-2xl font-semibold comfort:text-3xl">Recent Creative Notes</h2>

      <div className="mt-4 space-y-4 comfort:mt-6 comfort:space-y-5">
        {notes.map((note) => {
          const project = getProject(note.projectId);

          return (
            <article
              key={note.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 text-sm text-neutral-300 comfort:p-6 comfort:text-base"
              style={{ borderLeft: `4px solid ${project?.color ?? '#737373'}` }}
            >
              <div className="flex items-start justify-between gap-4 comfort:gap-5">
                <div>
                  <h3 className="font-medium text-neutral-100 comfort:text-xl">{note.title}</h3>
                  <p className="mt-1 text-neutral-400">{note.preview}</p>
                </div>

                <span className="shrink-0 text-xs text-neutral-500 comfort:text-sm">
                  {note.updatedLabel}
                </span>
              </div>

              <p
                className="mt-3 text-xs comfort:mt-4 comfort:text-sm"
                style={{ color: project?.color ?? '#a3a3a3' }}
              >
                {project?.name ?? 'Unassigned project'}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
