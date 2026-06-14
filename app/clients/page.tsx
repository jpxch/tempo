import { AppShell } from '@/components/AppShell';

export default function ClientsPage() {
  return (
    <AppShell>
      <section className="rounded-3xl border border-white/10 bg-white/4 p-6">
        <h1 className="text-3xl font-semibold">Clients</h1>

        <p className="mt-2 text-neutral-400">Client management for Tempo will live here.</p>
      </section>
    </AppShell>
  );
}
