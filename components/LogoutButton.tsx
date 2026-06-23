'use client';

import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-neutral-400 transition hover:border-white/20 hover:text-white"
    >
      Sign out
    </button>
  );
}
