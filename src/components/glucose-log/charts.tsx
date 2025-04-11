'use client';

import { GlucoseLog, MealType } from '@prisma/client';
import { startOfDay, subDays } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { useEffect, useMemo, useRef, useState } from 'react';
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

const DAYS_RANGES = [7, 15, 30, 60, 90, 180];

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function GlucoseLogsCharts({ glucoseLogs }: Props) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  const [daysRange, setDayRange] = useState(DAYS_RANGES[0]);
  const croppedGlucoseLogs = useMemo(() => {
    const newestLog = glucoseLogs.reduce((newest, curr) =>
      curr.date > newest.date ? curr : newest
    );
    const newestDay = startOfDay(toZonedTime(newestLog.date, timeZone));
    const lastDay = subDays(newestDay, daysRange - 1);
    const res = glucoseLogs.filter(
      (x) => x.date.getTime() >= lastDay.getTime()
    );
    return res;
  }, [glucoseLogs, daysRange]);

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

  const mealTypeMaxValue = useMemo(
    () => glucoseLogMap[activeChart as MealType].maxValue,
    [activeChart]
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

  const estimatedBarWidth = useMemo(() => {
    const gap = 4;
    const numBars = chartData.length || 1;
    const barWidth = (chartWidth - numBars * gap) / numBars;
    return Math.max(barWidth, 0);
  }, [chartWidth, chartData.length]);

  const barRadius = useMemo(() => {
    const reduceFactor = 8;
    const maxRadius = 16;
    let radius = Math.floor(
      Math.max(Math.min(estimatedBarWidth / reduceFactor, maxRadius), 0)
    );
    radius = radius % 2 === 0 ? radius : radius - 1;
    return radius;
  }, [estimatedBarWidth]);

  useEffect(() => {
    if (!chartContainerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setChartWidth(entry.contentRect.width);
        }
      }
    });
    observer.observe(chartContainerRef.current);
    return () => observer.disconnect();
  }, []);

  if (!(croppedGlucoseLogs && mealTypes)) {
    return <p>Nenhum dado registrado</p>;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end gap-2">
        <span className="text-sm font-light">Mostrar últimos</span>
        <Select
          value={String(daysRange)}
          onValueChange={(value) => setDayRange(Number(value))}
        >
          <SelectTrigger className="w-[110px]">
            <SelectValue placeholder="Dias" />
          </SelectTrigger>
          <SelectContent>
            {DAYS_RANGES.map((days, i) => (
              <SelectItem value={String(days)} key={i}>
                {`${days} dias`}
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
              {`Registros dos últimos ${daysRange} dias`}
            </CardDescription>
          </div>
          <div className="flex flex-wrap divide-x">
            {mealTypes.map((key) => {
              const chart = key as keyof typeof chartConfig;
              return (
                <button
                  key={chart}
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted-foreground/10 relative z-30 flex flex-1 flex-col items-center justify-center gap-1 border-t px-2 py-3 text-left max-sm:min-w-20 sm:border-t-0 sm:p-5"
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
            className="aspect-auto h-[300px] w-full lg:h-[400px]"
            ref={chartContainerRef}
          >
            <BarChart
              accessibilityLayer
              width={chartWidth}
              data={chartData}
              margin={{
                top: 24,
                left: 14,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <ReferenceLine
                y={mealTypeMaxValue}
                stroke="var(--destructive)"
                strokeDasharray="8 8"
                className="text-[10px] font-bold opacity-60 sm:text-xs"
                ifOverflow="visible"
                isFront={true}
                label={{
                  position: 'left',
                  value: mealTypeMaxValue,
                  fill: 'var(--destructive)',
                  strokeDashoffset: 20,
                  offset: 8,
                }}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                className="text-xs capitalize max-sm:text-[10px]"
                tickFormatter={(value) =>
                  formatDate(new Date(value), 'day-month')
                }
              />
              <YAxis
                type="number"
                domain={[
                  0,
                  (dataMax: number) => Math.max(dataMax, mealTypeMaxValue + 10),
                ]}
                width={14}
                axisLine={false}
                allowDecimals={false}
                tickLine={false}
                className="text-[10px] sm:text-xs"
              />
              <ChartTooltip
                filterNull={false}
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
              <Bar dataKey={activeChart} fill="var(--primary)">
                {chartData.map((entry, index) => {
                  const value = entry[activeChart as keyof typeof entry];
                  return (
                    <Cell
                      key={`cell-${index}`}
                      radius={barRadius}
                      className={cn('fill-primary opacity-60', {
                        'fill-sky-600': Number(value) > mealTypeMaxValue,
                      })}
                    />
                  );
                })}
                <LabelList
                  position="top"
                  offset={8}
                  className={cn('fill-muted-foreground', {
                    hidden: estimatedBarWidth < 12,
                  })}
                  fontSize={estimatedBarWidth < 80 ? 10 : 12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
