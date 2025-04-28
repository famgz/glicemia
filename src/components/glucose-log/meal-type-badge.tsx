import { MealType } from '@prisma/client';

import { glucoseLogMap } from '@/constants/glucose-log';
import { cn } from '@/lib/utils';

interface Props {
  mealType: MealType;
  className?: string;
}

export default function GlucoseLogMealTypeBadge({
  mealType,
  className,
}: Props) {
  const glucoseLogMapItem = glucoseLogMap[mealType];
  return (
    <div
      className={cn(
        'bg-primary/10 text-primary h-fit w-fit flex-none rounded-full px-2 py-1 text-center text-xs font-semibold whitespace-nowrap',
        className
      )}
    >
      {glucoseLogMapItem.label}
    </div>
  );
}
