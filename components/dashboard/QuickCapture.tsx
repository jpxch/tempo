export function QuickCapture() {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
      <h2 className="text-2xl font-semibold">Quick Capture</h2>

      <p className="mt-1 text-sm text-neutral-400">
        Drop a reminder, idea, or follow-up before it disappears.
      </p>

      <textarea
        className="mt-4 min-h-28 w-full resize-none rounded-2xl border border-white/10 bg-neutral-950 p-4 text-sm outline-none placeholder:text-neutral-600 focus:border-violet-300"
        placeholder="Example: remind me to follow up about rehearsal space..."
      />

      <button className="mt-4 w-full rounded-2xl bg-violet-400 px-4 py-3 font-medium text-neutral-950 transition hover:bg-violet-300">
        Capture
      </button>
    </div>
  );
}
