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
  Object.values(glucoseLogsSortedByDay).forEach((logs) => {
    logs.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });
  });
  return glucoseLogsSortedByDay;
}

type GlucoseLogEntry = { date: string } & Partial<Record<MealType, number>>;

export function groupGlucoseLogsByDayAndMealType({
  glucoseLogs,
  timeZone = DEFAULT_TIMEZONE,
  fillDayGaps = true,
}: {
  glucoseLogs: GlucoseLog[];
  timeZone: string;
  fillDayGaps: boolean;
}): GlucoseLogEntry[] {
  const dateFormatOption = 'full-date-inverted';
  const dateMap = new Map<string, GlucoseLogEntry>();
  for (const log of glucoseLogs) {
    const dateKey = formatDate(log.date, dateFormatOption, timeZone);
    const existing = dateMap.get(dateKey) || {
      date: dateKey,
    };
    existing[log.mealType] = log.value;
    dateMap.set(dateKey, existing);
  }
  let result = Array.from(dateMap.values());
  result.sort((a, b) => a.date.localeCompare(b.date));
  if (fillDayGaps && result.length > 1) {
    const filledEntries: GlucoseLogEntry[] = [];
    const firstDate = new Date(result[0].date);
    const lastDate = new Date(result[result.length - 1].date);
    let currentIndex = 0;
    for (
      let currentDay = new Date(firstDate);
      currentDay <= lastDate;
      currentDay.setDate(currentDay.getDate() + 1)
    ) {
      const currentDayKey = formatDate(currentDay, dateFormatOption, timeZone);
      if (result[currentIndex].date === currentDayKey) {
        filledEntries.push(result[currentIndex]);
        currentIndex++;
      } else {
        filledEntries.push({ date: currentDayKey });
      }
    }
    result = filledEntries;
  }
  return result;
}

export function isGlucoseLogAboveMax(glucoseLog: GlucoseLog) {
  const glucoseLogMapItem = glucoseLogMap[glucoseLog.mealType];
  return glucoseLog.value > glucoseLogMapItem.maxValue;
}
