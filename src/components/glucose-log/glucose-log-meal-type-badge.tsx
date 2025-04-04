import { GlucoseLog } from '@prisma/client';

import { glucoseLogMap } from '@/constants/glucose-log';
import { cn } from '@/lib/utils';

interface Props {
  glucoseLog: GlucoseLog;
  className?: string;
}

export default function GlucoseLogMealTypeBadge({
  glucoseLog,
  className,
}: Props) {
  const glucoseLogMapItem = glucoseLogMap[glucoseLog.mealType];
  return (
    <div
      className={cn(
        'bg-primary/10 text-primary h-fit w-fit flex-none rounded-full px-2 py-1 text-xs font-semibold whitespace-nowrap',
        className
      )}
    >
      {glucoseLogMapItem.label}
    </div>
  );
}
