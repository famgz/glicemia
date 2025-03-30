'use server';

import { redirect } from 'next/navigation';
import slugify from 'slugify';

import { auth, signIn, signOut } from '@/auth';
import { db } from '@/lib/prisma';
import { SessionUser } from '@/types/auth';

export async function generateSlugFromUsername(username: string) {
  const baseSlug = slugify(username, { lower: true, trim: true })
    .replace(/[^a-zA-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
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
