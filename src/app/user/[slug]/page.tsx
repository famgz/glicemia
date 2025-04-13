'use server';

import { ChartColumnDecreasingIcon, TableOfContentsIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getUserBySlugWithGlucoseLogs } from '@/actions/user';
import { SocialShareButton } from '@/components/buttons/social-share';
import GlucoseLogsCharts from '@/components/glucose-log/charts';
import GlucoseLogTable from '@/components/glucose-log/table';
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
        <SocialShareButton url={`https://glicemia.vercel.app/user/${slug}`} />
      </div>

      <div className="flex items-center justify-end gap-2">
        <Button asChild variant={mode === 'table' ? 'default' : 'outline'}>
          <Link
            href={`/user/${slug}?mode=table`}
            className="flex items-center gap-2"
          >
            <span className="max-[250px]:hidden">Tabela</span>
            <TableOfContentsIcon />
          </Link>
        </Button>
        <Button asChild variant={mode === 'chart' ? 'default' : 'outline'}>
          <Link
            href={`/user/${slug}?mode=chart`}
            className="flex items-center gap-2"
          >
            <span className="max-[250px]:hidden">Gráfico</span>
            <ChartColumnDecreasingIcon />
          </Link>
        </Button>
      </div>
      {glucoseLogs?.length > 0 ? (
        <div>
          {mode === 'table' && <GlucoseLogTable glucoseLogs={glucoseLogs} />}
          {mode === 'chart' && <GlucoseLogsCharts glucoseLogs={glucoseLogs} />}
        </div>
      ) : (
        <p className="text-muted-foreground py-20 text-center">
          Nenhuma medição encontrada
        </p>
      )}
    </div>
  );
}
