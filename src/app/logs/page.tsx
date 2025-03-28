import { PlusIcon } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { getSessionUserElseRedirectToLogin } from '@/actions/auth';
import { getGlucoseLogs } from '@/actions/glucose';
import GlucoseLogs from '@/components/glucose-logs';
import Loader from '@/components/loader';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/time';

export default async function LogsPage() {
  const user = await getSessionUserElseRedirectToLogin();
  const glucoseLogs = await getGlucoseLogs();

  if (!glucoseLogs) return notFound();

  return (
    <div className="expanded container gap-6 py-6 md:py-10">
      <div className="flex items-center justify-between">
        <div>
          <p>
            Olá, <span className="font-medium">{user.name}</span>
          </p>
          <p className="text-muted-foreground">{formatDate()}</p>
        </div>
        <Button className="gap-2 font-medium sm:text-lg">
          <PlusIcon strokeWidth={3} />
          <span>Nova medição</span>
        </Button>
      </div>
      <h1 className="text-xl font-semibold">Medições</h1>

      <Suspense fallback={<Loader />}>
        <GlucoseLogs glucoseLogs={glucoseLogs} />
      </Suspense>
    </div>
  );
}
