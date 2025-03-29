import { GlucoseLog } from '@prisma/client';

import { getDate, getHourMinute } from '@/utils/time';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogDate({ glucoseLog }: Props) {
  return (
    <div className="text-muted-foreground flex flex-col text-start">
      <span className="text-lg font-bold">
        {getHourMinute(glucoseLog.date)}
      </span>
      <span className="text-xs font-semibold opacity-60">
        {getDate(glucoseLog.date)}
      </span>
    </div>
  );
}
