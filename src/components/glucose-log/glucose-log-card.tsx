'use client';

import { GlucoseLog } from '@prisma/client';
import { AlignLeftIcon } from 'lucide-react';

import GlucoseLogDate from '@/components/glucose-log/glucose-log-date';
import GlucoseLogMealTypeBadge from '@/components/glucose-log/glucose-log-meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log/glucose-log-value';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogCard({ glucoseLog }: Props) {
  return (
    <Card className="hover:bg-muted-foreground/5 w-full min-w-[220px] gap-3 py-4">
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
          <AlignLeftIcon className="text-muted-foreground" />
        )}
      </CardContent>
    </Card>
  );
}
