'use client';

import { GlucoseLog } from '@prisma/client';
import { Trash2Icon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';

import { deleteGlucoseLog } from '@/actions/glucose';
import GlucoseLogDate from '@/components/glucose-log/date';
import GlucoseLogMealTypeBadge from '@/components/glucose-log/meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log/value';
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
import { Button } from '@/components/ui/button';

interface Props {
  glucoseLog: GlucoseLog;
  callbackFn?: () => void;
}

export default function DeleteGlucoseLogButton({
  glucoseLog,
  callbackFn = () => {},
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDelete() {
    startTransition(async () => {
      const res = await deleteGlucoseLog(glucoseLog.id);
      if (res) {
        setTimeout(callbackFn, 300);
        toast.success('Medição removida com sucesso!');
      } else {
        toast.error('Erro ao remover medição');
      }
    });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={'outline'}>
          <span className="max-[300px]:hidden">Remover</span>
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja remover esta medição?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação é irreversível.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex w-full justify-between py-5">
          <GlucoseLogDate glucoseLog={glucoseLog} />
          <GlucoseLogValue glucoseLog={glucoseLog} />
          <GlucoseLogMealTypeBadge mealType={glucoseLog.mealType} />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <Button type="submit" disabled={isPending} onClick={handleDelete}>
            {isPending ? 'Removendo...' : 'Remover'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
