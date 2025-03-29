import { GlucoseLog } from '@prisma/client';

import { GlucoseLogByDay } from '@/types/glucose-log';
import { getDate } from '@/utils/time';

export function groupGlucoseLogsByDay(glucoseLogs: GlucoseLog[]) {
  const res = Object.groupBy(glucoseLogs, (x) =>
    getDate(x.date)
  ) as GlucoseLogByDay;
  return res;
}
