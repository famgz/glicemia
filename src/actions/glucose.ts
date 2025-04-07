'use server';

import { MealType } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

import { getSessionUserIdElseThrow } from '@/actions/auth';
import { COOKIES_TIMEZONE_STRING } from '@/constants/time';
import { db } from '@/lib/prisma';

async function checkOwnershipElseThrow(id: string | undefined) {
  if (!id) return;
  const userId = await getSessionUserIdElseThrow();
  const existingGlucoseLog = await getGlucoseLogById(id);
  if (existingGlucoseLog && existingGlucoseLog.userId !== userId) {
    throw new Error('Invalid user');
  }
}

export async function getGlucoseLogs() {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.glucoseLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });
    return res;
  } catch (e) {
    console.error('Failed to get user glucose logs', e);
    return null;
  }
}

export async function getGlucoseLogById(id: string) {
  try {
    const res = await db.glucoseLog.findUnique({
      where: {
        id,
      },
    });
    return res;
  } catch (e) {
    console.error('Failed to get glucose log by id', e);
    return null;
  }
}

export async function getGlucoseLogsByDateRange(
  dateStart: Date,
  dateEnd: Date
) {
  try {
    const userId = await getSessionUserIdElseThrow();
    const res = await db.glucoseLog.findMany({
      where: {
        userId,
        date: {
          gte: dateStart,
          lte: dateEnd,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    return res;
  } catch (e) {
    console.error('Failed to get glucose logs by date range', e);
    return null;
  }
}

export async function getGlucoseLogsByLocalDay(date: Date) {
  try {
    const userTimezone = (await cookies()).get(COOKIES_TIMEZONE_STRING)?.value;
    if (!userTimezone) {
      throw new Error("Cookies didn't provide timezone");
    }
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date input');
    }
    const zonedDate = toZonedTime(date, userTimezone);
    const dateStart = startOfDay(zonedDate);
    const dateEnd = endOfDay(zonedDate);
    new Date().getTimezoneOffset();
    const res = getGlucoseLogsByDateRange(dateStart, dateEnd);
    return res;
  } catch (e) {
    console.error('Failed to get glucose logs by local day', e);
    return null;
  }
}

export async function upsertGlucoseLog(
  id: string | undefined,
  value: number,
  mealType: MealType,
  date: Date,
  notes: string
) {
  const isEdit = !!id;
  try {
    await checkOwnershipElseThrow(id);
    const userId = await getSessionUserIdElseThrow();
    const res = await db.glucoseLog.upsert({
      where: { userId, id: id || '' },
      update: {
        value,
        mealType,
        date,
        notes,
      },
      create: {
        userId,
        value,
        mealType,
        date,
        notes,
      },
    });
    revalidatePath('/logs');
    return res;
  } catch (e) {
    console.error(
      `Failed to ${isEdit ? 'edit' : 'create'} user glucose log`,
      e
    );
    return null;
  }
}

export async function deleteGlucoseLog(id: string) {
  try {
    await checkOwnershipElseThrow(id);
    const res = await db.glucoseLog.delete({
      where: { id },
    });
    revalidatePath('/logs');
    return res;
  } catch (e) {
    console.error('Failed to delete glucose log:', e);
    return null;
  }
}
