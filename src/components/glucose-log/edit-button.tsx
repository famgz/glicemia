'use client';

import { GlucoseLog } from '@prisma/client';
import { SquarePenIcon } from 'lucide-react';

import UpsertGlucoseLogDialog from '@/components/glucose-log/upsert-dialog';
import { Button } from '@/components/ui/button';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function EditGlucoseLogButton({ glucoseLog }: Props) {
  return (
    <UpsertGlucoseLogDialog glucoseLog={glucoseLog}>
      <Button variant={'outline'}>
        <span className="max-[300px]:hidden">Editar</span>
        <SquarePenIcon />
      </Button>
    </UpsertGlucoseLogDialog>
  );
}
