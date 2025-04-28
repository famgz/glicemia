import { MealType } from '@prisma/client';

import { cn } from '@/lib/utils';
import { isGlucoseLogAboveMax } from '@/utils/glucose-log';

interface Props {
  mealType: MealType;
  value: number;
  className?: string;
  showSuffix?: boolean;
}

export default function GlucoseLogValue({
  mealType,
  value,
  className,
  showSuffix = true,
}: Props) {
  const isAboveMax = isGlucoseLogAboveMax(mealType, value);

  return (
    <div
      className={cn('text-primary/80 relative w-fit', {
        'text-destructive/70': isAboveMax,
      })}
    >
      <span className={cn('text-4xl font-bold', className)}>{value}</span>
      {showSuffix && (
        <span className="absolute right-0 bottom-1 translate-x-[100%] text-[10px]">
          mg/dL
        </span>
      )}
    </div>
  );
}
