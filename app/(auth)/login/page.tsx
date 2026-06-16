import { login } from './actions';

const ERROR_MESSAGES: Record<string, string> = {
  invalid: 'Incorrect email or password.',
  missing: 'Please enter your email and password.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Something went wrong.') : null;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Tempo</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-neutral-400">Your personal operations assistant.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
        {errorMessage && (
          <p
            role="alert"
            className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300"
          >
            {errorMessage}
          </p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-violet-300"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-violet-300"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="min-h-11 w-full rounded-2xl bg-violet-400 px-4 py-3 font-medium text-neutral-950 transition hover:bg-violet-300"
          >
            Sign in
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-neutral-600">
        Single-user access only. Contact your admin if you need an account.
      </p>
    </div>
  );
}
