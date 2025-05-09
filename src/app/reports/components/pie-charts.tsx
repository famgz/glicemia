'use client';

import { GlucoseLog, MealType } from '@prisma/client';

import { GlucoseLogPieChart } from '@/components/pie-chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  glucoseLogMap,
  MAX_LOGS_ABOVE_MAX_RATIO,
} from '@/constants/glucose-log';
import { cn } from '@/lib/utils';
import { isGlucoseLogAboveMax } from '@/utils/glucose-log';

interface Props {
  totals: Partial<Record<MealType | 'TOTAL', GlucoseLog[]>>;
}

export default function PieCharts({ totals }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Object.entries(totals).map(([key, logs]) => {
        const total = logs.length;
        const above = logs.reduce(
          (acc, log) =>
            isGlucoseLogAboveMax(log.mealType, log.value) ? acc + 1 : acc,
          0
        );
        const below = total - above;
        const ratio = above / total;
        return (
          <Card key={key} className="flex max-w-[600px] flex-1 flex-col gap-0">
            <CardHeader>
              <CardTitle className="text-center text-xl">
                {key === 'TOTAL'
                  ? 'Total'
                  : glucoseLogMap[key as MealType].label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-0">
              <div className="min-w-[180px]">
                <GlucoseLogPieChart below={below} above={above} />
              </div>
              <div className="flex flex-1 items-center justify-between gap-4">
                <div className="wfit flex flex-col text-sm">
                  <span className="whitespace-nowrap">
                    Total: <span className="font-semibold">{total}</span>
                  </span>
                  <span className="whitespace-nowrap">
                    Acima: <span className="font-semibold">{above}</span>
                  </span>
                </div>
                <span
                  className={cn('text-primary text-3xl font-bold', {
                    'text-destructive': ratio >= MAX_LOGS_ABOVE_MAX_RATIO,
                  })}
                >
                  {Math.round(ratio * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
