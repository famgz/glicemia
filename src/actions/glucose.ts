'use server';

import { MealType } from '@prisma/client';
import { revalidatePath } from 'next/cache';

import { getSessionUserIdElseThrow } from '@/actions/auth';
import { db } from '@/lib/prisma';

export async function getGlucoseLogs() {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.glucoseLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res;
  } catch (e) {
    console.error('Failed to get user glucose logs', e);
    return null;
  }
}

export async function createGlucoseLogs(
  value: number,
  mealType: MealType,
  notes: string
) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.glucoseLog.create({
      data: {
        userId,
        value,
        mealType,
        notes,
      },
    });
    revalidatePath('/logs');
    return res;
  } catch (e) {
    console.error('Failed to create user glucose log', e);
    return null;
  }
}
