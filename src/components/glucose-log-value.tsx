import { GlucoseLog } from '@prisma/client';

import { glucoseLogMap } from '@/constants/glucose-log';
import { cn } from '@/lib/utils';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogValue({ glucoseLog }: Props) {
  const glucoseLogMapItem = glucoseLogMap[glucoseLog.mealType];
  const isAboveMax = glucoseLog.value > glucoseLogMapItem.maxValue;

  return (
    <div
      className={cn('text-primary relative w-fit', {
        'text-destructive': isAboveMax,
      })}
    >
      <span className="text-4xl font-bold">{glucoseLog.value}</span>
      <span className="absolute right-0 bottom-1 translate-x-[100%] text-[10px]">
        mg/dL
      </span>
    </div>
  );
}
