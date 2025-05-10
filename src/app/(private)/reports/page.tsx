import { GlucoseLog, MealType } from '@prisma/client';

import { getSessionUserElseRedirectToLogin } from '@/actions/auth';
import { getGlucoseLogs } from '@/actions/glucose';
import { groupGlucoseLogsByMealTypes } from '@/utils/glucose-log';

import PieCharts from './components/pie-charts';

export default async function ReportsPage() {
  await getSessionUserElseRedirectToLogin();
  const glucoseLogs = await getGlucoseLogs();

  if (!glucoseLogs) {
    return <p>Nenhum registro encontrado</p>;
  }

  const byMealType = groupGlucoseLogsByMealTypes({ glucoseLogs });
  const totals: Partial<Record<MealType | 'TOTAL', GlucoseLog[]>> = {
    TOTAL: glucoseLogs,
    ...byMealType,
  };

  return (
    <div className="expanded container gap-8">
      <h1 className="text-xl font-semibold">Relatórios</h1>
      <PieCharts totals={totals} />
    </div>
  );
}
