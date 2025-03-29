import { PlusIcon } from 'lucide-react';
import { notFound } from 'next/navigation';

import { getSessionUserElseRedirectToLogin } from '@/actions/auth';
import { getGlucoseLogs } from '@/actions/glucose';
import GlucoseLogs from '@/components/glucose-log/glucose-logs';
import UpsertGlucoseLogDialog from '@/components/glucose-log/upsert-glucose-log-dialog';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/time';

export default async function LogsPage() {
  const user = await getSessionUserElseRedirectToLogin();
  const glucoseLogs = await getGlucoseLogs();

  if (!glucoseLogs) return notFound();

  return (
    <div className="expanded container gap-8 py-6 md:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg">
            Olá, <span className="font-medium">{user.name?.split(' ')[0]}</span>
          </p>
          <p className="text-muted-foreground text-sm">{formatDate()}</p>
        </div>
        <UpsertGlucoseLogDialog>
          <Button className="gap-2 font-medium sm:text-lg">
            <PlusIcon strokeWidth={3} />
            <span>Nova medição</span>
          </Button>
        </UpsertGlucoseLogDialog>
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-semibold">Medições</h1>
        <GlucoseLogs glucoseLogs={glucoseLogs} />
      </div>
    </div>
  );
}
