'use client';

import { GlucoseLog, MealType } from '@prisma/client';
import { subMonths } from 'date-fns';
import { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { glucoseLogMap } from '@/constants/glucose-log';
import { cn } from '@/lib/utils';
import { groupGlucoseLogsByDayAndMealType } from '@/utils/glucose-log';
import { formatDate } from '@/utils/time';

const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const description = 'Gráficos de medições';

const MONTH_RANGES = [1, 2, 3, 6];

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogsCharts({ glucoseLogs }: Props) {
  const [monthRange, setMonthRange] = useState(3);
  const croppedGlucoseLogs = useMemo(() => {
    const newestDate = glucoseLogs[0].date;
    const lastDate = subMonths(newestDate, monthRange);
    const res = glucoseLogs.filter(
      (x) => x.date.getTime() >= lastDate.getTime()
    );
    return res;
  }, [glucoseLogs, monthRange]);

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
    <div className="space-y-5">
      <div className="flex justify-end">
        <Select
          value={String(monthRange)}
          onValueChange={(value) => setMonthRange(Number(value))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Meses" />
          </SelectTrigger>
          <SelectContent>
            {MONTH_RANGES.map((months, i) => (
              <SelectItem value={String(months)} key={i}>
                {`${months} ${months > 1 ? 'meses' : 'mês'}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card className="gap-0 p-0">
        <CardHeader className="flex flex-col items-stretch gap-0 space-y-0 border-b !p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 sm:border-r sm:py-6">
            <CardTitle>Gráfico de Medições</CardTitle>
            <CardDescription>
              {`Mostrando ${monthRange > 1 ? 'últimos' : 'último'} ${monthRange} ${monthRange > 1 ? 'meses' : 'mês'}`}
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
            className="aspect-auto h-[300px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                // top: 40,
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <ReferenceLine
                y={glucoseLogMap[activeChart as MealType].maxValue}
                stroke="var(--destructive)"
                strokeDasharray="6 6"
                className="opacity-60"
                ifOverflow="visible"
                isFront={true}
                label={{
                  position: 'left',
                  value: glucoseLogMap[activeChart as MealType].maxValue,
                  fill: 'var(--destructive)',
                  fontSize: 12,
                  strokeDashoffset: 20,
                }}
              />
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
              <YAxis
                domain={[
                  (dataMin: number) => Math.max(0, dataMin * 0.05),
                  (dataMax: number) =>
                    Math.max(
                      glucoseLogMap[activeChart as MealType].maxValue * 1.1,
                      dataMax * 1.1
                    ),
                ]}
                tickLine={false}
                tick={{ fontSize: 0 }}
                axisLine={false}
                width={12}
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
              <Bar
                dataKey={activeChart}
                radius={chartData.length <= 30 ? 4 : 0}
              >
                {chartData.map((entry, index) => {
                  const value = entry[activeChart as keyof typeof entry];
                  const maxValue =
                    glucoseLogMap[activeChart as MealType].maxValue;
                  return (
                    <Cell
                      key={`cell-${index}`}
                      className={cn('fill-primary opacity-60', {
                        'fill-sky-600': Number(value) > maxValue,
                      })}
                    />
                  );
                })}
                <LabelList
                  position="top"
                  offset={8}
                  className={cn('fill-foreground', {
                    hidden: chartData.length > 60,
                  })}
                  fontSize={chartData.length <= 33 ? 12 : 10}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
