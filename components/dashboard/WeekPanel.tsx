type WeekPanelProps = {
  items: string[];
};

export function WeekPanel({ items }: WeekPanelProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
      <h2 className="text-2xl font-semibold">This Week</h2>

      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item} className="rounded-2xl bg-neutral-900/80 p-4 text-sm text-neutral-300">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
