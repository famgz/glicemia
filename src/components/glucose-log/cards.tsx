'use server';

import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';
import { cookies } from 'next/headers';

import GlucoseLogCard from '@/components/glucose-log/card';
import GlucoseLogDetailsDialog from '@/components/glucose-log/details-dialog';
import { COOKIES_TIMEZONE_STRING } from '@/constants/time';
import { groupGlucoseLogsByDay } from '@/utils/glucose-log';
import { formatDate, getWeekDayFromShortDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default async function GlucoseLogCards({ glucoseLogs }: Props) {
  const timeZone = (await cookies()).get(COOKIES_TIMEZONE_STRING)?.value;
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || [], timeZone);
  const today = formatDate(new Date(), 'full-date', timeZone);
  const yesterday = formatDate(subDays(new Date(), 1), 'full-date', timeZone);

  if (glucoseLogs.length === 0) {
    return <p className="text-muted-foreground">Nenhuma medição encontrada</p>;
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(glucoseLogsByDay).map(([day, logs]) => (
        <div key={day} className="space-y-2">
          <h2 className="font-bold">
            {(day === today && 'Hoje') || (day === yesterday && 'Ontem') || day}
            <span>
              {', '}
              {getWeekDayFromShortDate(day)}
            </span>
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {logs.map((log) => (
              <GlucoseLogDetailsDialog key={log.id} glucoseLog={log}>
                <GlucoseLogCard glucoseLog={log} />
              </GlucoseLogDetailsDialog>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
