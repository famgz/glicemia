import { MealType } from '@prisma/client';
import { InfoIcon } from 'lucide-react';

import GlucoseLogMealTypeBadge from '@/components/glucose-log/meal-type-badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { glucoseLogMap } from '@/constants/glucose-log';

export function MealTypesLimitsInfo() {
  return (
    <Popover>
      <PopoverTrigger>
        <InfoIcon className="text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-fit space-y-4">
        <h3 className="font-semibold">Valores limites de referência</h3>
        <div className="space-y-2">
          {Object.entries(glucoseLogMap).map(([mealType, { maxValue }]) => (
            <div
              key={mealType}
              className="text-muted-foreground flex items-end gap-2"
            >
              <GlucoseLogMealTypeBadge mealType={mealType as MealType} />
              <span>{' ≤ '}</span>
              <span className="font-semibold">
                {maxValue}
                <span className="m-0.5 text-[10px] font-light">mg/dL</span>
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
