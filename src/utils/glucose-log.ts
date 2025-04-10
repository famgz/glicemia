import { GlucoseLog, MealType } from '@prisma/client';
import { subDays } from 'date-fns';

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

const MIN_DAYS_RANGE = 7;

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
  const entries = Array.from(dateMap.values());
  entries.sort((a, b) => a.date.localeCompare(b.date));
  if (!fillDayGaps) {
    return entries;
  }
  const filledEntries: GlucoseLogEntry[] = [];
  let firstDate = new Date(entries[0].date);
  const lastDate = new Date(entries[entries.length - 1].date);
  const minFirstDate = subDays(lastDate, MIN_DAYS_RANGE - 1)
  firstDate = firstDate < minFirstDate ? firstDate : minFirstDate
  let currentIndex = 0;
  for (
    let currentDay = new Date(firstDate);
    currentDay <= lastDate;
    currentDay.setDate(currentDay.getDate() + 1)
  ) {
    const currentDayKey = formatDate(currentDay, dateFormatOption, timeZone);
    if (entries[currentIndex].date === currentDayKey) {
      filledEntries.push(entries[currentIndex]);
      currentIndex++;
    } else {
      filledEntries.push({ date: currentDayKey });
    }
  }
  return filledEntries;
}

export function isGlucoseLogAboveMax(glucoseLog: GlucoseLog) {
  const glucoseLogMapItem = glucoseLogMap[glucoseLog.mealType];
  return glucoseLog.value > glucoseLogMapItem.maxValue;
}
