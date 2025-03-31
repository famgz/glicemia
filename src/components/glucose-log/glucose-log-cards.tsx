import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';

import GlucoseLogCard from '@/components/glucose-log/glucose-log-card';
import GlucoseLogDetailsDialog from '@/components/glucose-log/glucose-log-details-dialog';
import { groupGlucoseLogsByDay } from '@/utils/glucose-log';
import { getShortDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogCards({ glucoseLogs }: Props) {
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || []);
  const today = getShortDate(new Date());
  const yesterday = getShortDate(subDays(new Date(), 1));

  if (glucoseLogs.length === 0) {
    return <p className="text-muted-foreground">Nenhuma medição encontrada</p>;
  }

  return (
    <div className="mt-6 space-y-8">
      {Object.entries(glucoseLogsByDay).map(([day, logs]) => (
        <div key={day} className="space-y-2">
          <h2 className="font-bold">
            {(day === today && 'Hoje') || (day === yesterday && 'Ontem') || day}
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
