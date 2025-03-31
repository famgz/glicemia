import { GlucoseLog } from '@prisma/client';

import { GlucoseLogByDay } from '@/types/glucose-log';
import { getShortDate } from '@/utils/time';

export function groupGlucoseLogsByDay(glucoseLogs: GlucoseLog[]) {
  const glucoseLogsSortedByDay = Object.groupBy(glucoseLogs, (x) =>
    getShortDate(x.date)
  ) as GlucoseLogByDay;
  Object.values(glucoseLogsSortedByDay).forEach((_glucoseLogs) =>
    _glucoseLogs.sort((a, b) => a.date.getTime() - b.date.getTime())
  );
  return glucoseLogsSortedByDay;
}
