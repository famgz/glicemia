'use server';

import { notFound } from 'next/navigation';

import { getUserBySlugWithGlucoseLogs } from '@/actions/user';
import GlucoseLogTable from '@/components/glucose-log/glucose-log-table';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function UserPage({ params }: Props) {
  const slug = (await params).slug;
  const user = await getUserBySlugWithGlucoseLogs(slug);
  const glucoseLogs = user?.glucoseLogs;

  if (!glucoseLogs) {
    return notFound();
  }

  return (
    <div className="container">
      <h1 className="text-lg">
        Histórico de medições de{' '}
        <span className="font-semibold capitalize">
          {user.name?.split(' ')[0]}
        </span>
        <GlucoseLogTable glucoseLogs={glucoseLogs} />
      </h1>
    </div>
  );
}
