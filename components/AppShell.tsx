import Link from 'next/link';
import { NavLinks } from '@/components/NavLinks';

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-6">
        <nav className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-white/10 bg-white/3 px-5 py-4">
          <Link href="/dashboard" className="text-xl font-semibold">
            Tempo
          </Link>

          <NavLinks />
        </nav>

        {children}
      </div>
    </main>
  );
}
