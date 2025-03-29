import { GlucoseLog } from '@prisma/client';
import { subDays } from 'date-fns';

import GlucoseLogCard from '@/components/glucose-log/glucose-log-card';
import { groupGlucoseLogsByDay } from '@/utils/glucose-log';
import { getDate } from '@/utils/time';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogs({ glucoseLogs }: Props) {
  const glucoseLogsByDay = groupGlucoseLogsByDay(glucoseLogs || []);
  const today = getDate(new Date());
  const yesterday = getDate(subDays(new Date(), 1));

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
          {logs.map((log) => (
            <GlucoseLogCard glucoseLog={log} key={log.id} />
          ))}
        </div>
      ))}
    </div>
  );
}
