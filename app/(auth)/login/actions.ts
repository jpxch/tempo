'use server';

import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    redirect('/login?error=missing');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/login?error=invalid');
  }

  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirm-password') ?? '');

  if (!email || !password || !confirmPassword) {
    redirect('/login?mode=signup&error=missing');
  }

  if (password.length < 8) {
    redirect('/login?mode=signup&error=password-short');
  }

  if (password !== confirmPassword) {
    redirect('/login?mode=signup&error=password-match');
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    redirect('/login?mode=signup&error=signup');
  }

  if (data.session) {
    redirect('/dashboard');
  }

  redirect('/login?message=check-email');
}
