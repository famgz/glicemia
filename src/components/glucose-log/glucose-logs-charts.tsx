'use client';

import { GlucoseLog, MealType } from '@prisma/client';
import { subDays } from 'date-fns';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { glucoseLogMap } from '@/constants/glucose-log';
import { groupGlucoseLogsByDayAndMealType } from '@/utils/glucose-log';
import { formatDate } from '@/utils/time';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const description = 'Gráficos de medições';

const MAX_DAYS_RANGE = 90;

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogsCharts({ glucoseLogs }: Props) {
  const croppedGlucoseLogs = useMemo(() => {
    const newestDate = glucoseLogs[0].date;
    const lastDate = subDays(newestDate, MAX_DAYS_RANGE);
    const res = glucoseLogs.filter(
      (x) => x.date.getTime() >= lastDate.getTime()
    );
    return res;
  }, [glucoseLogs]);

  const chartData = useMemo(() => {
    const res = groupGlucoseLogsByDayAndMealType({
      glucoseLogs: croppedGlucoseLogs,
      timeZone,
      fillDayGaps: true,
    });
    return res;
  }, [croppedGlucoseLogs]);

  const mealTypes = useMemo(() => {
    const loggedMealTypes = Array.from(
      new Set(croppedGlucoseLogs.map((x) => x.mealType))
    );
    return Object.keys(glucoseLogMap).filter((key) =>
      loggedMealTypes.includes(key as MealType)
    );
  }, [croppedGlucoseLogs]);

  const chartConfig = useMemo(
    () =>
      ({
        logs: {
          label: 'Valor',
        },
        ...mealTypes.reduce(
          (acc, key) => ({
            ...acc,
            [key]: {
              label: glucoseLogMap[key as MealType].label,
              color: 'hsl(var(--primary))',
            },
          }),
          {}
        ),
      }) satisfies ChartConfig,
    [mealTypes]
  );

  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(
    mealTypes[0] as keyof typeof chartConfig
  );

  const total = useMemo(
    () =>
      mealTypes.reduce(
        (acc, key) => ({
          ...acc,
          [key]: croppedGlucoseLogs.filter((x) => x.mealType === key).length,
        }),
        {}
      ),
    [croppedGlucoseLogs, mealTypes]
  );

  if (!(croppedGlucoseLogs && mealTypes)) {
    return <p>Nenhum dado registrado</p>;
  }

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-col items-stretch gap-0 space-y-0 border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:border-r sm:py-6">
          <CardTitle>Gráfico de Medições</CardTitle>
          <CardDescription>
            Mostrando últimos {MAX_DAYS_RANGE} dias
          </CardDescription>
        </div>
        <div className="flex flex-wrap divide-x">
          {mealTypes.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted-foreground/10 relative z-30 flex flex-1 flex-col items-center justify-center gap-1 border-t px-2 py-4 text-left sm:border-t-0 sm:p-5"
                onClick={() => setActiveChart(chart)}
              >
                <div className="flex flex-1 flex-col justify-between gap-2">
                  <span className="text-muted-foreground text-xs">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key as keyof typeof total]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              className="capitalize"
              tickFormatter={(value) =>
                formatDate(new Date(value), 'day-month')
              }
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="logs"
                  labelFormatter={(value) =>
                    formatDate(new Date(value), 'long-date')
                  }
                />
              }
            />
            {/* <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} /> */}
            <Bar dataKey={activeChart} fill={`var(--primary)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
