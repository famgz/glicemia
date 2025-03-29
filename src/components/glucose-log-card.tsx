'use client';

import { GlucoseLog } from '@prisma/client';
import { AlignLeftIcon } from 'lucide-react';
import { useState } from 'react';

import DeleteGlucoseLogButton from '@/components/delete-glucose-log-button';
import EditGlucoseLogButton from '@/components/edit-glucose-log-button';
import GlucoseLogDate from '@/components/glucose-log-date';
import GlucoseLogMealTypeBadge from '@/components/glucose-log-meal-type-badge';
import GlucoseLogValue from '@/components/glucose-log-value';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog';

interface Props {
  glucoseLog: GlucoseLog;
}

export default function GlucoseLogCard({ glucoseLog }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card
        onClick={() => setOpen(true)}
        className="hover:bg-muted-foreground/5 cursor-pointer gap-3 py-4"
      >
        <CardHeader className="px-4">
          <CardTitle>
            <div className="flex items-start justify-between">
              <GlucoseLogDate glucoseLog={glucoseLog} />
              <GlucoseLogMealTypeBadge glucoseLog={glucoseLog} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between px-4">
          <GlucoseLogValue glucoseLog={glucoseLog} />
          {glucoseLog.notes && (
            <AlignLeftIcon className="text-muted-foreground" />
          )}
        </CardContent>
      </Card>
      <DialogContent>
        <DialogTitle className="sr-only">Are you absolutely sure?</DialogTitle>
        <div className="flex flex-col gap-3">
          <div className="flex w-full justify-between py-5">
            <GlucoseLogDate glucoseLog={glucoseLog} />
            <GlucoseLogValue glucoseLog={glucoseLog} />
            <GlucoseLogMealTypeBadge glucoseLog={glucoseLog} />
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
            callbackFn={() => setOpen(false)}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
