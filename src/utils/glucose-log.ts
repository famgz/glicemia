import { GlucoseLog } from '@prisma/client';

import { GlucoseLogByDay } from '@/types/glucose-log';
import { formatDate } from '@/utils/time';

export function groupGlucoseLogsByDay(
  glucoseLogs: GlucoseLog[],
  timeZone?: string
) {
  const glucoseLogsSortedByDay = Object.groupBy(glucoseLogs, (x) =>
    formatDate(x.date, 'short-date', timeZone)
  ) as GlucoseLogByDay;
  Object.values(glucoseLogsSortedByDay).forEach((logs) =>
    logs.sort((a, b) => a.date.getTime() - b.date.getTime())
  );
  return glucoseLogsSortedByDay;
}
