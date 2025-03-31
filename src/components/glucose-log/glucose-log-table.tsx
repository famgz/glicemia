import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';
import { AlignLeftIcon } from 'lucide-react';

import GlucoseLogMealTypeBadge from '@/components/glucose-log/glucose-log-meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log/glucose-log-value';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { groupGlucoseLogsByDay } from '@/utils/glucose-log';
import { getHourMinute, getShortDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogTable({ glucoseLogs }: Props) {
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || []);
  const today = getShortDate(new Date());
  const yesterday = getShortDate(subDays(new Date(), 1));

  if (glucoseLogs.length === 0) {
    return (
      <p className="text-muted-foreground py-20">Nenhuma medição encontrada</p>
    );
  }

  return (
    <div className="mt-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-20">Dia</TableHead>
            <TableHead className="text-center">Hora</TableHead>
            <TableHead className="text-center">Tipo</TableHead>
            <TableHead className="text-center">Notas</TableHead>
            <TableHead className="text-center">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(glucoseLogsByDay).map(([day, logs]) =>
            logs.map((log, index) => (
              <TableRow key={log.id}>
                {index === 0 && (
                  <TableCell rowSpan={logs.length} className="font-semibold">
                    <p className="text-sm">
                      {(day === today && 'Hoje') ||
                        (day === yesterday && 'Ontem') ||
                        day}
                    </p>
                  </TableCell>
                )}
                <TableCell align="center" className="text-sm">
                  {getHourMinute(log.date)}
                </TableCell>
                <TableCell align="center">
                  <GlucoseLogMealTypeBadge glucoseLog={log} />
                </TableCell>
                <TableCell align="center">
                  <AlignLeftIcon className="text-muted-foreground mobile-only size-4" />
                  <p className="desktop-only text-muted-foreground max-w-[200px] truncate text-xs">
                    {log.notes}
                  </p>
                </TableCell>
                <TableCell align="right">
                  <div className="pr-8">
                    <GlucoseLogValue glucoseLog={log} className="text-lg" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
