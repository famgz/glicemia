'use server';

import { redirect } from 'next/navigation';

import { auth, signIn, signOut } from '@/auth';
import { SessionUser } from '@/types/auth';

export async function login(formData: FormData) {
  const redirectTo = formData.get('redirect');
  const opts = { redirectTo: (redirectTo || '/user') as string };
  await signIn('google', opts);
}

export async function logout() {
  await signOut();
}

export async function getSessionUserElseRedirectToLogin(): Promise<SessionUser> {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return redirect('/login');
  }
  return user;
}

export async function getSessionUserIdElseThrow(): Promise<string> {
  const session = await auth();
  const userId = session?.user.id;
  if (!userId) {
    throw new Error('Not authenticated');
  }
  return userId;
}
