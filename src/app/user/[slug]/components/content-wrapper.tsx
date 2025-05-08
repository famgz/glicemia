'use client';

import { GlucoseLog } from '@prisma/client';
import {
  ChartColumnDecreasingIcon,
  Grid3x3Icon,
  LucideIcon,
  TableOfContentsIcon,
} from 'lucide-react';
import { useState } from 'react';

import GlucoseLogsCharts from '@/components/glucose-log/charts';
import GlucoseLogList from '@/components/glucose-log/list';
import GlucoseLogTable from '@/components/glucose-log/table';
import { Button } from '@/components/ui/button';

type DisplayType = 'list' | 'table' | 'chart';

const displayTypesMap: Record<
  DisplayType,
  { label: string; Icon: LucideIcon }
> = {
  table: { label: 'Tabela', Icon: Grid3x3Icon },
  list: { label: 'Lista', Icon: TableOfContentsIcon },
  chart: { label: 'Gráfico', Icon: ChartColumnDecreasingIcon },
};

const DEFAULT_DISPLAY_MODE = 'table';

interface Props {
  glucoseLogs: GlucoseLog[];
}

export default function ContentWrapper({ glucoseLogs }: Props) {
  const [mode, setMode] = useState(DEFAULT_DISPLAY_MODE);

  return (
    <>
      <div className="flex items-center justify-end gap-2 print:hidden">
        {Object.entries(displayTypesMap).map(([key, { label, Icon }]) => (
          <Button
            key={key}
            variant={mode === key ? 'default' : 'outline'}
            className="flex items-center gap-2"
            onClick={() => setMode(key)}
          >
            <span className="max-[250px]:hidden">{label}</span>
            <Icon />
          </Button>
        ))}
      </div>
      <div>
        {mode === 'table' && <GlucoseLogTable glucoseLogs={glucoseLogs} />}
        {mode === 'list' && <GlucoseLogList glucoseLogs={glucoseLogs} />}
        {mode === 'chart' && <GlucoseLogsCharts glucoseLogs={glucoseLogs} />}
      </div>
    </>
  );
}
