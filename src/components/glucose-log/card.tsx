'use client';

import { GlucoseLog } from '@prisma/client';
import { AlignLeftIcon } from 'lucide-react';

import GlucoseLogDate from '@/components/glucose-log/date';
import GlucoseLogMealTypeBadge from '@/components/glucose-log/meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log/value';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { isGlucoseLogAboveMax } from '@/utils/glucose-log';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogCard({ glucoseLog }: Props) {
  const isAboveMax = isGlucoseLogAboveMax(glucoseLog);

  return (
    <Card
      className={cn(
        'hover:bg-muted-foreground/5 w-full min-w-[220px] gap-3 py-4',
        {
          'from-destructive/6 hover:bg-destructive/4 via-destructive/6 to-destructive/2 bg-gradient-to-r':
            isAboveMax,
        }
      )}
    >
      <CardHeader className="px-4">
        <CardTitle>
          <div className="flex items-start justify-between">
            <GlucoseLogDate glucoseLog={glucoseLog} />
            <GlucoseLogMealTypeBadge glucoseLog={glucoseLog} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-end justify-between px-4">
        <GlucoseLogValue glucoseLog={glucoseLog} />
        {glucoseLog.notes && (
          <AlignLeftIcon className="text-muted-foreground/70" />
        )}
      </CardContent>
    </Card>
  );
}
