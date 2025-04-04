'use server';

import { db } from '@/lib/prisma';

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
