const todayItems = [
  {
    time: '9:00 AM',
    title: 'Review rehearsal plan',
    detail: 'Prep notes for today’s choreography session',
    type: 'Prep',
  },
  {
    time: '12:30 PM',
    title: 'Follow up with artist team',
    detail: 'Confirm music cut, room time, and dancers',
    type: 'Follow-up',
  },
  {
    time: '4:00 PM',
    title: 'Creative check-in',
    detail: 'Review concept notes and update project direction',
    type: 'Meeting',
  },
];

const weekItems = [
  'Showcase rehearsal on Thursday',
  'Payment follow-up due Friday',
  'New artist concept review this weekend',
];

const projects = [
  {
    name: 'Artist Choreo Package',
    status: 'Active',
    next: 'Needs music notes cleaned up',
  },
  {
    name: 'Live Show Prep',
    status: 'Upcoming',
    next: 'Confirm dancers and rehearsal space',
  },
  {
    name: 'Workshop Series',
    status: 'Waiting',
    next: 'Waiting on client approval',
  },
];

const notes = [
  'Bridge section needs stronger transition.',
  'Try formation change after second chorus.',
  'Ask about lighting cues before final rehearsal.',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-6 text-neutral-100">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Tempo</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
              Good morning, Ray.
            </h1>
            <p className="mt-3 max-w-2xl text-neutral-400">
              Here’s what needs your attention today, this week, and across your active creative
              work.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-400/30 bg-violet-400/10 px-5 py-4">
            <p className="text-sm text-violet-200">Focus Brief</p>
            <p className="mt-1 text-2xl font-semibold">3 priorities today</p>
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold">Today</h2>
                <p className="text-sm text-neutral-400">Your day at a glance.</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-300">
                On track
              </span>
            </div>

            <div className="space-y-4">
              {todayItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-violet-300">
                        {item.time} · {item.type}
                      </p>
                      <h3 className="mt-1 text-lg font-medium">{item.title}</h3>
                      <p className="mt-1 text-sm text-neutral-400">{item.detail}</p>
                    </div>
                    <button className="rounded-full border border-white/10 px-4 py-2 text-sm text-neutral-300 transition hover:border-violet-300 hover:text-white">
                      Mark done
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-semibold">This Week</h2>
              <div className="mt-4 space-y-3">
                {weekItems.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl bg-neutral-900/80 p-4 text-sm text-neutral-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
              <h2 className="text-2xl font-semibold">Quick Capture</h2>
              <p className="mt-1 text-sm text-neutral-400">
                Drop a reminder, idea, or follow-up before it disappears.
              </p>
              <textarea
                className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950 p-4 text-sm outline-none ring-0 placeholder:text-neutral-600 focus:border-violet-300"
                placeholder="Example: remind me to follow up about rehearsal space..."
              />
              <button className="mt-4 w-full rounded-2xl bg-violet-400 px-4 py-3 font-medium text-neutral-950 transition hover:bg-violet-300">
                Capture
              </button>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-semibold">Active Projects</h2>
            <div className="mt-4 space-y-4">
              {projects.map((project) => (
                <article
                  key={project.name}
                  className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="mt-1 text-sm text-neutral-400">{project.next}</p>
                    </div>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-neutral-300">
                      {project.status}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <h2 className="text-2xl font-semibold">Recent Creative Notes</h2>
            <div className="mt-4 space-y-4">
              {notes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl border border-white/10 bg-neutral-900/80 p-4 text-sm text-neutral-300"
                >
                  {note}
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
