'use server';

import { ChartColumnDecreasingIcon, TableOfContentsIcon } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getUserBySlugWithGlucoseLogs } from '@/actions/user';
import { auth } from '@/auth';
import { SocialShareButton } from '@/components/buttons/social-share';
import GlucoseLogsCharts from '@/components/glucose-log/charts';
import GlucoseLogTable from '@/components/glucose-log/table';
import { Button } from '@/components/ui/button';

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode: 'table' | 'chart' }>;
}

export default async function UserPage({ params, searchParams }: Props) {
  const loggedInUser = (await auth())?.user;
  const slug = (await params).slug;
  const mode = (await searchParams).mode || 'table';
  const dbUser = await getUserBySlugWithGlucoseLogs(slug);
  const glucoseLogs = dbUser?.glucoseLogs;

  if (!glucoseLogs) {
    return notFound();
  }

  return (
    <div className="container space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
        <h1 className="text-lg">
          Histórico de medições de{' '}
          <span className="font-semibold capitalize">
            {dbUser.name?.split(' ')[0]}
          </span>
        </h1>
        <div className="flex flex-1 justify-end">
          <SocialShareButton url={`https://glicemia.vercel.app/user/${slug}`} />
        </div>
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
        <div className="text-muted-foreground flex flex-col items-center gap-10 py-20 text-center">
          <span>Nenhuma registro encontrado.</span>
          {loggedInUser?.slug === slug && (
            <div>
              Faça sua primeira
              <Button asChild className="w-fit px-1 text-base" variant={'link'}>
                <Link href={'/logs'}>Medição</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
