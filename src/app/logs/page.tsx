import { notFound } from 'next/navigation';

import { getSessionUserElseRedirectToLogin } from '@/actions/auth';
import { getGlucoseLogs } from '@/actions/glucose';
import CreateGlucoseLogButton from '@/components/glucose-log/create-glucose-log-button';
import GlucoseLogCards from '@/components/glucose-log/glucose-log-cards';
import { formatDate } from '@/utils/time';

export default async function LogsPage() {
  const user = await getSessionUserElseRedirectToLogin();
  const glucoseLogs = await getGlucoseLogs();

  if (!glucoseLogs) return notFound();

  return (
    <div className="expanded container gap-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg">
            Olá,{' '}
            <span className="font-medium capitalize">
              {user.name?.split(' ')[0]}
            </span>
          </p>
          <p className="text-muted-foreground text-sm">{formatDate()}</p>
        </div>
        <CreateGlucoseLogButton />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Medições</h1>
        <GlucoseLogCards glucoseLogs={glucoseLogs} />
      </div>
    </div>
  );
}
