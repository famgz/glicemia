'use client';

import { GlucoseLog } from '@prisma/client';
import { SquarePenIcon } from 'lucide-react';
import { useState } from 'react';

import GlucoseLogValue from '@/components/glucose-log-value';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function EditGlucoseLogButton({ glucoseLog }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'outline'}>
          <SquarePenIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja editar esta medição?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação irá modificar as informações deste registro.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <GlucoseLogValue glucoseLog={glucoseLog} />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Continuar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
