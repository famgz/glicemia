'use server';

import { cookies } from 'next/headers';

import { COOKIES_TIMEZONE_STRING } from '@/constants/time';

const dayInSeconds = 60 * 60 * 24;

export async function setClientTimezone(timeZone: string) {
  (await cookies()).set(COOKIES_TIMEZONE_STRING, timeZone, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: dayInSeconds * 7,
  });
}
