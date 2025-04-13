'use client';

import { GlucoseLog } from '@prisma/client';
import { ReactNode, useState } from 'react';

import GlucoseLogDate from '@/components/glucose-log/date';
import DeleteGlucoseLogButton from '@/components/glucose-log/delete-button';
import EditGlucoseLogButton from '@/components/glucose-log/edit-button';
import GlucoseLogMealTypeBadge from '@/components/glucose-log/meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log/value';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Props {
  glucoseLog: GlucoseLog;
  children: ReactNode;
}

export default function GlucoseLogDetailsDialog({
  children,
  glucoseLog,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="max-sm:w-full">{children}</DialogTrigger>
      <DialogContent>
        <DialogTitle className="sr-only">
          Detalhes da medição de glicemia
        </DialogTitle>
        <div className="flex flex-col gap-3">
          <div className="flex w-full items-center justify-between">
            <GlucoseLogDate glucoseLog={glucoseLog} />
            <GlucoseLogMealTypeBadge mealType={glucoseLog.mealType} />
          </div>
          <div className="flex w-full justify-center">
            <GlucoseLogValue glucoseLog={glucoseLog} />
          </div>
          <div>
            <p className="text-foreground">Notas</p>
            <p className="text-muted-foreground">
              {glucoseLog.notes || 'Nenhuma nota para este registro'}
            </p>
          </div>
        </div>
        <DialogFooter className="flex-row justify-end gap-2">
          <EditGlucoseLogButton glucoseLog={glucoseLog} />
          <DeleteGlucoseLogButton
            glucoseLog={glucoseLog}
            // callbackFn={() => setOpen(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
