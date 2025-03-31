import { GlucoseLog } from '@prisma/client';

import { glucoseLogMap } from '@/constants/glucose-log';
import { cn } from '@/lib/utils';

interface Props {
  glucoseLog: GlucoseLog;
  className?: string;
}

export default function GlucoseLogValue({ glucoseLog, className }: Props) {
  const glucoseLogMapItem = glucoseLogMap[glucoseLog.mealType];
  const isAboveMax = glucoseLog.value > glucoseLogMapItem.maxValue;

  return (
    <div
      className={cn('text-primary/80 relative w-fit', {
        'text-destructive/70': isAboveMax,
      })}
    >
      <span className={cn('text-5xl font-bold', className)}>
        {glucoseLog.value}
      </span>
      <span className="absolute right-0 bottom-1 translate-x-[100%] text-[10px]">
        mg/dL
      </span>
    </div>
  );
}
