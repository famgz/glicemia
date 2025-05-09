'use client';

import { Pie, PieChart } from 'recharts';

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  glucoseLogs: {
    label: 'glucoseLogs',
  },
  below: {
    label: 'Abaixo',
    color: 'hsl(var(--primary))',
  },
  above: {
    label: 'Acima',
    color: 'hsl(var(--destructive))',
  },
} satisfies ChartConfig;

interface Props {
  below: number;
  above: number;
}

export function GlucoseLogPieChart({ below, above }: Props) {
  const chartData = [
    { situation: 'below', glucoseLogs: below, fill: 'var(--primary)' },
    { situation: 'above', glucoseLogs: above, fill: 'var(--destructive)' },
  ];

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="glucoseLogs"
          nameKey="situation"
          innerRadius={60}
        />
      </PieChart>
    </ChartContainer>
  );
}
