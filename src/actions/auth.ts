'use server';

import { redirect } from 'next/navigation';

import { auth, signIn, signOut } from '@/auth';
import { db } from '@/lib/prisma';
import { SessionUser } from '@/types/auth';
import { formatSlug } from '@/utils/slug';

export async function generateSlugFromUsername(username: string) {
  const baseSlug = formatSlug(username);
  let slug = baseSlug;
  let counter = 1;
  while (await db.user.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

export async function login(formData: FormData) {
  const redirectTo = formData.get('redirect');
  const opts = { redirectTo: (redirectTo || '/logs') as string };
  await signIn('google', opts);
}

export async function logout() {
  await signOut();
}

export async function getSessionUser() {
  const session = await auth();
  const user = session?.user;
  return user;
}

export async function getSessionUserElseRedirectToLogin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) {
    return redirect('/login');
  }
  return user;
}

export async function getSessionUserIdElseThrow(): Promise<string> {
  const user = await getSessionUser();
  const userId = user?.id;
  if (!userId) {
    throw new Error('Not authenticated');
  }
  return userId;
}
