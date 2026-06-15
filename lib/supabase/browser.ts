// Browser-only Supabase client.
// Import only from Client Components — never from Server Components or Server Actions.
// createBrowserClient from @supabase/ssr handles singleton behavior internally.

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Copy .env.example to .env.local and fill in ' +
        'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
  }

  return createBrowserClient<Database>(url, key);
}
