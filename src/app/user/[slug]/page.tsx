'use server';

import { ChartColumnDecreasingIcon, TableOfContentsIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getUserBySlugWithGlucoseLogs } from '@/actions/user';
import GlucoseLogTable from '@/components/glucose-log/glucose-log-table';
import GlucoseLogsCharts from '@/components/glucose-log/glucose-logs-charts';
import { Button } from '@/components/ui/button';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode: 'table' | 'chart' }>;
}

export default async function UserPage({ params, searchParams }: Props) {
  const slug = (await params).slug;
  const mode = (await searchParams).mode || 'table';
  const user = await getUserBySlugWithGlucoseLogs(slug);
  const glucoseLogs = user?.glucoseLogs;

  if (!glucoseLogs) {
    return notFound();
  }

  return (
    <div className="container space-y-6">
      <div className="flex items-start justify-between gap-5">
        <h1 className="text-lg">
          Histórico de medições de{' '}
          <span className="font-semibold capitalize">
            {user.name?.split(' ')[0]}
          </span>
        </h1>
        <div className="flex items-center justify-end gap-2">
          <Button asChild variant={mode === 'table' ? 'default' : 'outline'}>
            <Link
              href={`/user/${slug}?mode=table`}
              className="flex items-center gap-2"
            >
              <span className="max-sm:hidden">Tabela</span>
              <TableOfContentsIcon />
            </Link>
          </Button>
          <Button asChild variant={mode === 'chart' ? 'default' : 'outline'}>
            <Link
              href={`/user/${slug}?mode=chart`}
              className="flex items-center gap-2"
            >
              <span className="max-sm:hidden">Gráfico</span>
              <ChartColumnDecreasingIcon />
            </Link>
          </Button>
        </div>
      </div>
      <div>
        {mode === 'table' && <GlucoseLogTable glucoseLogs={glucoseLogs} />}
        {mode === 'chart' && <GlucoseLogsCharts glucoseLogs={glucoseLogs} />}
      </div>
    </div>
  );
}
