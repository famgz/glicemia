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
  const isEdit = !!glucoseLog;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEdit ? 'Editar' : 'Criar'} medição de glicemia
          </AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <UpsertGlucoseLogForm callbackFn={() => setOpen(false)} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
