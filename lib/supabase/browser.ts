// Browser-only Supabase client singleton.
// Import only from Client Components — never from Server Components or Server Actions.

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let browserClient: ReturnType<typeof createClient<Database>> | null = null;

export function getBrowserClient() {
  if (browserClient) return browserClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing Supabase environment variables. ' +
        'Copy .env.example to .env.local and fill in ' +
        'NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.',
    );
  }

  browserClient = createClient<Database>(url, key);
  return browserClient;
}
