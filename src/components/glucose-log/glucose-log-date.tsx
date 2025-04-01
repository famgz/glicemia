'use client';

import { GlucoseLog } from '@prisma/client';

import { formatDate } from '@/utils/time';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogDate({ glucoseLog }: Props) {
  return (
    <div className="text-muted-foreground flex flex-col text-start">
      <span className="text-lg font-bold">
        {formatDate(glucoseLog.date, 'hour-minute')}
      </span>
      <span className="text-xs font-semibold opacity-60">
        {formatDate(glucoseLog.date, 'full-date')}
      </span>
    </div>
  );
}
