type NotesPanelProps = {
  notes: string[];
};

export function NotesPanel({ notes }: NotesPanelProps) {
  return (
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
  );
}
