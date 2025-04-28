'use server';

import {
  ChartColumnDecreasingIcon,
  LucideIcon,
  TableOfContentsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getUserBySlugWithGlucoseLogs } from '@/actions/user';
import { auth } from '@/auth';
import { SocialShareButton } from '@/components/buttons/social-share';
import GlucoseLogsCharts from '@/components/glucose-log/charts';
import GlucoseLogList from '@/components/glucose-log/list';
import { Button } from '@/components/ui/button';

type DisplayType = 'list' | 'chart';

const displayTypesMap: Record<
  DisplayType,
  { label: string; Icon: LucideIcon }
> = {
  list: { label: 'Lista', Icon: TableOfContentsIcon },
  chart: { label: 'Gráfico', Icon: ChartColumnDecreasingIcon },
};

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ mode: DisplayType }>;
}

export default async function UserPage({ params, searchParams }: Props) {
  const loggedInUser = (await auth())?.user;
  const slug = (await params).slug;
  const mode = (await searchParams).mode || 'list';
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
        {Object.entries(displayTypesMap).map(([key, { label, Icon }]) => (
          <Button
            asChild
            variant={mode === key ? 'default' : 'outline'}
            key={key}
          >
            <Link
              href={`/user/${slug}?mode=${key}`}
              className="flex items-center gap-2"
            >
              <span className="max-[250px]:hidden">{label}</span>
              <Icon />
            </Link>
          </Button>
        ))}
      </div>
      {glucoseLogs?.length > 0 ? (
        <div>
          {mode === 'list' && <GlucoseLogList glucoseLogs={glucoseLogs} />}
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
