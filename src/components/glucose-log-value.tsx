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
    <span
      className={cn('text-primary w-fit text-3xl font-semibold', {
        'text-destructive': isAboveMax,
      })}
    >
      {glucoseLog.value}
    </span>
  );
}
