import { GlucoseLog } from '@prisma/client';

import { cn } from '@/lib/utils';
import { isGlucoseLogAboveMax } from '@/utils/glucose-log';

interface Props {
  glucoseLog: GlucoseLog;
  className?: string;
}

export default function GlucoseLogValue({ glucoseLog, className }: Props) {
  const isAboveMax = isGlucoseLogAboveMax(glucoseLog);

  return (
    <div
      className={cn('text-primary/80 relative w-fit', {
        'text-destructive/70': isAboveMax,
      })}
    >
      <span className={cn('text-4xl font-bold', className)}>
        {glucoseLog.value}
      </span>
      <span className="absolute right-0 bottom-1 translate-x-[100%] text-[10px]">
        mg/dL
      </span>
    </div>
  );
}
