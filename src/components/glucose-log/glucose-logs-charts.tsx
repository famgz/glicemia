'use client';

import { GlucoseLog, MealType } from '@prisma/client';
import * as React from 'react';
import { useState } from 'react';
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

const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const description = 'Gráficos de medições';

// const MAX_DAYS_RANGE = 90;

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogsCharts({ glucoseLogs }: Props) {
  const availableMealTypes = Array.from(
    new Set(glucoseLogs.map((x) => x.mealType))
  );
  const mealTypes = Object.keys(glucoseLogMap).filter((key) =>
    availableMealTypes.includes(key as MealType)
  );

  const chartConfig = {
    logs: {
      label: 'Valor',
    },
    ...mealTypes.reduce(
      (acc, key) => ({
        ...acc,
        [key]: {
          label: glucoseLogMap[key as MealType]?.label || 'asd',
          color: 'hsl(var(--primary))',
        },
      }),
      {}
    ),
  } satisfies ChartConfig;

  const [activeChart, setActiveChart] = useState<keyof typeof chartConfig>(
    mealTypes[0] as keyof typeof chartConfig
  );

  const total = React.useMemo(
    () =>
      mealTypes.reduce(
        (acc, key) => ({
          ...acc,
          [key]: glucoseLogs.filter((x) => x.mealType === key).length,
        }),
        {}
      ),
    [glucoseLogs, mealTypes]
  );

  if (!(glucoseLogs && mealTypes)) {
    return <p>Nenhum dados registrado</p>;
  }

  const chartData = groupGlucoseLogsByDayAndMealType(
    glucoseLogs,
    timezone,
    'full-date-inverted',
    true,
    'asc'
  );

  return (
    <Card className="p-0">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Gráfico de Medições</CardTitle>
          <CardDescription>Mostrando últimos 3 meses</CardDescription>
        </div>
        <div className="flex">
          {mealTypes.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total]}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
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
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('pt-BR', {
                  month: 'short',
                  day: 'numeric',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="logs"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('pt-BR', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });
                  }}
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
