'use server';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import {
  getLoggedInDBUser,
  getUserBySlugWithGlucoseLogs,
} from '@/actions/user';
import { SocialShareButton } from '@/components/buttons/social-share';
import { Button } from '@/components/ui/button';

import ContentWrapper from './components/content-wrapper';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function UserPage({ params }: Props) {
  const slug = (await params).slug;
  const [dbUser, loggedinUser] = await Promise.all([
    getUserBySlugWithGlucoseLogs(slug),
    getLoggedInDBUser(),
  ]);
  const glucoseLogs = dbUser?.glucoseLogs;
  const isLoggedInUser = loggedinUser?.slug === slug;

  if (!glucoseLogs) {
    return notFound();
  }

  if (dbUser.privateHistory && !isLoggedInUser) {
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
        <div className="flex flex-1 justify-end print:hidden">
          <SocialShareButton url={`https://glicemia.vercel.app/user/${slug}`} />
        </div>
      </div>

      {glucoseLogs?.length > 0 ? (
        <>
          <p className="text-muted-foreground text-right text-xs">
            Total de {glucoseLogs.length} medições
          </p>
          <ContentWrapper glucoseLogs={glucoseLogs} />
        </>
      ) : (
        <div className="text-muted-foreground flex flex-col items-center gap-10 py-20 text-center">
          <span>Nenhuma registro encontrado.</span>
          {loggedinUser?.slug === slug && (
            <div>
              Faça sua primeira
              <Button className="w-fit px-1 text-base" variant={'link'} asChild>
                <Link href={'/logs'}>Medição</Link>
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
