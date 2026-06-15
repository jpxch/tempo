type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/4 p-6">
      <h1 className="text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-neutral-400">{description}</p>
    </section>
  );
}
