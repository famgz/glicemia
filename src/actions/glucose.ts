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
