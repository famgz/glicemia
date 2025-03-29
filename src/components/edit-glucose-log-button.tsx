'use client';

import { GlucoseLog } from '@prisma/client';
import { SquarePenIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import UpsertGlucoseLogDialog from '@/components/upsert-glucose-log-dialog';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function EditGlucoseLogButton({ glucoseLog }: Props) {
  return (
    <UpsertGlucoseLogDialog glucoseLog={glucoseLog}>
      <Button variant={'outline'}>
        <SquarePenIcon />
      </Button>
    </UpsertGlucoseLogDialog>
  );
}
