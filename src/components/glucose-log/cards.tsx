'use client';

import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';
import { useMemo, useState } from 'react';

import GlucoseLogCard from '@/components/glucose-log/card';
import GlucoseLogDetailsDialog from '@/components/glucose-log/details-dialog';
import InfiniteLoadingTrigger from '@/components/infinite-loading-trigger';
import { groupGlucoseLogsByDay } from '@/utils/glucose-log';
import { formatDate, getWeekDayFromShortDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

const INITIAL_ITEMS_PER_LOAD = 5;
const ITEMS_PER_LOAD = 5;

export default function GlucoseLogCards({ glucoseLogs }: Props) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || [], timeZone);
  const today = formatDate(new Date(), 'full-date', timeZone);
  const yesterday = formatDate(subDays(new Date(), 1), 'full-date', timeZone);
  const [offset, setOffset] = useState(INITIAL_ITEMS_PER_LOAD);

  const croppedItems = useMemo(
    () => glucoseLogsByDay.slice(0, offset),
    [glucoseLogsByDay, offset]
  );

  if (glucoseLogs.length === 0) {
    return <p className="text-muted-foreground">Nenhuma medição encontrada</p>;
  }

  return (
    <div className="mt-6 space-y-8">
      {croppedItems.map(([day, logs]) => (
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
      <InfiniteLoadingTrigger
        offset={offset}
        onChangeOffset={setOffset}
        totalSize={glucoseLogsByDay.length}
        perLoad={ITEMS_PER_LOAD}
      />
    </div>
  );
}
