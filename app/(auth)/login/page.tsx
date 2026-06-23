import Link from 'next/link';

import { login, signup } from './actions';

const ERROR_MESSAGES: Record<string, string> = {
  invalid: 'Incorrect email or password.',
  missing: 'Please enter your email and password.',
  'password-short': 'Use a password with at least 8 characters.',
  'password-match': 'Passwords do not match.',
  signup: 'Could not create that account. Try again or sign in.',
};

const INFO_MESSAGES: Record<string, string> = {
  'check-email': 'Check your email to confirm your account, then sign in.',
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; mode?: string }>;
}) {
  const { error, message, mode } = await searchParams;
  const isSignup = mode === 'signup';
  const errorMessage = error ? (ERROR_MESSAGES[error] ?? 'Something went wrong.') : null;
  const infoMessage = message ? (INFO_MESSAGES[message] ?? null) : null;

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-violet-300">Tempo</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          {isSignup ? 'Create account' : 'Sign in'}
        </h1>
        <p className="mt-2 text-sm text-neutral-400">
          {isSignup
            ? 'Start a private Tempo workspace for your own data.'
            : 'Your personal operations assistant.'}
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/4 p-6">
        {infoMessage && (
          <p
            role="status"
            className="mb-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-300"
          >
            {infoMessage}
          </p>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="mb-4 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-300"
          >
            {errorMessage}
          </p>
        )}

        <form action={isSignup ? signup : login} className="space-y-4">
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
              autoComplete={isSignup ? 'new-password' : 'current-password'}
              minLength={isSignup ? 8 : undefined}
              required
              className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-violet-300"
              placeholder="••••••••"
            />
          </div>

          {isSignup && (
            <div>
              <label
                htmlFor="confirm-password"
                className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500"
              >
                Confirm password
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
                className="min-h-11 w-full rounded-2xl border border-white/10 bg-neutral-950 px-4 py-2 text-sm text-neutral-200 outline-none placeholder:text-neutral-600 focus:border-violet-300"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            className="min-h-11 w-full rounded-2xl bg-violet-400 px-4 py-3 font-medium text-neutral-950 transition hover:bg-violet-300"
          >
            {isSignup ? 'Create account' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-neutral-600">
        {isSignup ? 'Already have an account?' : 'Need a separate QA account?'}{' '}
        <Link
          href={isSignup ? '/login' : '/login?mode=signup'}
          className="text-violet-300 hover:underline"
        >
          {isSignup ? 'Sign in' : 'Create one'}
        </Link>
      </p>
    </div>
  );
}
