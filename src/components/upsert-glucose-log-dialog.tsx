'use client';

import { GlucoseLog } from '@prisma/client';
import { ReactNode, useState } from 'react';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { UpsertGlucoseLogForm } from '@/components/upsert-glucose-log-form';

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
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <UpsertGlucoseLogForm
          callbackFn={() => setOpen(false)}
          glucoseLog={glucoseLog}
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
