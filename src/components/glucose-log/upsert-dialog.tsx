'use client';

import { GlucoseLog } from '@prisma/client';
import { ReactNode, useState } from 'react';

import { UpsertGlucoseLogForm } from '@/components/glucose-log/upsert-form';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface Props {
  glucoseLog?: GlucoseLog;
  children: ReactNode;
}

export default function UpsertGlucoseLogDialog({
  glucoseLog,
  children,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {glucoseLog ? 'Editar' : 'Criar'} medição de glicemia
          </AlertDialogTitle>
        </AlertDialogHeader>
        <UpsertGlucoseLogForm
          glucoseLog={glucoseLog}
          callbackFn={() => setOpen(false)}
        />
        <AlertDialogFooter>
          <AlertDialogCancel className="w-full">Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
