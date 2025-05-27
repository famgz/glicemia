'use server';

import { User } from '@prisma/client';

import { getSessionUser, getSessionUserIdElseThrow } from '@/actions/auth';
import { db } from '@/lib/prisma';

export async function getUserBySlug(slug: string) {
  try {
    const res = await db.user.findUnique({
      where: {
        slug,
      },
    });
    return res;
  } catch (e) {
    console.error('Failed to get user by slug', e);
    return null;
  }
}

export async function getLoggedInDBUser() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    return null;
  }
  try {
    const res = await db.user.findUnique({
      where: {
        id: sessionUser.id,
      },
    });
    return res;
  } catch (e) {
    console.error('Failed to get user by id', e);
    return null;
  }
}

export async function getUserBySlugWithGlucoseLogs(slug: string) {
  try {
    const res = await db.user.findUnique({
      where: {
        slug,
      },
      include: { glucoseLogs: { orderBy: { date: 'desc' } } },
    });
    return res;
  } catch (e) {
    console.error('Failed to get user by slug with glucose logs', e);
    return null;
  }
}

export async function isSlugAvailable(slug: string) {
  const existingUser = await getUserBySlug(slug);
  return !existingUser;
}

export async function updateUserSettings({
  slug,
  privateHistory,
}: Pick<User, 'slug' | 'privateHistory'>) {
  try {
    const userId = await getSessionUserIdElseThrow();
    if (!isSlugAvailable(slug)) {
      throw new Error(`Slug unavailable: ${slug}`);
    }
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        slug,
        privateHistory,
      },
    });
    return updatedUser;
  } catch (e) {
    console.error('Failed to update user settings', e);
    return null;
  }
}
