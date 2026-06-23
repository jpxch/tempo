export default function FollowUpsLoading() {
  return (
    <section className="space-y-6 comfort:space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="h-9 w-44 rounded-2xl bg-white/10 comfort:h-11" />
          <div className="mt-2 h-5 w-64 rounded-xl bg-white/5 comfort:h-6" />
        </div>
        <div className="h-11 w-36 rounded-full border border-white/10 bg-white/5 comfort:h-12" />
      </div>

      <div className="space-y-3 comfort:space-y-4">
        {[0, 1, 2].map((item) => (
          <div
            key={item}
            className="rounded-3xl border border-white/10 bg-white/4 p-5 comfort:p-6"
          >
            <div className="h-4 w-32 rounded-xl bg-white/10" />
            <div className="mt-3 h-5 w-56 rounded-xl bg-white/10" />
            <div className="mt-2 h-4 w-72 max-w-full rounded-xl bg-white/5" />
          </div>
        ))}
      </div>
    </section>
  );
}
