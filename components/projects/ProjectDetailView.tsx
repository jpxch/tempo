import Link from 'next/link';
import type { DashboardData, Project } from '@/types/dashboard';

type ProjectDetailViewProps = {
  project: Project;
  data: DashboardData;
};

export function ProjectDetailView({ project, data }: ProjectDetailViewProps) {
  const todayItems = data.todayItems.filter((item) => item.projectId === project.id);
  const followUps = data.followUps.filter((item) => item.projectId === project.id);
  const weekItems = data.weekItems.filter((item) => item.projectId === project.id);
  const notes = data.notes.filter((note) => note.projectId === project.id);

  return (
    <div className="space-y-6 comfort:space-y-8">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-neutral-100"
      >
        ← Back to dashboard
      </Link>

      {/* Project header */}
      <div
        className="rounded-3xl border bg-white/4 p-6 comfort:p-8"
        style={{ borderColor: project.color, borderWidth: '1px' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h1
              className="text-3xl font-semibold comfort:text-4xl"
              style={{ color: project.color }}
            >
              {project.name}
            </h1>
          </div>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 comfort:px-4 comfort:py-2 comfort:text-sm">
            {project.status}
          </span>
        </div>

        {project.next && (
          <p className="mt-3 text-sm text-neutral-400 comfort:mt-4 comfort:text-base">
            {project.next}
          </p>
        )}
      </div>

      {/* Four sections */}
      <div className="grid gap-6 comfort:gap-8 lg:grid-cols-2">
        {/* Opening Count */}
        <Section
          title="Opening Count"
          description="What needs your attention today."
          color={project.color}
          empty={todayItems.length === 0}
          emptyText="Nothing due today for this project."
        >
          {todayItems.map((item) => (
            <article
              key={item.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
              style={{ borderLeft: `4px solid ${project.color}` }}
            >
              <p className="text-sm comfort:text-base" style={{ color: project.color }}>
                {item.time} · {item.type}
              </p>
              <h3 className="mt-1 text-lg font-medium comfort:text-xl">{item.title}</h3>
              <p className="mt-1 text-sm text-neutral-400 comfort:text-base">{item.detail}</p>
            </article>
          ))}
        </Section>

        {/* Cue List */}
        <Section
          title="Cue List"
          description="People waiting on you or you're waiting on."
          color={project.color}
          empty={followUps.length === 0}
          emptyText="No open follow-ups for this project."
        >
          {followUps.map((followUp) => (
            <article
              key={`${followUp.projectId}-${followUp.person}`}
              className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
              style={{ borderLeft: `4px solid ${project.color}` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium comfort:text-xl">{followUp.person}</h3>
                  <p className="mt-1 text-sm text-neutral-400 comfort:text-base">
                    {followUp.reason}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 comfort:px-4 comfort:py-2 comfort:text-sm">
                  {followUp.dueLabel}
                </span>
              </div>
            </article>
          ))}
        </Section>

        {/* Weekly Rhythm */}
        <Section
          title="Weekly Rhythm"
          description="Upcoming items for this project."
          color={project.color}
          empty={weekItems.length === 0}
          emptyText="Nothing coming up this week."
        >
          {weekItems.map((item) => (
            <article
              key={item.title}
              className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
              style={{ borderLeft: `4px solid ${project.color}` }}
            >
              <h3 className="font-medium comfort:text-xl">{item.title}</h3>
              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300 comfort:px-4 comfort:py-2 comfort:text-sm">
                {item.dueLabel}
              </span>
            </article>
          ))}
        </Section>

        {/* Creative Memory */}
        <Section
          title="Creative Memory"
          description="Notes connected to this project."
          color={project.color}
          empty={notes.length === 0}
          emptyText="No notes captured yet."
        >
          {notes.map((note) => (
            <article
              key={note.id}
              className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 comfort:p-6"
              style={{ borderLeft: `4px solid ${project.color}` }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-medium text-neutral-100 comfort:text-xl">{note.title}</h3>
                  <p className="mt-1 text-sm text-neutral-400 comfort:text-base">{note.preview}</p>
                </div>
                <span className="shrink-0 text-xs text-neutral-500 comfort:text-sm">
                  {note.updatedLabel}
                </span>
              </div>
            </article>
          ))}
        </Section>
      </div>
    </div>
  );
}

type SectionProps = {
  title: string;
  description: string;
  color: string;
  empty: boolean;
  emptyText: string;
  children: React.ReactNode;
};

function Section({ title, description, color, empty, emptyText, children }: SectionProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 comfort:p-8">
      <h2
        className="text-2xl font-semibold comfort:text-3xl"
        style={{ color }}
      >
        {title}
      </h2>
      <p className="text-sm text-neutral-400 comfort:text-base">{description}</p>

      <div className="mt-4 space-y-4 comfort:mt-6 comfort:space-y-5">
        {empty ? (
          <p className="text-sm text-neutral-500 comfort:text-base">{emptyText}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
