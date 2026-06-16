import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export default async function proxy(request: NextRequest) {
  // Build a response that can be mutated with Set-Cookie headers.
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        // setAll writes refreshed auth cookies back to both the incoming
        // request (so downstream server code sees them) and the outgoing
        // response (so the browser gets the updated token).
        // The `headers` arg carries Cache-Control values that prevent CDNs
        // from caching responses that carry Set-Cookie.
        setAll(cookiesToSet, headers) {
          // Request cookies only accept name + value (no options).
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value),
          );
        },
      },
    },
  );

  // getUser() validates the JWT against the Supabase auth server on every
  // request. Do not use getSession() here — it reads cookies without server
  // verification and can be spoofed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Allow auth routes and Next.js internals through unconditionally.
  const isAuthRoute = pathname === '/login';
  const isNextInternal =
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/.test(pathname);

  if (isNextInternal) {
    return supabaseResponse;
  }

  // Unauthenticated users can only reach auth routes.
  if (!user && !isAuthRoute) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/login';
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated users are bounced away from the login page.
  if (user && pathname === '/login') {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/dashboard';
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
