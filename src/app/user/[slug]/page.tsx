import { notFound } from 'next/navigation';

import GlucoseLogTable from '@/components/glucose-log/glucose-log-table';
import { db } from '@/lib/prisma';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function UserPage({ params }: Props) {
  const slug = (await params).slug;
  const user = await db.user.findUnique({ where: { slug } });

  if (!user) {
    return notFound();
  }

  const glucoseLogs = await db.glucoseLog.findMany({
    where: { userId: user.id },
  });

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
