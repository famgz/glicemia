'use server';

import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';
import { cookies } from 'next/headers';

import GlucoseLogMealTypeBadge from '@/components/glucose-log/meal-type-badge';
import { GlucoseLogNotesPopover } from '@/components/glucose-log/notes-popover';
import GlucoseLogValue from '@/components/glucose-log/value';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { COOKIES_TIMEZONE_STRING } from '@/constants/time';
import { cn } from '@/lib/utils';
import {
  groupGlucoseLogsByDay,
  isGlucoseLogAboveMax,
} from '@/utils/glucose-log';
import { formatDate, getWeekDayFromShortDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default async function GlucoseLogTable({ glucoseLogs }: Props) {
  const timeZone = (await cookies()).get(COOKIES_TIMEZONE_STRING)?.value;
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || [], timeZone);
  const today = formatDate(new Date(), 'full-date', timeZone);
  const yesterday = formatDate(subDays(new Date(), 1), 'full-date', timeZone);

  if (glucoseLogs.length === 0) {
    return (
      <p className="text-muted-foreground py-20">Nenhuma medição encontrada</p>
    );
  }

  return (
    <div className="mt-5 space-y-5">
      {Object.entries(glucoseLogsByDay).map(([day, logs]) => (
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
                const isAboveMax = isGlucoseLogAboveMax(log);
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
                      <GlucoseLogMealTypeBadge glucoseLog={log} />
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
                          glucoseLog={log}
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
    </div>
  );
}
