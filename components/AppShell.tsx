import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ComfortToggle } from '@/components/ComfortToggle';
import { NavLinks } from '@/components/NavLinks';
import { createClient } from '@/lib/supabase/server';

async function logout() {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
        <nav className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-white/3 px-4 py-3 md:mb-6 md:gap-4 md:px-5 md:py-4">
          <Link href="/dashboard" className="text-xl font-semibold">
            Tempo
          </Link>

          <div className="flex flex-wrap items-center gap-2">
            <NavLinks />
            <ComfortToggle />
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:border-white/20 hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>

        {children}
      </div>
    </main>
  );
}
