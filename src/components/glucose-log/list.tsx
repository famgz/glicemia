'use client';

import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';
import { useMemo, useState } from 'react';

import GlucoseLogMealTypeBadge from '@/components/glucose-log/meal-type-badge';
import { GlucoseLogNotesPopover } from '@/components/glucose-log/notes-popover';
import GlucoseLogValue from '@/components/glucose-log/value';
import InfiniteLoadingTrigger from '@/components/infinite-loading-trigger';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  groupGlucoseLogsByDay,
  isGlucoseLogAboveMax,
} from '@/utils/glucose-log';
import { formatDate, getWeekDayFromShortDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

const INITIAL_ITEMS_PER_LOAD = 10;

export default function GlucoseLogList({ glucoseLogs }: Props) {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || [], timeZone);
  const today = formatDate(new Date(), 'full-date', timeZone);
  const yesterday = formatDate(subDays(new Date(), 1), 'full-date', timeZone);
  const [offset, setOffset] = useState(INITIAL_ITEMS_PER_LOAD);

  const croppedItems = useMemo(
    () => glucoseLogsByDay.slice(0, offset),
    [glucoseLogsByDay, offset]
  );

  return (
    <div className="mt-5 space-y-5">
      {croppedItems.map(([day, logs]) => (
        <div key={day}>
          <p className="text-background from-muted-foreground/50 to-muted-foreground/0 w-full rounded-sm bg-linear-to-r px-3 py-1 text-sm font-semibold">
            {(day === today && 'Hoje') || (day === yesterday && 'Ontem') || day}
            {', '}
            <span>{getWeekDayFromShortDate(day)}</span>
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-15 text-center sm:w-30">Hora</TableHead>
                <TableHead className="w-32 text-center">Tipo</TableHead>
                <TableHead className="text-center">Notas</TableHead>
                <TableHead className="w-24 text-center sm:w-30">
                  Valor
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => {
                const isAboveMax = isGlucoseLogAboveMax(
                  log.mealType,
                  log.value
                );
                return (
                  <TableRow
                    key={log.id}
                    className={cn({
                      'from-destructive/5 via-destructive/0 to-destructive/0 bg-linear-to-l':
                        isAboveMax,
                    })}
                  >
                    <TableCell align="center" className="text-sm">
                      {formatDate(log.date, 'hour-minute', timeZone)}
                    </TableCell>
                    <TableCell align="center">
                      <GlucoseLogMealTypeBadge mealType={log.mealType} />
                    </TableCell>
                    <TableCell
                      align="center"
                      className="text-muted-foreground max-w-15"
                    >
                      <GlucoseLogNotesPopover notes={log.notes} />
                    </TableCell>
                    <TableCell align="center">
                      <div className="pr-8">
                        <GlucoseLogValue
                          mealType={log.mealType}
                          value={log.value}
                          className="text-base"
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
      <InfiniteLoadingTrigger
        totalSize={glucoseLogsByDay.length}
        offset={offset}
        onChangeOffset={setOffset}
        perLoad={5}
      />
    </div>
  );
}
