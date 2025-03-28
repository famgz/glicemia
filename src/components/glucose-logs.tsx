import { GlucoseLog } from '@prisma/client';
import { ScrollArea } from '@radix-ui/react-scroll-area';

import GlucoseLogCard from '@/components/glucose-log-card';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogs({ glucoseLogs }: Props) {
  return !glucoseLogs.length ? (
    <p className="text-muted-foreground">Nenhuma medição encontrada</p>
  ) : (
    <ScrollArea className="h-10 flex-auto">
      <div className="space-y-3">
        {glucoseLogs.map((glucoseLog) => (
          <GlucoseLogCard glucoseLog={glucoseLog} key={glucoseLog.id} />
        ))}
      </div>
    </ScrollArea>
  );
}
