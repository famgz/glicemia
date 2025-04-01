'use server';

import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';
import { AlignLeftIcon } from 'lucide-react';
import { cookies } from 'next/headers';

import GlucoseLogMealTypeBadge from '@/components/glucose-log/glucose-log-meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log/glucose-log-value';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { COOKIES_TIMEZONE_STRING } from '@/constants/time';
import { groupGlucoseLogsByDay } from '@/utils/glucose-log';
import { formatDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default async function GlucoseLogTable({ glucoseLogs }: Props) {
  const timeZone = (await cookies()).get(COOKIES_TIMEZONE_STRING)?.value;
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || [], timeZone);
  const today = formatDate(new Date(), 'short-date', timeZone);
  const yesterday = formatDate(subDays(new Date(), 1), 'short-date', timeZone);

  if (glucoseLogs.length === 0) {
    return (
      <p className="text-muted-foreground py-20">Nenhuma medição encontrada</p>
    );
  }

  return (
    <div className="mt-5 space-y-4">
      {Object.entries(glucoseLogsByDay).map(([day, logs]) => (
        <div key={day}>
          <p className="text-background from-muted-foreground/50 to-muted-foreground/0 w-full rounded-sm bg-linear-to-r px-3 py-0.5 text-sm font-semibold">
            {(day === today && 'Hoje') || (day === yesterday && 'Ontem') || day}
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24 text-center">Hora</TableHead>
                <TableHead className="w-32 text-center">Tipo</TableHead>
                <TableHead className="text-center">Notas</TableHead>
                <TableHead className="w-24 text-center">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell align="center" className="text-sm">
                    {formatDate(log.date, 'hour-minute', timeZone)}
                  </TableCell>
                  <TableCell align="center">
                    <GlucoseLogMealTypeBadge glucoseLog={log} />
                  </TableCell>
                  <TableCell align="center" className="max-w-[200px]">
                    <div className="flex-center text-muted-foreground">
                      {log.notes ? (
                        <>
                          <Popover>
                            <PopoverTrigger>
                              <AlignLeftIcon className="mobile-only size-4" />
                            </PopoverTrigger>
                            <PopoverContent className="text-muted-foreground text-sm break-words">
                              {log.notes}
                            </PopoverContent>
                          </Popover>
                          <p className="desktop-only truncate text-xs">
                            {log.notes}
                          </p>
                        </>
                      ) : (
                        <span className="desktop-only">-</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <div className="pr-8">
                      <GlucoseLogValue glucoseLog={log} className="text-base" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
