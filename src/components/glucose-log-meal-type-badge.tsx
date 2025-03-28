import { GlucoseLog } from '@prisma/client';

import { glucoseLogMap } from '@/constants/glucose-log';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogMealTypeBadge({ glucoseLog }: Props) {
  const glucoseLogMapItem = glucoseLogMap[glucoseLog.mealType];
  return (
    <div className="bg-primary/20 text-primary w-fit rounded-full px-2 py-1 text-xs">
      {glucoseLogMapItem.label}
    </div>
  );
}
