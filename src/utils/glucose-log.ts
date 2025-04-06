import { GlucoseLog, MealType } from '@prisma/client';

import { glucoseLogMap } from '@/constants/glucose-log';
import { DEFAULT_TIMEZONE } from '@/constants/time';
import { GlucoseLogByDay } from '@/types/glucose-log';
import { DateFormatOption, formatDate } from '@/utils/time';

export function groupGlucoseLogsByDay(
  glucoseLogs: GlucoseLog[],
  timeZone?: string,
  dateFormatOption?: DateFormatOption
) {
  const glucoseLogsSortedByDay = Object.groupBy(glucoseLogs, (x) =>
    formatDate(x.date, dateFormatOption || 'short-date', timeZone)
  ) as GlucoseLogByDay;
  Object.values(glucoseLogsSortedByDay).forEach((logs) =>
    logs.sort((a, b) => a.date.getTime() - b.date.getTime())
  );
  return glucoseLogsSortedByDay;
}

type GlucoseLogEntry = { date: string } & Partial<Record<MealType, number>>;

export function groupGlucoseLogsByDayAndMealType(
  glucoseLogs: GlucoseLog[],
  timeZone: string = DEFAULT_TIMEZONE,
  dateFormatOption: DateFormatOption = 'full-date-inverted',
  fillDayGaps: boolean = true,
  dateOrderDir: 'asc' | 'desc' = 'asc'
): GlucoseLogEntry[] {
  const dateMap = new Map<
    string,
    { entry: GlucoseLogEntry; originalDate: Date }
  >();
  for (const log of glucoseLogs) {
    const dateKey = formatDate(log.date, dateFormatOption, timeZone);
    const existing = dateMap.get(dateKey) || {
      entry: { date: dateKey },
      originalDate: log.date,
    };
    existing.entry[log.mealType] = log.value;
    dateMap.set(dateKey, existing);
  }
  const result = Array.from(dateMap.values());
  result.sort((a, b) =>
    dateOrderDir === 'asc'
      ? a.originalDate.getTime() - b.originalDate.getTime()
      : b.originalDate.getTime() - a.originalDate.getTime()
  );
  let entries = result.map((item) => item.entry);
  if (fillDayGaps && entries.length > 0) {
    const filledEntries: GlucoseLogEntry[] = [];
    const firstDate = result[0].originalDate;
    const lastDate = result[result.length - 1].originalDate;
    let currentIndex = 0;
    for (
      let currentDay = new Date(firstDate);
      currentDay <= lastDate;
      currentDay.setDate(currentDay.getDate() + 1)
    ) {
      const currentDayKey = formatDate(currentDay, dateFormatOption, timeZone);
      if (
        currentIndex < entries.length &&
        entries[currentIndex].date === currentDayKey
      ) {
        filledEntries.push(entries[currentIndex]);
        currentIndex++;
      } else {
        filledEntries.push({ date: currentDayKey });
      }
    }
    entries = filledEntries;
  }
  return entries;
}

export function isGlucoseLogAboveMax(glucoseLog: GlucoseLog) {
  const glucoseLogMapItem = glucoseLogMap[glucoseLog.mealType];
  return glucoseLog.value > glucoseLogMapItem.maxValue;
}
